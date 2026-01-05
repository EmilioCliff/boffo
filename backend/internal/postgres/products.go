package postgres

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/EmilioCliff/boffo/internal/postgres/generated"
	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

var _ repository.ProductRepository = (*ProductRepository)(nil)

type ProductRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewProductRepository(db *Store) *ProductRepository {
	return &ProductRepository{
		db:      db,
		queries: generated.New(db.pool),
	}
}

func (pr *ProductRepository) Create(ctx context.Context, product *repository.Product) (*repository.Product, error) {
	err := pr.db.ExecTx(ctx, func(q *generated.Queries) error {
		// create product
		createParams := generated.CreateProductParams{
			Name:              product.Name,
			Description:       pgtype.Text{Valid: false},
			Price:             pkg.Float64ToPgTypeNumeric(product.Price),
			Category:          product.Category,
			Unit:              product.Unit,
			LowStockThreshold: product.LowStockThreshold,
		}

		if product.Description != "" {
			createParams.Description = pgtype.Text{String: product.Description, Valid: true}
		}

		p, err := q.CreateProduct(ctx, createParams)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create product: %s", err.Error())
		}
		product.ID = uint32(p.ID)
		product.CreatedAt = p.CreatedAt
		product.Deleted = p.Deleted

		// create initial stock record
		_, err = q.CreateCompanyStock(ctx, int64(product.ID))
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create initial company stock record: %s", err.Error())
		}

		return nil
	})
	return product, err
}

func (pr *ProductRepository) GetByID(ctx context.Context, id int64) (*repository.Product, error) {
	p, err := pr.queries.GetProductByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, pkg.Errorf(pkg.NOT_FOUND_ERROR, "product not found")
		}
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get product: %s", err.Error())
	}

	return pgProductToRepoProduct(p), nil
}

func (pr *ProductRepository) Update(ctx context.Context, id int64, productUpdate *repository.ProductUpdate) (*repository.Product, error) {
	updateParams := generated.UpdateProductParams{
		ID:                id,
		Name:              pgtype.Text{Valid: false},
		Description:       pgtype.Text{Valid: false},
		Price:             pgtype.Numeric{Valid: false},
		Category:          pgtype.Text{Valid: false},
		Unit:              pgtype.Text{Valid: false},
		LowStockThreshold: pgtype.Int4{Valid: false},
	}
	if productUpdate.Name != nil {
		updateParams.Name = pgtype.Text{String: *productUpdate.Name, Valid: true}
	}
	if productUpdate.Description != nil {
		updateParams.Description = pgtype.Text{String: *productUpdate.Description, Valid: true}
	}
	if productUpdate.Price != nil {
		updateParams.Price = pkg.Float64ToPgTypeNumeric(*productUpdate.Price)
	}
	if productUpdate.Category != nil {
		updateParams.Category = pgtype.Text{String: *productUpdate.Category, Valid: true}
	}
	if productUpdate.Unit != nil {
		updateParams.Unit = pgtype.Text{String: *productUpdate.Unit, Valid: true}
	}
	if productUpdate.LowStockThreshold != nil {
		updateParams.LowStockThreshold = pgtype.Int4{Int32: *productUpdate.LowStockThreshold, Valid: true}
	}

	p, err := pr.queries.UpdateProduct(ctx, updateParams)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update product: %s", err.Error())
	}

	return pgProductToRepoProduct(p), nil
}

func (pr *ProductRepository) Delete(ctx context.Context, id int64) error {
	err := pr.db.ExecTx(ctx, func(q *generated.Queries) error {
		err := q.DeleteProduct(ctx, id)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to delete product: %s", err.Error())
		}

		return nil
	})

	return err
}

func (pr *ProductRepository) List(ctx context.Context, filter *repository.ProductFilter) ([]*repository.Product, *pkg.Pagination, error) {
	listParams := generated.ListProductsParams{
		Limit:  int32(filter.Pagination.PageSize),
		Offset: pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search: pgtype.Text{Valid: false},
	}

	countSearch := pgtype.Text{Valid: false}
	if filter.Search != nil {
		s := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
		countSearch = pgtype.Text{String: "%" + s + "%", Valid: true}
	}

	products, err := pr.queries.ListProducts(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list products: %s", err.Error())
	}

	totalCount, err := pr.queries.ListProductsCount(ctx, countSearch)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count products: %s", err.Error())
	}

	repoProducts := make([]*repository.Product, len(products))
	for i, p := range products {
		repoProducts[i] = pgProductToRepoProduct(p)
	}

	return repoProducts, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (pr *ProductRepository) ProductFormHelper(ctx context.Context) (any, error) {
	products, err := pr.queries.ProductHelpers(ctx)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get product helpers: %s", err.Error())
	}

	return products, nil
}

func pgProductToRepoProduct(p generated.Product) *repository.Product {
	return &repository.Product{
		ID:                uint32(p.ID),
		Name:              p.Name,
		Description:       p.Description.String,
		Price:             pkg.PgTypeNumericToFloat64(p.Price),
		Category:          p.Category,
		Unit:              p.Unit,
		LowStockThreshold: p.LowStockThreshold,
		Deleted:           p.Deleted,
		CreatedAt:         p.CreatedAt,
	}
}
