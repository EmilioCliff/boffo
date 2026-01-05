package repository

import (
	"context"
	"time"

	"github.com/EmilioCliff/boffo/pkg"
)

type Payment struct {
	ID         uint32    `json:"id"`
	ResellerID uint32    `json:"reseller_id"`
	Amount     float64   `json:"amount"`
	Method     string    `json:"method"`
	Reference  string    `json:"reference"`
	RecordedBy string    `json:"recorded_by"`
	DatePaid   time.Time `json:"date_paid"`
	CreatedAt  time.Time `json:"created_at"`

	// expandable fields
	User *UserShort `json:"user,omitempty"`
}

type PaymentFilter struct {
	Pagination *pkg.Pagination
	Search     *string
	ResellerID *uint32
	Method     *string
	RecordedBy *string
	DateFrom   *time.Time
	DateTo     *time.Time
}

type PaymentRepository interface {
	CreatePayment(ctx context.Context, payment *Payment) (*Payment, error)
	ListPayments(ctx context.Context, filter *PaymentFilter) ([]*Payment, *pkg.Pagination, error)
}
