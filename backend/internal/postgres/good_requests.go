package postgres

import (
	"context"
	"encoding/json"

	"github.com/EmilioCliff/boffo/internal/postgres/generated"
	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/jackc/pgx/v5/pgtype"
)

func (rr *ResellerRepository) CreateGoodsRequest(ctx context.Context, request *repository.GoodsRequest) (*repository.GoodsRequest, error) {
	payloadBytes, err := json.Marshal(request.Payload)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to marshal goods request payload: %s", err.Error())
	}

	pgRequest, err := rr.queries.CreateGoodsRequest(ctx, generated.CreateGoodsRequestParams{
		ResellerID: int64(request.ResellerID),
		Payload:    payloadBytes,
		Status:     "PENDING",
	})
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create goods request: %s", err.Error())
	}

	request.ID = uint32(pgRequest.ID)
	request.Status = pgRequest.Status
	request.Comment = ""
	request.Cancelled = pgRequest.Cancelled
	request.CancelledAt = nil
	request.UpdatedAt = pgRequest.UpdatedAt
	request.CreatedAt = pgRequest.CreatedAt

	return request, nil
}

func (rr *ResellerRepository) ListGoodsRequestsByReseller(ctx context.Context, filter *repository.GoodRequestFilter) ([]*repository.GoodsRequest, *pkg.Pagination, error) {
	listParams := generated.ListGoodsRequestsByResellerParams{
		Limit:      int32(filter.Pagination.PageSize),
		Offset:     pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		ResellerID: int64(*filter.ResellerID),
		Status:     pgtype.Text{Valid: false},
	}
	countParams := generated.ListGoodsRequestsByResellerCountParams{
		ResellerID: int64(*filter.ResellerID),
		Status:     pgtype.Text{Valid: false},
	}

	if filter.Status != nil {
		listParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
		countParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
	}

	pgRequests, err := rr.queries.ListGoodsRequestsByReseller(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list goods requests: %s", err.Error())
	}

	totalCount, err := rr.queries.ListGoodsRequestsByResellerCount(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count goods requests: %s", err.Error())
	}

	requests := make([]*repository.GoodsRequest, len(pgRequests))
	for i, pgRequest := range pgRequests {
		payload := []repository.GoodsRequestPayload{}

		if err = json.Unmarshal(pgRequest.Payload, &payload); err != nil {
			return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal goods request payload: %s", err.Error())
		}

		request := &repository.GoodsRequest{
			ID:          uint32(pgRequest.ID),
			ResellerID:  uint32(pgRequest.ResellerID),
			Payload:     payload,
			Status:      pgRequest.Status,
			Comment:     "",
			Cancelled:   pgRequest.Cancelled,
			CancelledAt: nil,
			UpdatedAt:   pgRequest.UpdatedAt,
			CreatedAt:   pgRequest.CreatedAt,
		}

		if pgRequest.Comment.Valid {
			request.Comment = pgRequest.Comment.String
		}

		if pgRequest.CancelledAt.Valid {
			t := pgRequest.CancelledAt.Time
			request.CancelledAt = &t
		}

		requests[i] = request
	}

	return requests, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (rr *ResellerRepository) UpdateGoodsRequestByReseller(ctx context.Context, update *repository.ResellerUpdateGoodsRequest) (*repository.GoodsRequest, error) {
	payloadBytes, err := json.Marshal(update.Payload)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to marshal goods request payload: %s", err.Error())
	}

	pgRequest, err := rr.queries.UpdateGoodsRequestPayload(ctx, generated.UpdateGoodsRequestPayloadParams{
		ID:      int64(update.ID),
		Payload: payloadBytes,
	})
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update goods request: %s", err.Error())
	}

	request := &repository.GoodsRequest{
		ID:          uint32(pgRequest.ID),
		ResellerID:  uint32(pgRequest.ResellerID),
		Payload:     update.Payload,
		Status:      pgRequest.Status,
		Comment:     "",
		Cancelled:   pgRequest.Cancelled,
		CancelledAt: nil,
		UpdatedAt:   pgRequest.UpdatedAt,
		CreatedAt:   pgRequest.CreatedAt,
	}

	if pgRequest.Comment.Valid {
		request.Comment = pgRequest.Comment.String
	}

	if pgRequest.CancelledAt.Valid {
		t := pgRequest.CancelledAt.Time
		request.CancelledAt = &t
	}

	return request, nil
}

