package postgres

import (
	"context"
	"strings"

	"github.com/EmilioCliff/boffo/internal/postgres/generated"
	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.ResellerRepository = (*ResellerRepository)(nil)

type ResellerRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewResellerRepository(db *Store) *ResellerRepository {
	return &ResellerRepository{
		db:      db,
		queries: generated.New(db.pool),
	}
}

func (rr *ResellerRepository) CreateResellerSale(ctx context.Context, sale *repository.ResellerSale) (*repository.ResellerSale, error) {
	err := rr.db.ExecTx(ctx, func(q *generated.Queries) error {
		totalAvailable, err := q.GetResellerBatchInventoryProductSum(ctx, generated.GetResellerBatchInventoryProductSumParams{
			ResellerID: int64(sale.ResellerID),
			ProductID:  int64(sale.ProductID),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller batch inventory product sum: %s", err.Error())
		}

		if totalAvailable < int64(sale.Quantity) {
			return pkg.Errorf(pkg.INVALID_ERROR, "insufficient stock for reseller sale")
		}

		// create reseller sale record
		pgSale, err := q.CreateResellerSalesRecord(ctx, generated.CreateResellerSalesRecordParams{
			ResellerID:   int64(sale.ResellerID),
			ProductID:    int64(sale.ProductID),
			Quantity:     sale.Quantity,
			SellingPrice: pkg.Float64ToPgTypeNumeric(sale.SellingPrice),
			DateSold:     sale.DateSold,
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create reseller sale: %s", err.Error())
		}
		sale.ID = uint32(pgSale.ID)
		sale.TotalAmount = pkg.PgTypeNumericToFloat64(pgSale.TotalAmount)
		sale.CreatedAt = pgSale.CreatedAt

		// create stock movement record
		stockMovement, err := q.CreateStockMovementRecord(ctx, generated.CreateStockMovementRecordParams{
			ProductID:    int64(sale.ProductID),
			OwnerType:    "RESELLER",
			OwnerID:      pgtype.Int8{Int64: int64(sale.ResellerID), Valid: true},
			MovementType: "OUT",
			Quantity:     int64(sale.Quantity),
			UnitPrice:    pkg.Float64ToPgTypeNumeric(sale.SellingPrice),
			Source:       "SALE",
			Note:         "Reseller Sale",
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create stock movement record: %s", err.Error())
		}

		// update reseller stock
		_, err = q.SubtractResellerStockQuantity(ctx, generated.SubtractResellerStockQuantityParams{
			ProductID:  int64(sale.ProductID),
			ResellerID: int64(sale.ResellerID),
			Quantity:   int64(sale.Quantity),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update reseller stock: %s", err.Error())
		}

		batches, err := q.ListResellerBatchInventoryForUpdate(ctx, generated.ListResellerBatchInventoryForUpdateParams{
			ResellerID: int64(sale.ResellerID),
			ProductID:  int64(sale.ProductID),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list reseller batch inventory for update: %s", err.Error())
		}

		quantityToDeduct := int64(sale.Quantity)
		saleCogs := 0.0

		for _, batch := range batches {
			if quantityToDeduct <= 0 {
				break
			}

			takeQty := min(batch.RemainingQuantity, quantityToDeduct)

			_, err = q.RemoveResellerBatchInventoryQuantity(ctx, generated.RemoveResellerBatchInventoryQuantityParams{
				InventoryID: batch.ID,
				Quantity:    takeQty,
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to deduct reseller batch inventory quantity: %s", err.Error())
			}

			_, err = q.CreateStockMovementBatchRecord(ctx, generated.CreateStockMovementBatchRecordParams{
				Owner:           "RESELLER",
				StockMovementID: stockMovement.ID,
				BatchID:         batch.SourceBatchID,
				BatchNumber:     batch.BatchNumber,
				Quantity:        takeQty,
				UnitCost:        batch.UnitCost,
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create stock movement batch record: %s", err.Error())
			}

			saleCogs += float64(takeQty) * pkg.PgTypeNumericToFloat64(batch.UnitCost)
			quantityToDeduct -= takeQty
		}

		// update reseller account
		resellerAccount, err := q.GetResellerAccount(ctx, int64(sale.ResellerID))
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller account: %s", err.Error())
		}

		_, err = q.UpdateResellerAccount(ctx, generated.UpdateResellerAccountParams{
			ResellerID:         int64(sale.ResellerID),
			TotalStockReceived: pgtype.Int8{Valid: false},
			TotalValueReceived: pgtype.Numeric{Valid: false},
			TotalSalesValue:    pkg.Float64ToPgTypeNumeric(pkg.PgTypeNumericToFloat64(resellerAccount.TotalSalesValue) + sale.TotalAmount),
			TotalPaid:          pgtype.Numeric{Valid: false},
			TotalCogs:          pkg.Float64ToPgTypeNumeric(pkg.PgTypeNumericToFloat64(resellerAccount.TotalCogs) + saleCogs),
			Balance:            pgtype.Numeric{Valid: false},
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update reseller account: %s", err.Error())
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return sale, nil
}

func (rr *ResellerRepository) ListResellerSales(ctx context.Context, filter *repository.ResellerSaleFilter) ([]*repository.ResellerSale, *pkg.Pagination, error) {
	listParams := generated.ListResellerSalesParams{
		Limit:      int32(filter.Pagination.PageSize),
		Offset:     pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		ProductID:  pgtype.Int8{Valid: false},
		ResellerID: pgtype.Int8{Valid: false},
	}
	countParams := generated.ListResellerSalesCountParams{
		ProductID:  pgtype.Int8{Valid: false},
		ResellerID: pgtype.Int8{Valid: false},
	}

	if filter.ProductID != nil {
		listParams.ProductID = pgtype.Int8{Int64: int64(*filter.ProductID), Valid: true}
		countParams.ProductID = pgtype.Int8{Int64: int64(*filter.ProductID), Valid: true}
	}

	if filter.ResellerID != nil {
		listParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
		countParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
	}

	pgSales, err := rr.queries.ListResellerSales(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list reseller sales: %s", err.Error())
	}

	totalCount, err := rr.queries.ListResellerSalesCount(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count reseller sales: %s", err.Error())
	}

	sales := make([]*repository.ResellerSale, len(pgSales))
	for i, pgSale := range pgSales {
		sale := &repository.ResellerSale{
			ID:           uint32(pgSale.ID),
			ResellerID:   uint32(pgSale.ResellerID),
			ProductID:    uint32(pgSale.ProductID),
			Quantity:     pgSale.Quantity,
			SellingPrice: pkg.PgTypeNumericToFloat64(pgSale.SellingPrice),
			TotalAmount:  pkg.PgTypeNumericToFloat64(pgSale.TotalAmount),
			DateSold:     pgSale.DateSold,
			CreatedAt:    pgSale.CreatedAt,
			Product: &repository.ProductShort{
				ID:   uint32(pgSale.ProductID),
				Name: pgSale.ProductName,
				Unit: pgSale.ProductUnit,
			},
		}

		sales[i] = sale
	}

	return sales, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (rr *ResellerRepository) ListResellerStock(ctx context.Context, filter *repository.ResellerStockFilter) ([]*repository.ResellerStock, *pkg.Pagination, error) {
	listParams := generated.ListResellerStockParams{
		Limit:      int32(filter.Pagination.PageSize),
		Offset:     pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		ResellerID: pgtype.Int8{Valid: false},
		Search:     pgtype.Text{Valid: false},
		InStock:    pgtype.Bool{Valid: false},
	}

	constParams := generated.ListResellerStockCountParams{
		ResellerID: pgtype.Int8{Valid: false},
		Search:     pgtype.Text{Valid: false},
		InStock:    pgtype.Bool{Valid: false},
	}

	if filter.ResellerID != nil {
		listParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
		constParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
	}

	if filter.Search != nil {
		s := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
		constParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
	}

	if filter.InStock != nil {
		listParams.InStock = pgtype.Bool{Bool: *filter.InStock, Valid: true}
		constParams.InStock = pgtype.Bool{Bool: *filter.InStock, Valid: true}
	}

	pgResellerStocks, err := rr.queries.ListResellerStock(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list reseller stock: %s", err.Error())
	}

	totalCount, err := rr.queries.ListResellerStockCount(ctx, constParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count reseller stock: %s", err.Error())
	}

	resellerStocks := make([]*repository.ResellerStock, len(pgResellerStocks))
	for i, pgResellerStock := range pgResellerStocks {
		resellerStock := &repository.ResellerStock{
			ResellerID:        uint32(pgResellerStock.ResellerID),
			ProductID:         uint32(pgResellerStock.ProductID),
			Quantity:          pgResellerStock.Quantity,
			LowStockThreshold: uint32(pgResellerStock.LowStockThreshold),
			ProductCategory:   pgResellerStock.Category,
			Product: &repository.ProductShort{
				ID:    uint32(pgResellerStock.ProductID),
				Name:  pgResellerStock.Name,
				Price: pkg.PgTypeNumericToFloat64(pgResellerStock.Price),
				Unit:  pgResellerStock.Unit,
			},
		}

		resellerStocks[i] = resellerStock
	}

	return resellerStocks, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (rr *ResellerRepository) UpdateResellerStockThreshold(ctx context.Context, update *repository.ResellerStockUpdate) (*repository.ResellerStock, error) {
	pgRellerProductStock, err := rr.queries.UpdateResellerStockThreshold(ctx, generated.UpdateResellerStockThresholdParams{
		ResellerID:        int64(update.ResellerID),
		ProductID:         int64(update.ProductID),
		LowStockThreshold: int32(update.LowStockThreshold),
	})
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update reseller stock threshold: %s", err.Error())
	}

	resellerStock := &repository.ResellerStock{
		ResellerID:        uint32(pgRellerProductStock.ResellerID),
		ProductID:         uint32(pgRellerProductStock.ProductID),
		Quantity:          pgRellerProductStock.Quantity,
		LowStockThreshold: uint32(pgRellerProductStock.LowStockThreshold),
	}

	return resellerStock, nil
}

func (rr *ResellerRepository) GetResellerAccount(ctx context.Context, resellerID uint32) (*repository.ResellerAccount, error) {
	pgResellerAccount, err := rr.queries.GetResellerAccount(ctx, int64(resellerID))
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller account: %s", err.Error())
	}

	resellerAccount := &repository.ResellerAccount{
		ResellerID:         resellerID,
		TotalStockReceived: pgResellerAccount.TotalStockReceived,
		TotalValueReceived: pkg.PgTypeNumericToFloat64(pgResellerAccount.TotalValueReceived),
		TotalSalesValue:    pkg.PgTypeNumericToFloat64(pgResellerAccount.TotalSalesValue),
		TotalPaid:          pkg.PgTypeNumericToFloat64(pgResellerAccount.TotalPaid),
		TotalCogs:          pkg.PgTypeNumericToFloat64(pgResellerAccount.TotalCogs),
		Balance:            pkg.PgTypeNumericToFloat64(pgResellerAccount.Balance),
	}

	return resellerAccount, nil
}
