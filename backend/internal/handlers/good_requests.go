package handlers

import (
	"net/http"
	"strings"

	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/gin-gonic/gin"
)

type createGoodRequestRequest struct {
	Data []struct {
		ProductID      uint32  `json:"product_id" binding:"required"`
		ProductName    string  `json:"product_name" binding:"required"`
		Quantity       int32   `json:"quantity" binding:"required,gt=0"`
		PriceRequested float64 `json:"price_requested" binding:"required,gt=0"`
	} `json:"data" binding:"required"`
}

func (s *Server) createGoodRequestHandler(ctx *gin.Context) {
	var req createGoodRequestRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	if strings.ToLower(payload.Role) == repository.ADMIN_ROLE {
		ctx.JSON(http.StatusForbidden, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "only resellers can create goods requests")))
		return
	}

	payloads := make([]repository.GoodsRequestPayload, len(req.Data))
	for i, item := range req.Data {
		payloads[i] = repository.GoodsRequestPayload{
			ProductID:      item.ProductID,
			ProductName:    item.ProductName,
			Quantity:       item.Quantity,
			PriceRequested: item.PriceRequested,
		}
	}

	data := &repository.GoodsRequest{
		ResellerID: payload.UserID,
		Payload:    payloads,
	}

	goodRequest, err := s.repo.ResellerRepository.CreateGoodsRequest(ctx, data)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": goodRequest})
}

func (s *Server) listGoodRequestsHandler(ctx *gin.Context) {
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

	filter := &repository.GoodRequestFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		ResellerID: nil,
		Status:     nil,
	}

	if status := ctx.Query("status"); status != "" {
		filter.Status = &status
	}

	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	var goodRequests []*repository.GoodsRequest
	var pagination *pkg.Pagination

	if strings.ToLower(payload.Role) != repository.ADMIN_ROLE {
		filter.ResellerID = &payload.UserID

		goodRequests, pagination, err = s.repo.ResellerRepository.ListGoodsRequestsByReseller(ctx, filter)
		if err != nil {
			ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
			return
		}
	} else {
		if resellerIdStr := ctx.Query("reseller_id"); resellerIdStr != "" {
			resellerId, err := pkg.StringToUint32(resellerIdStr)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid reseller_id: %s", err.Error())))
				return
			}
			filter.ResellerID = &resellerId
		}

		goodRequests, pagination, err = s.repo.CompanyRepository.ListGoodsRequestsByAdmin(ctx, filter)
		if err != nil {
			ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"data": goodRequests, "pagination": pagination})
}

func (s *Server) updateGoodRequestByResellerHandler(ctx *gin.Context) {
	var req createGoodRequestRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	id, err := pkg.StringToUint32(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid good_request ID: %s", err.Error())))
		return
	}

	payloads := make([]repository.GoodsRequestPayload, len(req.Data))
	for i, item := range req.Data {
		payloads[i] = repository.GoodsRequestPayload{
			ProductID:      item.ProductID,
			ProductName:    item.ProductName,
			Quantity:       item.Quantity,
			PriceRequested: item.PriceRequested,
		}
	}

	data := &repository.ResellerUpdateGoodsRequest{
		ID:      id,
		Payload: payloads,
	}

	goodRequest, err := s.repo.ResellerRepository.UpdateGoodsRequestByReseller(ctx, data)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": goodRequest})
}

func (s *Server) cancelGoodRequestByResellerHandler(ctx *gin.Context) {
	id, err := pkg.StringToUint32(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid good_request ID: %s", err.Error())))
		return
	}

	if err := s.repo.ResellerRepository.CancelGoodsRequestByReseller(ctx, id); err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": "goods request cancelled successfully"})
}

func (s *Server) updateGoodRequestByAdminHandler(ctx *gin.Context) {
	var req repository.AdminUpdateGoodsRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	id, err := pkg.StringToUint32(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid good_request ID: %s", err.Error())))
		return
	}

	req.ID = id

	goodRequest, err := s.repo.CompanyRepository.UpdateGoodsRequestByAdmin(ctx, &req)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": goodRequest})
}
