package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/EmilioCliff/boffo/internal/postgres/generated"
	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.CompanyRepository = (*CompanyRepository)(nil)

type CompanyRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewCompanyRepository(db *Store) *CompanyRepository {
	return &CompanyRepository{
		queries: generated.New(db.pool),
		db:      db,
	}
}

func (cr *CompanyRepository) AddProductBatch(ctx context.Context, batch *repository.ProductBatch) (*repository.ProductBatch, error) {
	err := cr.db.ExecTx(ctx, func(q *generated.Queries) error {
		// create product batch record
		pgProductBatch, err := q.CreateProductBatchRecord(ctx, generated.CreateProductBatchRecordParams{
			ProductID:     int64(batch.ProductID),
			BatchNumber:   batch.BatchNumber,
			Quantity:      batch.Quantity,
			PurchasePrice: pkg.Float64ToPgTypeNumeric(batch.PurchasePrice),
			DateReceived:  batch.DateReceived,
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create product batch record: %s", err.Error())
		}

		batch.ID = uint32(pgProductBatch.ID)
		batch.CreatedAt = pgProductBatch.CreatedAt

		_, err = q.CreateStockMovementRecord(ctx, generated.CreateStockMovementRecordParams{
			ProductID:    int64(batch.ProductID),
			OwnerType:    "COMPANY",
			OwnerID:      pgtype.Int8{Valid: false},
			MovementType: "IN",
			Quantity:     batch.Quantity,
			UnitPrice:    pkg.Float64ToPgTypeNumeric(batch.PurchasePrice),
			Source:       "PURCHASE",
			Note:         batch.BatchNumber,
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create stock movement record: %s", err.Error())
		}

		// add batch to batch_inventory record
		_, err = q.CreateBatchInventoryRecord(ctx, generated.CreateBatchInventoryRecordParams{
			BatchID:           int64(batch.ID),
			ProductID:         int64(batch.ProductID),
			RemainingQuantity: batch.Quantity,
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create batch inventory record: %s", err.Error())
		}

		// add product stock to company stock
		_, err = q.AddCompanyStock(ctx, generated.AddCompanyStockParams{
			ProductID: int64(batch.ProductID),
			Quantity:  batch.Quantity,
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to add company stock: %s", err.Error())
		}

		// add admin_stats.total_company_stock
		adminstats, err := q.GetAdminStats(ctx, 1)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get admin stats: %s", err.Error())
		}

		_, err = q.UpdateAdminStats(ctx, generated.UpdateAdminStatsParams{
			ID:                    adminstats.ID,
			TotalCompanyStock:     pgtype.Int8{Int64: adminstats.TotalCompanyStock + int64(batch.Quantity), Valid: true},
			TotalStockDistributed: pgtype.Int8{Valid: false},
			TotalValueDistributed: pgtype.Numeric{Valid: false},
			TotalPaymentsReceived: pgtype.Numeric{Valid: false},
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update admin stats: %s", err.Error())
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return batch, nil
}

func (cr *CompanyRepository) ListProductBatches(ctx context.Context, filter *repository.ProductBatchFilter) ([]*repository.ProductBatch, *pkg.Pagination, error) {
	listParams := generated.ListProductBatchesParams{
		Limit:     int32(filter.Pagination.PageSize),
		Offset:    pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:    pgtype.Text{Valid: false},
		ProductID: pgtype.Int8{Valid: false},
	}
	countParams := generated.ListProductBatchesCountParams{
		Search:    pgtype.Text{Valid: false},
		ProductID: pgtype.Int8{Valid: false},
	}

	if filter.Search != nil {
		s := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
	}

	if filter.ProductID != nil {
		listParams.ProductID = pgtype.Int8{Int64: int64(*filter.ProductID), Valid: true}
		countParams.ProductID = pgtype.Int8{Int64: int64(*filter.ProductID), Valid: true}
	}

	pgBatches, err := cr.queries.ListProductBatches(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list product batches: %s", err.Error())
	}

	totalCount, err := cr.queries.ListProductBatchesCount(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count product batches: %s", err.Error())
	}

	batches := make([]*repository.ProductBatch, len(pgBatches))
	for i, pgBatch := range pgBatches {
		batches[i] = &repository.ProductBatch{
			ID:            uint32(pgBatch.ID),
			ProductID:     uint32(pgBatch.ProductID),
			BatchNumber:   pgBatch.BatchNumber,
			Quantity:      pgBatch.Quantity,
			PurchasePrice: pkg.PgTypeNumericToFloat64(pgBatch.PurchasePrice),
			DateReceived:  pgBatch.DateReceived,
			CreatedAt:     pgBatch.CreatedAt,
			Product: &repository.ProductShort{
				ID:                uint32(pgBatch.ProductID),
				Name:              pgBatch.ProductName,
				Price:             pkg.PgTypeNumericToFloat64(pgBatch.ProductPrice),
				Unit:              pgBatch.ProductUnit,
				LowStockThreshold: int32(pgBatch.ProductLowStockThreshold),
			},
		}
	}

	return batches, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (cr *CompanyRepository) DistributeStockToReseller(ctx context.Context, distribution *repository.StockDistribution) (*repository.StockDistribution, error) {
	err := cr.db.ExecTx(ctx, func(q *generated.Queries) error {
		totalAvailable, err := q.GetBatchInventoryProductSum(ctx, int64(distribution.ProductID))
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get batch inventory product sum: %s", err.Error())
		}

		if totalAvailable < int64(distribution.Quantity) {
			return pkg.Errorf(pkg.INVALID_ERROR, "insufficient stock available for distribution")
		}

		batches, err := q.ListBatchInventoryForUpdate(ctx, int64(distribution.ProductID))
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list batch inventory for update: %s", err.Error())
		}

		resellerName, err := q.GetResellerNameByID(ctx, int64(distribution.ResellerID))
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller: %s", err.Error())
		}

		// create stock movement records for company (OUT)
		stockMovement, err := q.CreateStockMovementRecord(ctx, generated.CreateStockMovementRecordParams{
			ProductID:    int64(distribution.ProductID),
			OwnerType:    "COMPANY",
			OwnerID:      pgtype.Int8{Valid: false},
			MovementType: "OUT",
			Quantity:     int64(distribution.Quantity),
			UnitPrice:    pkg.Float64ToPgTypeNumeric(distribution.UnitPrice),
			Source:       "DISTRIBUTION",
			Note:         fmt.Sprintf("Distributed to: %s", resellerName),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create stock movement record: %s", err.Error())
		}

		remainingToIssue := int64(distribution.Quantity)

		for _, batch := range batches {
			if remainingToIssue <= 0 {
				break
			}

			takeQty := min(batch.RemainingQuantity, remainingToIssue)

			// update batch inventory records
			_, err = q.RemoveBatchInventoryQuantity(ctx, generated.RemoveBatchInventoryQuantityParams{
				Quantity:  takeQty,
				BatchID:   batch.BatchID,
				ProductID: int64(batch.ProductID),
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to remove batch inventory quantity: %s", err.Error())
			}

			// add stock_movement_batch record
			_, err = q.CreateStockMovementBatchRecord(ctx, generated.CreateStockMovementBatchRecordParams{
				Owner:           "COMPANY",
				StockMovementID: stockMovement.ID,
				BatchID:         batch.BatchID,
				BatchNumber:     batch.BatchNumber,
				Quantity:        takeQty,
				UnitCost:        pkg.Float64ToPgTypeNumeric(distribution.UnitPrice),
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create stock movement batch record: %s", err.Error())
			}

			_, err = q.CreateResellerBatchInventoryRecord(ctx, generated.CreateResellerBatchInventoryRecordParams{
				ResellerID:        int64(distribution.ResellerID),
				ProductID:         int64(distribution.ProductID),
				SourceBatchID:     batch.BatchID,
				BatchNumber:       batch.BatchNumber,
				RemainingQuantity: takeQty,
				UnitCost:          pkg.Float64ToPgTypeNumeric(distribution.UnitPrice),
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create reseller batch inventory record: %s", err.Error())
			}

			remainingToIssue -= takeQty
		}

		if remainingToIssue > 0 {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "insufficient stock")
		}

		// create stock distribution record
		pgStockDistribution, err := q.CreateStockDistributionRecord(ctx, generated.CreateStockDistributionRecordParams{
			ResellerID:      int64(distribution.ResellerID),
			ProductID:       int64(distribution.ProductID),
			Quantity:        distribution.Quantity,
			UnitPrice:       pkg.Float64ToPgTypeNumeric(distribution.UnitPrice),
			DateDistributed: distribution.DateDistributed,
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create stock distribution record: %s", err.Error())
		}

		distribution.ID = uint32(pgStockDistribution.ID)
		distribution.TotalPrice = pkg.PgTypeNumericToFloat64(pgStockDistribution.TotalPrice)
		distribution.CreatedAt = pgStockDistribution.CreatedAt

		// create stock movement record for reseller (IN)
		_, err = q.CreateStockMovementRecord(ctx, generated.CreateStockMovementRecordParams{
			ProductID:    int64(distribution.ProductID),
			OwnerType:    "RESELLER",
			OwnerID:      pgtype.Int8{Int64: int64(distribution.ResellerID), Valid: true},
			MovementType: "IN",
			Quantity:     int64(distribution.Quantity),
			UnitPrice:    pkg.Float64ToPgTypeNumeric(distribution.UnitPrice),
			Source:       "DISTRIBUTION",
			Note:         fmt.Sprintf("%s received products worth: %.2f", resellerName, distribution.TotalPrice),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create stock movement record: %s", err.Error())
		}

		// update company stock (reduce quantity)
		_, err = q.RemoveCompanyStock(ctx, generated.RemoveCompanyStockParams{
			ProductID: int64(distribution.ProductID),
			Quantity:  int64(distribution.Quantity),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to remove company stock: %s", err.Error())
		}

		// update reseller stock (check if exists, else create)
		resellerStockExists, err := q.CheckResellerStockExists(ctx, generated.CheckResellerStockExistsParams{
			ProductID:  int64(distribution.ProductID),
			ResellerID: int64(distribution.ResellerID),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to check reseller stock exists: %s", err.Error())
		}

		if !resellerStockExists {
			_, err = q.CreateResellerStock(ctx, generated.CreateResellerStockParams{
				ResellerID: int64(distribution.ResellerID),
				ProductID:  int64(distribution.ProductID),
				Quantity:   int64(distribution.Quantity),
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create reseller stock: %s", err.Error())
			}
		} else {
			_, err = q.AddResellerStockQuantity(ctx, generated.AddResellerStockQuantityParams{
				ResellerID: int64(distribution.ResellerID),
				ProductID:  int64(distribution.ProductID),
				Quantity:   int64(distribution.Quantity),
			})
			if err != nil {
				return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to add reseller stock quantity: %s", err.Error())
			}
		}

		// update admin stats (company stock, stock_distributed, value_distributed)
		adminstats, err := q.GetAdminStats(ctx, 1)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get admin stats: %s", err.Error())
		}

		_, err = q.UpdateAdminStats(ctx, generated.UpdateAdminStatsParams{
			ID:                    1,
			TotalCompanyStock:     pgtype.Int8{Int64: adminstats.TotalCompanyStock - int64(distribution.Quantity), Valid: true},
			TotalStockDistributed: pgtype.Int8{Int64: adminstats.TotalStockDistributed + int64(distribution.Quantity), Valid: true},
			TotalValueDistributed: pkg.Float64ToPgTypeNumeric(pkg.PgTypeNumericToFloat64(adminstats.TotalValueDistributed) + distribution.TotalPrice),
			TotalPaymentsReceived: pgtype.Numeric{Valid: false},
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update admin stats: %s", err.Error())
		}

		// update reseller account (stock_received, value_received, balance)
		resellerAccount, err := q.GetResellerAccount(ctx, int64(distribution.ResellerID))
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller account: %s", err.Error())
		}

		_, err = q.UpdateResellerAccount(ctx, generated.UpdateResellerAccountParams{
			ResellerID:         int64(distribution.ResellerID),
			TotalStockReceived: pgtype.Int8{Int64: resellerAccount.TotalStockReceived + int64(distribution.Quantity), Valid: true},
			TotalValueReceived: pkg.Float64ToPgTypeNumeric(pkg.PgTypeNumericToFloat64(resellerAccount.TotalValueReceived) + distribution.TotalPrice),
			TotalSalesValue:    pgtype.Numeric{Valid: false},
			TotalPaid:          pgtype.Numeric{Valid: false},
			TotalCogs:          pgtype.Numeric{Valid: false},
			Balance:            pkg.Float64ToPgTypeNumeric(pkg.PgTypeNumericToFloat64(resellerAccount.Balance) + distribution.TotalPrice),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update reseller account: %s", err.Error())
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return distribution, nil
}

func (cr *CompanyRepository) ListStockDistributions(ctx context.Context, filter *repository.StockDistributionFilter) ([]*repository.StockDistribution, *pkg.Pagination, error) {
	listParams := generated.ListStockDistributionsParams{
		Limit:      int32(filter.Pagination.PageSize),
		Offset:     pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:     pgtype.Text{Valid: false},
		ProductID:  pgtype.Int8{Valid: false},
		ResellerID: pgtype.Int8{Valid: false},
	}

	countParams := generated.ListStockDistributionsCountParams{
		Search:     pgtype.Text{Valid: false},
		ProductID:  pgtype.Int8{Valid: false},
		ResellerID: pgtype.Int8{Valid: false},
	}

	if filter.Search != nil {
		s := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
	}

	if filter.ProductID != nil {
		listParams.ProductID = pgtype.Int8{Int64: int64(*filter.ProductID), Valid: true}
		countParams.ProductID = pgtype.Int8{Int64: int64(*filter.ProductID), Valid: true}
	}

	if filter.ResellerID != nil {
		listParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
		countParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
	}

	pgDistributions, err := cr.queries.ListStockDistributions(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list stock distributions: %s", err.Error())
	}

	totalCount, err := cr.queries.ListStockDistributionsCount(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count stock distributions: %s", err.Error())
	}

	distributions := make([]*repository.StockDistribution, len(pgDistributions))
	for i, pgDistribution := range pgDistributions {
		distributions[i] = &repository.StockDistribution{
			ID:              uint32(pgDistribution.ID),
			ResellerID:      uint32(pgDistribution.ResellerID),
			ProductID:       uint32(pgDistribution.ProductID),
			Quantity:        int32(pgDistribution.Quantity),
			UnitPrice:       pkg.PgTypeNumericToFloat64(pgDistribution.UnitPrice),
			TotalPrice:      pkg.PgTypeNumericToFloat64(pgDistribution.TotalPrice),
			DateDistributed: pgDistribution.DateDistributed,
			CreatedAt:       pgDistribution.CreatedAt,
			Product: &repository.ProductShort{
				ID:                uint32(pgDistribution.ProductID),
				Name:              pgDistribution.ProductName.String,
				Price:             pkg.PgTypeNumericToFloat64(pgDistribution.ProductPrice),
				Unit:              pgDistribution.ProductUnit.String,
				LowStockThreshold: int32(pgDistribution.ProductLowStockThreshold.Int32),
			},
			User: &repository.UserShort{
				ID:          uint32(pgDistribution.ResellerID),
				Name:        pgDistribution.ResellerName.String,
				PhoneNumber: pgDistribution.ResellerPhoneNumber.String,
			},
		}
	}

	return distributions, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (cr *CompanyRepository) ListCompanyStock(ctx context.Context, filter *repository.CompanyStockFilter) ([]*repository.CompanyStock, *pkg.Pagination, error) {
	listParams := generated.ListCompanyStockParams{
		Limit:   int32(filter.Pagination.PageSize),
		Offset:  pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:  pgtype.Text{Valid: false},
		InStock: pgtype.Bool{Valid: false},
	}
	countParams := generated.ListCompanyStockCountParams{
		Search:  pgtype.Text{Valid: false},
		InStock: pgtype.Bool{Valid: false},
	}

	if filter.Search != nil {
		s := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
	}

	if filter.InStock != nil {
		listParams.InStock = pgtype.Bool{Bool: *filter.InStock, Valid: true}
		countParams.InStock = pgtype.Bool{Bool: *filter.InStock, Valid: true}
	}

	pgStocks, err := cr.queries.ListCompanyStock(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list company stock: %s", err.Error())
	}

	totalCount, err := cr.queries.ListCompanyStockCount(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count company stock: %s", err.Error())
	}

	stocks := make([]*repository.CompanyStock, len(pgStocks))
	for i, pgStock := range pgStocks {
		stocks[i] = &repository.CompanyStock{
			ProductID: uint32(pgStock.ProductID),
			Quantity:  pgStock.CompanyQuantity,
			Product: &repository.ProductShort{
				ID:                uint32(pgStock.ProductID),
				Name:              pgStock.Name,
				Price:             pkg.PgTypeNumericToFloat64(pgStock.Price),
				Unit:              pgStock.Unit,
				LowStockThreshold: int32(pgStock.LowStockThreshold),
			},
		}
	}

	return stocks, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (cr *CompanyRepository) GetAdminStats(ctx context.Context) (*repository.AdminStat, error) {
	pgStats, err := cr.queries.GetAdminStats(ctx, 1)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get admin stats: %s", err.Error())
	}

	return &repository.AdminStat{
		TotalCompanyStock:     uint32(pgStats.TotalCompanyStock),
		TotalStockDistributed: uint32(pgStats.TotalStockDistributed),
		TotalValueDistributed: pkg.PgTypeNumericToFloat64(pgStats.TotalValueDistributed),
		TotalPaymentsReceived: pkg.PgTypeNumericToFloat64(pgStats.TotalPaymentsReceived),
	}, nil
}
