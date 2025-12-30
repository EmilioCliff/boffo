package handlers

import (
	"net/http"
	"strings"

	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/gin-gonic/gin"
)

func (s *Server) listStockMovementsHandler(ctx *gin.Context) {
	pageNoStr := ctx.DefaultQuery("page", "1")
	pageNo, err := pkg.StringToInt64(pageNoStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))

		return
	}

	pageSizeStr := ctx.DefaultQuery("limit", "10")
	pageSize, err := pkg.StringToInt64(pageSizeStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))

		return
	}

	filter := &repository.StockMovementFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		ProductID:    nil,
		OwnerType:    nil,
		OwnerID:      nil,
		MovementType: nil,
		Source:       nil,
	}

	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	if strings.ToLower(payload.Role) != repository.ADMIN_ROLE {
		owner := "RESELLER"
		filter.OwnerType = &owner
		filter.OwnerID = &payload.UserID
	} else {
		if ownerType := ctx.Query("owner_type"); ownerType != "" {
			filter.OwnerType = &ownerType
		}

		if ownerIDStr := ctx.Query("owner_id"); ownerIDStr != "" {
			ownerID, err := pkg.StringToUint32(ownerIDStr)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid owner_id format")))
				return
			}
			filter.OwnerID = &ownerID
		}
	}

	if productIDStr := ctx.Query("product_id"); productIDStr != "" {
		productID, err := pkg.StringToUint32(productIDStr)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid product_id format")))
			return
		}
		filter.ProductID = &productID
	}

	if movementType := ctx.Query("movement_type"); movementType != "" {
		filter.MovementType = &movementType
	}

	if source := ctx.Query("source"); source != "" {
		filter.Source = &source
	}

	stockMovements, pagination, err := s.repo.StockMovementRepository.List(ctx.Request.Context(), filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       stockMovements,
		"pagination": pagination,
	})
}
