package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/boffo/pkg"
)

type StockMovement struct {
	ID           uint32    `json:"id"`
	ProductID    uint32    `json:"product_id"`
	OwnerType    string    `json:"owner_type"`
	OwnerID      *uint32   `json:"owner_id"`
	MovementType string    `json:"movement_type"`
	Quantity     int64     `json:"quantity"`
	UnitPrice    float64   `json:"unit_price"`
	Source       string    `json:"source"`
	Note         string    `json:"note"`
	CreatedAt    time.Time `json:"created_at"`

	// expandable fields
	Product         *ProductShort `json:"product,omitempty"`
	User            *UserShort    `json:"user,omitempty"`
	ProductCategory string        `json:"product_category,omitempty"`
}

type StockMovementFilter struct {
	Pagination   *pkg.Pagination
	ProductID    *uint32
	OwnerType    *string
	OwnerID      *uint32
	MovementType *string
	Source       *string
}

type StockMovementRepository interface {
	List(ctx context.Context, filter *StockMovementFilter) ([]*StockMovement, *pkg.Pagination, error)
}
