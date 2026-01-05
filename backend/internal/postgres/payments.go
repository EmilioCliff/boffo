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

var _ repository.PaymentRepository = (*PaymentRepository)(nil)

type PaymentRepository struct {
	queries *generated.Queries
	db      *Store
}

func NewPaymentRepository(db *Store) *PaymentRepository {
	return &PaymentRepository{
		db:      db,
		queries: generated.New(db.pool),
	}
}

func (pr *PaymentRepository) CreatePayment(ctx context.Context, payment *repository.Payment) (*repository.Payment, error) {
	err := pr.db.ExecTx(ctx, func(q *generated.Queries) error {
		// create payment record
		createParams := generated.CreatePaymentParams{
			ResellerID: int64(payment.ResellerID),
			Amount:     pkg.Float64ToPgTypeNumeric(payment.Amount),
			Method:     payment.Method,
			Reference:  pgtype.Text{Valid: false},
			RecordedBy: payment.RecordedBy,
			DatePaid:   payment.DatePaid,
		}

		if payment.Reference != "" {
			createParams.Reference = pgtype.Text{String: payment.Reference, Valid: true}
		}

		pgPayment, err := q.CreatePayment(ctx, createParams)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create payment: %s", err.Error())
		}

		payment.ID = uint32(pgPayment.ID)
		payment.CreatedAt = pgPayment.CreatedAt

		// update reseller account balance
		resellerAccount, err := q.GetResellerAccount(ctx, int64(payment.ResellerID))
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller account: %s", err.Error())
		}

		_, err = q.UpdateResellerAccount(ctx, generated.UpdateResellerAccountParams{
			ResellerID:         int64(payment.ResellerID),
			TotalStockReceived: pgtype.Int8{Valid: false},
			TotalValueReceived: pgtype.Numeric{Valid: false},
			TotalSalesValue:    pgtype.Numeric{Valid: false},
			TotalPaid:          pkg.Float64ToPgTypeNumeric(pkg.PgTypeNumericToFloat64(resellerAccount.TotalPaid) + payment.Amount),
			TotalCogs:          pgtype.Numeric{Valid: false},
			Balance:            pkg.Float64ToPgTypeNumeric(pkg.PgTypeNumericToFloat64(resellerAccount.Balance) - payment.Amount),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update reseller account: %s", err.Error())
		}

		// update admin account balance
		adminstats, err := q.GetAdminStats(ctx, 1)
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get admin stats: %s", err.Error())
		}

		_, err = q.UpdateAdminStats(ctx, generated.UpdateAdminStatsParams{
			ID:                    1,
			TotalCompanyStock:     pgtype.Int8{Valid: false},
			TotalStockDistributed: pgtype.Int8{Valid: false},
			TotalValueDistributed: pgtype.Numeric{Valid: false},
			TotalPaymentsReceived: pkg.Float64ToPgTypeNumeric(pkg.PgTypeNumericToFloat64(adminstats.TotalPaymentsReceived) + payment.Amount),
		})
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update admin stats: %s", err.Error())
		}

		resellerName, err := q.GetResellerNameByID(ctx, int64(payment.ResellerID))
		if err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller: %s", err.Error())
		}

		// create alert
		if err = q.CreateAlert(ctx, generated.CreateAlertParams{
			Type:        "PAYMENT_RECEIVED",
			Title:       "Payment Received",
			Description: fmt.Sprintf("KES %.0f from %s", payment.Amount, resellerName),
		}); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create alert: %s", err.Error())
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return payment, nil
}

func (pr *PaymentRepository) ListPayments(ctx context.Context, filter *repository.PaymentFilter) ([]*repository.Payment, *pkg.Pagination, error) {
	listParams := generated.ListPaymentsParams{
		Limit:      int32(filter.Pagination.PageSize),
		Offset:     pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		Search:     pgtype.Text{Valid: false},
		ResellerID: pgtype.Int8{Valid: false},
		Method:     pgtype.Text{Valid: false},
		RecordedBy: pgtype.Text{Valid: false},
		DateFrom:   pgtype.Date{Valid: false},
		DateTo:     pgtype.Date{Valid: false},
	}

	countParams := generated.ListPaymentsCountParams{
		Search:     pgtype.Text{Valid: false},
		ResellerID: pgtype.Int8{Valid: false},
		Method:     pgtype.Text{Valid: false},
		RecordedBy: pgtype.Text{Valid: false},
		DateFrom:   pgtype.Date{Valid: false},
		DateTo:     pgtype.Date{Valid: false},
	}

	if filter.Search != nil {
		s := strings.ToLower(*filter.Search)
		listParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
		countParams.Search = pgtype.Text{String: "%" + s + "%", Valid: true}
	}

	if filter.ResellerID != nil {
		listParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
		countParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
	}

	if filter.Method != nil {
		listParams.Method = pgtype.Text{String: *filter.Method, Valid: true}
		countParams.Method = pgtype.Text{String: *filter.Method, Valid: true}
	}

	if filter.RecordedBy != nil {
		listParams.RecordedBy = pgtype.Text{String: *filter.RecordedBy, Valid: true}
		countParams.RecordedBy = pgtype.Text{String: *filter.RecordedBy, Valid: true}
	}

	if filter.DateFrom != nil {
		listParams.DateFrom = pgtype.Date{Time: *filter.DateFrom, Valid: true}
		countParams.DateFrom = pgtype.Date{Time: *filter.DateFrom, Valid: true}
	}

	if filter.DateTo != nil {
		listParams.DateTo = pgtype.Date{Time: *filter.DateTo, Valid: true}
		countParams.DateTo = pgtype.Date{Time: *filter.DateTo, Valid: true}
	}

	pgPayments, err := pr.queries.ListPayments(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list payments: %s", err.Error())
	}

	totalCount, err := pr.queries.ListPaymentsCount(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count payments: %s", err.Error())
	}

	payments := make([]*repository.Payment, len(pgPayments))
	for i, pgPayment := range pgPayments {
		payments[i] = &repository.Payment{
			ID:         uint32(pgPayment.ID),
			ResellerID: uint32(pgPayment.ResellerID),
			Amount:     pkg.PgTypeNumericToFloat64(pgPayment.Amount),
			Method:     pgPayment.Method,
			Reference:  "",
			RecordedBy: pgPayment.RecordedBy,
			DatePaid:   pgPayment.DatePaid,
			CreatedAt:  pgPayment.CreatedAt,
			User: &repository.UserShort{
				ID:          uint32(pgPayment.ID),
				Name:        pgPayment.Name,
				PhoneNumber: pgPayment.PhoneNumber,
			},
		}

		if pgPayment.Reference.Valid {
			payments[i].Reference = pgPayment.Reference.String
		}
	}

	return payments, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}