func (cr *CompanyRepository) ListGoodsRequestsByAdmin(ctx context.Context, filter *repository.GoodRequestFilter) ([]*repository.GoodsRequest, *pkg.Pagination, error) {
	listParams := generated.ListGoodsRequestsByAdminParams{
		Limit:      int32(filter.Pagination.PageSize),
		Offset:     pkg.Offset(filter.Pagination.Page, filter.Pagination.PageSize),
		ResellerID: pgtype.Int8{Valid: false},
		Status:     pgtype.Text{Valid: false},
	}
	countParams := generated.ListGoodsRequestsByAdminCountParams{
		ResellerID: pgtype.Int8{Valid: false},
		Status:     pgtype.Text{Valid: false},
	}

	if filter.ResellerID != nil {
		listParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
		countParams.ResellerID = pgtype.Int8{Int64: int64(*filter.ResellerID), Valid: true}
	}

	if filter.Status != nil {
		listParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
		countParams.Status = pgtype.Text{String: *filter.Status, Valid: true}
	}

	pgRequests, err := cr.queries.ListGoodsRequestsByAdmin(ctx, listParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to list goods requests: %s", err.Error())
	}

	totalCount, err := cr.queries.ListGoodsRequestsByAdminCount(ctx, countParams)
	if err != nil {
		return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to count goods requests: %s", err.Error())
	}

	requests := make([]*repository.GoodsRequest, len(pgRequests))
	for i, pgRequest := range pgRequests {
		payload := []repository.GoodsRequestPayload{}

		if err = json.Unmarshal(pgRequest.Payload, &payload); err != nil {
			return nil, nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal goods request payload: %s", err.Error())
		}

		request := &repository.GoodsRequest{
			ID:          uint32(pgRequest.ID),
			ResellerID:  uint32(pgRequest.ResellerID),
			Payload:     payload,
			Status:      pgRequest.Status,
			Comment:     "",
			Cancelled:   pgRequest.Cancelled,
			CancelledAt: nil,
			UpdatedAt:   pgRequest.UpdatedAt,
			CreatedAt:   pgRequest.CreatedAt,

			User: &repository.UserShort{
				ID:          uint32(pgRequest.ResellerID),
				Name:        pgRequest.Name,
				PhoneNumber: pgRequest.PhoneNumber,
			},
		}

		if pgRequest.Comment.Valid {
			request.Comment = pgRequest.Comment.String
		}

		if pgRequest.CancelledAt.Valid {
			t := pgRequest.CancelledAt.Time
			request.CancelledAt = &t
		}

		requests[i] = request
	}

	return requests, pkg.CalculatePagination(uint32(totalCount), filter.Pagination.PageSize, filter.Pagination.Page), nil
}

func (cr *CompanyRepository) UpdateGoodsRequestByAdmin(ctx context.Context, update *repository.AdminUpdateGoodsRequest) (*repository.GoodsRequest, error) {
	pgUpdate := generated.UpdateGoodsRequestAdminParams{
		ID:      int64(update.ID),
		Status:  pgtype.Text{Valid: false},
		Comment: pgtype.Text{Valid: false},
	}

	if update.Status != nil {
		pgUpdate.Status = pgtype.Text{String: *update.Status, Valid: true}
	}

	if update.Comment != nil {
		pgUpdate.Comment = pgtype.Text{String: *update.Comment, Valid: true}
	}

	pgRequest, err := cr.queries.UpdateGoodsRequestAdmin(ctx, pgUpdate)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to update goods request: %s", err.Error())
	}

	payload := []repository.GoodsRequestPayload{}
	if err = json.Unmarshal(pgRequest.Payload, &payload); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal goods request payload: %s", err.Error())
	}

	request := &repository.GoodsRequest{
		ID:          uint32(pgRequest.ID),
		ResellerID:  uint32(pgRequest.ResellerID),
		Payload:     payload,
		Status:      pgRequest.Status,
		Comment:     "",
		Cancelled:   pgRequest.Cancelled,
		CancelledAt: nil,
		UpdatedAt:   pgRequest.UpdatedAt,
		CreatedAt:   pgRequest.CreatedAt,
	}

	if pgRequest.Comment.Valid {
		request.Comment = pgRequest.Comment.String
	}

	if pgRequest.CancelledAt.Valid {
		t := pgRequest.CancelledAt.Time
		request.CancelledAt = &t
	}

	return request, nil
}

func (rr *ResellerRepository) CancelGoodsRequestByReseller(ctx context.Context, id uint32) error {
	_, err := rr.queries.CancelGoodsRequest(ctx, int64(id))
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to cancel goods request: %s", err.Error())
	}

	return nil
}
