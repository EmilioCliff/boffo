package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/boffo/pkg"
)

type Product struct {
	ID                uint32    `json:"id"`
	Name              string    `json:"name"`
	Description       string    `json:"description"`
	Price             float64   `json:"price"`
	Category          string    `json:"category"`
	Unit              string    `json:"unit"`
	LowStockThreshold int32     `json:"low_stock_threshold"`
	Deleted           bool      `json:"deleted"`
	CreatedAt         time.Time `json:"created_at"`
}

type ProductShort struct {
	ID                uint32  `json:"id"`
	Name              string  `json:"name"`
	Price             float64 `json:"price"`
	Unit              string  `json:"unit"`
	LowStockThreshold int32   `json:"low_stock_threshold"`
	Description       string  `json:"description,omitempty"`
}

type ProductUpdate struct {
	Name              *string  `json:"name"`
	Description       *string  `json:"description"`
	Price             *float64 `json:"price"`
	Category          *string  `json:"category"`
	Unit              *string  `json:"unit"`
	LowStockThreshold *int32   `json:"low_stock_threshold"`
}

type ProductFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	Status     *string
}

type ProductRepository interface {
	Create(ctx context.Context, product *Product) (*Product, error)
	GetByID(ctx context.Context, id int64) (*Product, error)
	Update(ctx context.Context, id int64, productUpdate *ProductUpdate) (*Product, error)
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, filter *ProductFilter) ([]*Product, *pkg.Pagination, error)

	ProductFormHelper(ctx context.Context) (any, error)
}
