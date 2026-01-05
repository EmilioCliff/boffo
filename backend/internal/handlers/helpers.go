package handlers

import (
	"net/http"

	"github.com/EmilioCliff/boffo/pkg"
	"github.com/gin-gonic/gin"
)

func (s *Server) getResellerPageStatsHandler(ctx *gin.Context) {
	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	page := ctx.Param("page")
	if page == "" {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "page parameter is required")))
		return
	}

	stats, err := s.repo.ResellerRepository.GetResellerPageData(ctx, payload.UserID, page)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": gin.H{page: stats}})
}

func (s *Server) getAdminPageStatsHandler(ctx *gin.Context) {
	page := ctx.Param("page")
	if page == "" {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "page parameter is required")))
		return
	}

	stats, err := s.repo.CompanyRepository.GetAdminPageData(ctx, page)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": gin.H{page: stats}})
}

func (s *Server) productFormHelperHandler(ctx *gin.Context) {
	helpers, err := s.repo.ProductsRepository.ProductFormHelper(ctx)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": helpers})
}

func (s *Server) resellerStockFormHelperHandler(ctx *gin.Context) {
	authPayload, ok := ctx.Get(authorizationPayloadKey)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, errorResponse(pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get auth payload")))
		return
	}
	payload := authPayload.(*pkg.Payload)

	helpers, err := s.repo.ResellerRepository.ListResellerStockFormHelpers(ctx, payload.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": helpers})
}

func (s *Server) userFormHelperHandler(ctx *gin.Context) {
	helpers, err := s.repo.UserRepository.UserFormHelper(ctx)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": helpers})
}

func (s *Server) getResellerAccountHandler(ctx *gin.Context) {
	id, err := pkg.StringToUint32(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid good_request ID: %s", err.Error())))
		return
	}

	account, err := s.repo.ResellerRepository.GetResellerAccount(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": account})
}

// func (s *Server) getAdminStatsHandler(ctx *gin.Context) {
// 	stats, err := s.repo.CompanyRepository.GetAdminStats(ctx)
// 	if err != nil {
// 		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, gin.H{"data": stats})
// }
