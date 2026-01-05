package handlers

import (
	"net/http"

	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/gin-gonic/gin"
)

type addProductBatchRequest struct {
	ProductID     uint32  `json:"product_id" binding:"required"`
	BatchNumber   string  `json:"batch_number" binding:"required"`
	Quantity      uint32  `json:"quantity" binding:"required"`
	PurchasePrice float64 `json:"purchase_price" binding:"required,gt=0"`
	DateReceived  string  `json:"date_received" binding:"required"`
}

func (s *Server) createProductBatchHandler(ctx *gin.Context) {
	var req addProductBatchRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	dateReceived, err := pkg.StrToTime(req.DateReceived)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid date_received format")))
		return
	}

	productBatch, err := s.repo.CompanyRepository.AddProductBatch(ctx, &repository.ProductBatch{
		ProductID:     req.ProductID,
		BatchNumber:   req.BatchNumber,
		Quantity:      int64(req.Quantity),
		PurchasePrice: req.PurchasePrice,
		DateReceived:  dateReceived,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": productBatch})
}

func (s *Server) listProductBatchesHandler(ctx *gin.Context) {
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

	filter := &repository.ProductBatchFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		Search:    nil,
		ProductID: nil,
		InStock:   nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}

	if inStockStr := ctx.Query("in_stock"); inStockStr != "" {
		inStock := pkg.StringToBool(inStockStr)
		filter.InStock = &inStock
	}

	if productId := ctx.Query("product_id"); productId != "" {
		productIDUint, err := pkg.StringToUint32(productId)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid product_id format")))
			return
		}
		filter.ProductID = &productIDUint
	}

	productBatches, pagination, err := s.repo.CompanyRepository.ListProductBatches(ctx, filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": productBatches, "pagination": pagination})
}

type distributeStockRequest struct {
	ResellerID      uint32  `json:"reseller_id" binding:"required"`
	ProductID       uint32  `json:"product_id" binding:"required"`
	Quantity        uint32  `json:"quantity" binding:"required,gt=0"`
	UnitPrice       float64 `json:"unit_price" binding:"required,gt=0"`
	DateDistributed string  `json:"date_distributed" binding:"required"`
}

func (s *Server) createStockDistributionHandler(ctx *gin.Context) {
	var req distributeStockRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	dateDistributed, err := pkg.StrToTime(req.DateDistributed)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid date_distributed format")))
		return
	}

	stockDistribution, err := s.repo.CompanyRepository.DistributeStockToReseller(ctx, &repository.StockDistribution{
		ResellerID:      req.ResellerID,
		ProductID:       req.ProductID,
		Quantity:        int32(req.Quantity),
		UnitPrice:       req.UnitPrice,
		DateDistributed: dateDistributed,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": stockDistribution})
}

func (s *Server) listStockDistributionsHandler(ctx *gin.Context) {
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

	filter := &repository.StockDistributionFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		ResellerID: nil,
		ProductID:  nil,
		Search:     nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}

	if resellerId := ctx.Query("reseller_id"); resellerId != "" {
		resellerIDUint, err := pkg.StringToUint32(resellerId)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid reseller_id format")))
			return
		}
		filter.ResellerID = &resellerIDUint
	}

	if productId := ctx.Query("product_id"); productId != "" {
		productIDUint, err := pkg.StringToUint32(productId)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid product_id format")))
			return
		}
		filter.ProductID = &productIDUint
	}

	stockDistributions, pagination, err := s.repo.CompanyRepository.ListStockDistributions(ctx, filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": stockDistributions, "pagination": pagination})
}

func (s *Server) listCompanyStockHandler(ctx *gin.Context) {
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

	filter := &repository.CompanyStockFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		Search:  nil,
		InStock: nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}

	if inStockStr := ctx.Query("in_stock"); inStockStr != "" {
		inStock := pkg.StringToBool(inStockStr)
		filter.InStock = &inStock
	}

	companyStocks, pagination, err := s.repo.CompanyRepository.ListCompanyStock(ctx, filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": companyStocks, "pagination": pagination})
}
