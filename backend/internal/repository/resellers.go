package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/boffo/pkg"
)

type ResellerStock struct {
	ResellerID        uint32 `json:"reseller_id"`
	ProductID         uint32 `json:"product_id"`
	Quantity          int64  `json:"quantity"`
	LowStockThreshold uint32 `json:"low_stock_threshold"`

	// expandable fields
	User            *UserShort    `json:"user,omitempty"`
	Product         *ProductShort `json:"product,omitempty"`
	ProductCategory string        `json:"product_category,omitempty"`
}

type ResellerStockFilter struct {
	Pagination *pkg.Pagination
	ResellerID *uint32
	Search     *string
	InStock    *bool
}

type ResellerStockUpdate struct {
	ResellerID        uint32 `json:"reseller_id"`
	ProductID         uint32 `json:"product_id"`
	LowStockThreshold uint32 `json:"low_stock_threshold"`
}

type ResellerSale struct {
	ID           uint32    `json:"id"`
	ResellerID   uint32    `json:"reseller_id"`
	ProductID    uint32    `json:"product_id"`
	Quantity     int32     `json:"quantity"`
	SellingPrice float64   `json:"selling_price"`
	TotalAmount  float64   `json:"total_amount"`
	DateSold     time.Time `json:"date_sold"`
	CreatedAt    time.Time `json:"created_at"`

	// expandable fields
	User            *UserShort    `json:"user,omitempty"`
	Product         *ProductShort `json:"product,omitempty"`
	ProductCategory string        `json:"product_category,omitempty"`
}

type ResellerSaleFilter struct {
	Pagination *pkg.Pagination
	ResellerID *uint32
	ProductID  *uint32
}

type ResellerAccount struct {
	ResellerID         uint32  `json:"reseller_id"`
	TotalStockReceived int64   `json:"total_stock_received"`
	TotalValueReceived float64 `json:"total_value_received"`
	TotalSalesValue    float64 `json:"total_sales_value"`
	TotalPaid          float64 `json:"total_paid"`
	TotalCogs          float64 `json:"total_cogs"`
	Balance            float64 `json:"balance"`
}

type ResellerRepository interface {
	// Goods requests
	CreateGoodsRequest(ctx context.Context, request *GoodsRequest) (*GoodsRequest, error)
	ListGoodsRequestsByReseller(ctx context.Context, filter *GoodRequestFilter) ([]*GoodsRequest, *pkg.Pagination, error)
	UpdateGoodsRequestByReseller(ctx context.Context, update *ResellerUpdateGoodsRequest) (*GoodsRequest, error)
	CancelGoodsRequestByReseller(ctx context.Context, id uint32) error

	// Sales
	CreateResellerSale(ctx context.Context, sale *ResellerSale) (*ResellerSale, error)
	ListResellerSales(ctx context.Context, filter *ResellerSaleFilter) ([]*ResellerSale, *pkg.Pagination, error)

	// Stock
	ListResellerStock(ctx context.Context, filter *ResellerStockFilter) ([]*ResellerStock, *pkg.Pagination, error)
	UpdateResellerStockThreshold(ctx context.Context, update *ResellerStockUpdate) (*ResellerStock, error)

	// Account
	GetResellerAccount(ctx context.Context, resellerID uint32) (*ResellerAccount, error)
}
