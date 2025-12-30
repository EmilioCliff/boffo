package handlers

import (
	"net/http"

	"github.com/EmilioCliff/boffo/pkg"
	"github.com/gin-gonic/gin"
)

// func (s *Server) GetDashboardData(ctx *gin.Context) {
// 	data, err := s.repo.ProductsRepository.GetDashboardData(ctx)
// 	if err != nil {
// 		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
// 		return
// 	}

// 	ctx.JSON(200, gin.H{"data": data})
// }

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

func (s *Server) getAdminStatsHandler(ctx *gin.Context) {
	stats, err := s.repo.CompanyRepository.GetAdminStats(ctx)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": stats})
}
