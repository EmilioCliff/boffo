package repository

import (
	"time"

	"github.com/EmilioCliff/boffo/pkg"
)

type GoodsRequestPayload struct {
	ProductID      uint32  `json:"product_id"`
	ProductName    string  `json:"product_name"`
	Quantity       int32   `json:"quantity"`
	PriceRequested float64 `json:"price_requested"`
}

type GoodsRequest struct {
	ID          uint32                `json:"id"`
	ResellerID  uint32                `json:"reseller_id"`
	Payload     []GoodsRequestPayload `json:"payload"`
	Status      string                `json:"status"`
	Comment     string                `json:"comment"`
	Cancelled   bool                  `json:"cancelled"`
	CancelledAt *time.Time            `json:"cancelled_at"`
	UpdatedAt   time.Time             `json:"updated_at"`
	CreatedAt   time.Time             `json:"created_at"`

	// expandable fields
	User *UserShort `json:"user,omitempty"`
}

type AdminUpdateGoodsRequest struct {
	ID      uint32  `json:"id"`
	Status  *string `json:"status"`
	Comment *string `json:"comment"`
}

// can update the request if the status is still pending
type ResellerUpdateGoodsRequest struct {
	ID      uint32                `json:"id"`
	Payload []GoodsRequestPayload `json:"payload"`
}

type GoodRequestFilter struct {
	Pagination *pkg.Pagination
	ResellerID *uint32
	Status     *string
}
