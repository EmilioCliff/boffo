package handlers

import (
	"net/http"
	"strings"

	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/gin-gonic/gin"
)

type createResellerSaleRequest struct {
	ProductID    uint32  `json:"product_id" binding:"required"`
	Quantity     uint32  `json:"quantity" binding:"required,min=1"`
	SellingPrice float64 `json:"selling_price" binding:"required,gt=0"`
	DateSold     string  `json:"date_sold" binding:"required"`
}

func (s *Server) createSaleHandler(ctx *gin.Context) {
	var req createResellerSaleRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	dateSold, err := pkg.StrToTime(req.DateSold)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid date_sold format")))
		return
	}

	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	if strings.ToLower(payload.Role) == repository.ADMIN_ROLE {
		ctx.JSON(http.StatusForbidden, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "only resellers can create sales")))
		return
	}

	resellerSale, err := s.repo.ResellerRepository.CreateResellerSale(ctx, &repository.ResellerSale{
		ResellerID:   payload.UserID,
		ProductID:    req.ProductID,
		Quantity:     int32(req.Quantity),
		SellingPrice: req.SellingPrice,
		DateSold:     dateSold,
		User: &repository.UserShort{
			Name: payload.Name,
		},
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": resellerSale})
}

func (s *Server) getResellerByIDHandler(ctx *gin.Context) {
	id, err := pkg.StringToUint32(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid reseller ID: %s", err.Error())))
		return
	}

	reseller, err := s.repo.ResellerRepository.GetResellerByID(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": reseller})
}

func (s *Server) listSalesHandler(ctx *gin.Context) {
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

	filter := &repository.ResellerSaleFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		ResellerID: nil,
		ProductID:  nil,
	}

	if productId := ctx.Query("product_id"); productId != "" {
		productIDUint, err := pkg.StringToUint32(productId)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid product_id format")))
			return
		}
		filter.ProductID = &productIDUint
	}

	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	if strings.ToLower(payload.Role) != "admin" {
		filter.ResellerID = &payload.UserID
	} else {
		if resellerId := ctx.Query("reseller_id"); resellerId != "" {
			resellerIDUint, err := pkg.StringToUint32(resellerId)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid reseller_id format")))
				return
			}
			filter.ResellerID = &resellerIDUint
		}
	}

	resellerSales, pagination, err := s.repo.ResellerRepository.ListResellerSales(ctx, filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": resellerSales, "pagination": pagination})
}

func (s *Server) listResellerStockHandler(ctx *gin.Context) {
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

	filter := &repository.ResellerStockFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		ResellerID: nil,
		Search:     nil,
		InStock:    nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}

	if inStockStr := ctx.Query("in_stock"); inStockStr != "" {
		inStock := pkg.StringToBool(inStockStr)
		filter.InStock = &inStock
	}

	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	if strings.ToLower(payload.Role) != "admin" {
		filter.ResellerID = &payload.UserID
	} else {
		if resellerId := ctx.Query("reseller_id"); resellerId != "" {
			resellerIDUint, err := pkg.StringToUint32(resellerId)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid reseller_id format")))
				return
			}
			filter.ResellerID = &resellerIDUint
		}
	}

	resellerStocks, pagination, err := s.repo.ResellerRepository.ListResellerStock(ctx, filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": resellerStocks, "pagination": pagination})
}

type UpdateResellerStockThresholdRequest struct {
	Threshold uint32 `json:"threshold" binding:"required,min=0"`
}

func (s *Server) updateResellerStockThresholdHandler(ctx *gin.Context) {
	id, err := pkg.StringToUint32(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid reseller ID: %s", err.Error())))
		return
	}

	var req UpdateResellerStockThresholdRequest
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

	updatedStock, err := s.repo.ResellerRepository.UpdateResellerStockThreshold(ctx, &repository.ResellerStockUpdate{
		ResellerID:        payload.UserID,
		ProductID:         id,
		LowStockThreshold: req.Threshold,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": updatedStock})
}

func (s *Server) listResellersHandler(ctx *gin.Context) {
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

	filter := &repository.ResellerFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		Search: nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}

	resellers, pagination, err := s.repo.ResellerRepository.ListResellersWithAccount(ctx, filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": resellers, "pagination": pagination})
}
