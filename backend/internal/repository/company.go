package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/boffo/pkg"
)

type CompanyStock struct {
	ProductID uint32 `json:"product_id"`
	Quantity  int64  `json:"quantity"`

	// expandable fields
	Product         *ProductShort `json:"product,omitempty"`
	ProductCategory string        `json:"product_category,omitempty"`
}

type CompanyStockFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	InStock    *bool
}

type AdminStat struct {
	ID                       uint32  `json:"id"`
	TotalCompanyStock        uint32  `json:"TotalCompanyStock"`
	TotalStockDistributed    uint32  `json:"TotalStockDistributed"`
	TotalValueDistributed    float64 `json:"TotalValueDistributed"`
	TotalPaymentsReceived    float64 `json:"TotalPaymentsReceived"`
	TotalOutstandingPayments float64 `json:"TotalOutstandingPayments"`
	TotalActiveResellers     uint32  `json:"TotalActiveResellers"`
	TotalPendingRequests     uint32  `json:"TotalPendingRequests"`
	TotalLowStockProducts    uint32  `json:"TotalLowStockProducts"`
}

type ProductBatch struct {
	ID            uint32    `json:"id"`
	ProductID     uint32    `json:"product_id"`
	BatchNumber   string    `json:"batch_number"`
	Quantity      int64     `json:"quantity"`
	PurchasePrice float64   `json:"purchase_price"`
	DateReceived  time.Time `json:"date_received"`
	CreatedAt     time.Time `json:"created_at"`

	// expandable fields
	RemainingQuantity int64         `json:"remaining_quantity,omitempty"`
	ProductCategory   string        `json:"product_category,omitempty"`
	Product           *ProductShort `json:"product,omitempty"`
}

type ProductBatchFilter struct {
	Pagination *pkg.Pagination
	ProductID  *uint32
	InStock    *bool
	Search     *string
}

type StockDistribution struct {
	ID              uint32    `json:"id"`
	ResellerID      uint32    `json:"reseller_id"`
	ProductID       uint32    `json:"product_id"`
	Quantity        int32     `json:"quantity"`
	UnitPrice       float64   `json:"unit_price"`
	TotalPrice      float64   `json:"total_price"`
	DateDistributed time.Time `json:"date_distributed"`
	CreatedAt       time.Time `json:"created_at"`

	// expandable fields
	Product *ProductShort `json:"product,omitempty"`
	User    *UserShort    `json:"user,omitempty"`
}

type StockDistributionFilter struct {
	Pagination *pkg.Pagination
	ResellerID *uint32
	ProductID  *uint32
	Search     *string
}

type CompanyRepository interface {
	// Goods requests
	ListGoodsRequestsByAdmin(ctx context.Context, filter *GoodRequestFilter) ([]*GoodsRequest, *pkg.Pagination, error)
	UpdateGoodsRequestByAdmin(ctx context.Context, update *AdminUpdateGoodsRequest) (*GoodsRequest, error)

	// Stock management
	AddProductBatch(ctx context.Context, batch *ProductBatch) (*ProductBatch, error)
	ListProductBatches(ctx context.Context, filter *ProductBatchFilter) ([]*ProductBatch, *pkg.Pagination, error)
	DistributeStockToReseller(ctx context.Context, distribution *StockDistribution) (*StockDistribution, error)
	ListStockDistributions(ctx context.Context, filter *StockDistributionFilter) ([]*StockDistribution, *pkg.Pagination, error)

	ListCompanyStock(ctx context.Context, filter *CompanyStockFilter) ([]*CompanyStock, *pkg.Pagination, error)

	// Admin stats
	GetAdminStats(ctx context.Context) (*AdminStat, error)

	// Helpers
	GetAdminPageData(ctx context.Context, page string) (any, error)
}
