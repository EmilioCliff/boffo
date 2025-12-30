package handlers

import (
	"net/http"
	"strings"

	"github.com/EmilioCliff/boffo/internal/repository"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/gin-gonic/gin"
)

type createPaymentRequest struct {
	ResellerID uint32  `json:"reseller_id" binding:"required"`
	Amount     float64 `json:"amount" binding:"required,gt=0"`
	Method     string  `json:"method" binding:"required,oneof=MPESA CASH"`
	Reference  string  `json:"reference"`
	DatePaid   string  `json:"date_paid" binding:"required,datetime=2006-01-02"`
}

func (s *Server) createPaymentByAdmin(ctx *gin.Context) {
	var req createPaymentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	datePaid, err := pkg.StrToTime(req.DatePaid)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid date_paid format")))
		return
	}

	payment, err := s.repo.PaymentRepository.CreatePayment(ctx, &repository.Payment{
		ResellerID: req.ResellerID,
		Amount:     req.Amount,
		Method:     req.Method,
		Reference:  req.Reference,
		RecordedBy: "ADMIN",
		DatePaid:   datePaid,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": payment})
}

func (s *Server) listPaymentsHandler(ctx *gin.Context) {
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

	filter := &repository.PaymentFilter{
		Pagination: &pkg.Pagination{
			Page:     uint32(pageNo),
			PageSize: uint32(pageSize),
		},
		ResellerID: nil,
		Method:     nil,
		RecordedBy: nil,
		DateFrom:   nil,
		DateTo:     nil,
	}

	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	// if is user add the reseller_id filter
	if strings.ToLower(payload.Role) != repository.ADMIN_ROLE {
		filter.ResellerID = &payload.UserID
	} else {
		if resellerIDStr := ctx.Query("reseller_id"); resellerIDStr != "" {
			resellerID, err := pkg.StringToUint32(resellerIDStr)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid reseller_id format")))
				return
			}
			filter.ResellerID = &resellerID
		}
	}

	if method := ctx.Query("method"); method != "" {
		filter.Method = &method
	}

	if recordedBy := ctx.Query("recorded_by"); recordedBy != "" {
		filter.RecordedBy = &recordedBy
	}

	if dateFromStr := ctx.Query("date_from"); dateFromStr != "" {
		dateFrom, err := pkg.StrToTime(dateFromStr)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid date_from format")))
			return
		}
		filter.DateFrom = &dateFrom
	}

	if dateToStr := ctx.Query("date_to"); dateToStr != "" {
		dateTo, err := pkg.StrToTime(dateToStr)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid date_to format")))
			return
		}
		filter.DateTo = &dateTo
	}

	payments, pagination, err := s.repo.PaymentRepository.ListPayments(ctx, filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       payments,
		"pagination": pagination,
	})
}
