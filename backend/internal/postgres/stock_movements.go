package postgres

import (
	"context"
	"strings"

	"github.com/EmilioCliff/boffo/internal/postgres/generated"
	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.StockMovementRepository = (*StockMovementRepository)(nil)

type StockMovementRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewStockMovementRepository(db *Store) *StockMovementRepository {
	return &StockMovementRepository{
		db:      db,
		queries: generated.New(db.pool),
	}
}

func (smr *StockMovementRepository) List(ctx context.Context, filter *repository.StockMovementFilter) ([]*repository.StockMovement, *pkg.Pagination, error) {
	listParams := generated.ListStockMovementsParams{
		Limit:        int32(filter.Pagination.PageSize),
		Offset:       pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:       pgtype.Text{Valid: false},
		OwnerType:    pgtype.Text{Valid: false},
		OwnerID:      pgtype.Int8{Valid: false},
		ProductID:    pgtype.Int8{Valid: false},
		MovementType: pgtype.Text{Valid: false},
		Source:       pgtype.Text{Valid: false},
	}

	countParams := generated.ListStockMovementsCountParams{
		Search:       pgtype.Text{Valid: false},
		OwnerType:    pgtype.Text{Valid: false},
		OwnerID:      pgtype.Int8{Valid: false},
		ProductID:    pgtype.Int8{Valid: false},
		MovementType: pgtype.Text{Valid: false},
		Source:       pgtype.Text{Valid: false},
	}

	if filter.Search != nil {
		s := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
	}

	if filter.OwnerType != nil {
		listParams.OwnerType = pgtype.Text{String: *filter.OwnerType, Valid: true}
		countParams.OwnerType = pgtype.Text{String: *filter.OwnerType, Valid: true}
	}

	if filter.OwnerID != nil {
		listParams.OwnerID = pgtype.Int8{Int64: int64(*filter.OwnerID), Valid: true}
		countParams.OwnerID = pgtype.Int8{Int64: int64(*filter.OwnerID), Valid: true}
	}

	if filter.ProductID != nil {
		listParams.ProductID = pgtype.Int8{Int64: int64(*filter.ProductID), Valid: true}
		countParams.ProductID = pgtype.Int8{Int64: int64(*filter.ProductID), Valid: true}
	}

	if filter.MovementType != nil {
		listParams.MovementType = pgtype.Text{String: *filter.MovementType, Valid: true}
		countParams.MovementType = pgtype.Text{String: *filter.MovementType, Valid: true}
	}

	if filter.Source != nil {
		listParams.Source = pgtype.Text{String: *filter.Source, Valid: true}
		countParams.Source = pgtype.Text{String: *filter.Source, Valid: true}
	}

	pgStockMovements, err := smr.queries.ListStockMovements(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list stock movements: %s", err.Error())
	}

	totalCount, err := smr.queries.ListStockMovementsCount(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count stock movements: %s", err.Error())
	}

	stockMovements := make([]*repository.StockMovement, len(pgStockMovements))
	for i, pgStockMovement := range pgStockMovements {
		stockMovement := &repository.StockMovement{
			ID:           uint32(pgStockMovement.ID),
			ProductID:    uint32(pgStockMovement.ProductID),
			OwnerType:    pgStockMovement.OwnerType,
			OwnerID:      nil,
			MovementType: pgStockMovement.MovementType,
			Quantity:     pgStockMovement.Quantity,
			UnitPrice:    pkg.PgTypeNumericToFloat64(pgStockMovement.UnitPrice),
			Source:       pgStockMovement.Source,
			Note:         pgStockMovement.Note,
			CreatedAt:    pgStockMovement.CreatedAt,
			Product: &repository.ProductShort{
				ID: uint32(pgStockMovement.ProductID),
			},
			User: &repository.UserShort{},
		}

		if pgStockMovement.ProductCategory.Valid {
			stockMovement.ProductCategory = pgStockMovement.ProductCategory.String
		}

		if pgStockMovement.OwnerID.Valid {
			oid := uint32(pgStockMovement.OwnerID.Int64)
			stockMovement.OwnerID = &oid
		}

		if pgStockMovement.ProductName.Valid {
			stockMovement.Product.Name = pgStockMovement.ProductName.String
		}

		if pgStockMovement.ProductUnit.Valid {
			stockMovement.Product.Unit = pgStockMovement.ProductUnit.String
		}

		if pgStockMovement.OwnerType == "RESELLER" {
			if pgStockMovement.OwnerID.Valid {
				stockMovement.User.ID = uint32(pgStockMovement.OwnerID.Int64)
			}
			if pgStockMovement.OwnerName.Valid {
				stockMovement.User.Name = pgStockMovement.OwnerName.String
			}
			if pgStockMovement.OwnerPhoneNumber.Valid {
				stockMovement.User.PhoneNumber = pgStockMovement.OwnerPhoneNumber.String
			}
		}

		stockMovements[i] = stockMovement
	}

	return stockMovements, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}
