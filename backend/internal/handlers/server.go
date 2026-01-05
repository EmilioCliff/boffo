package handlers

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/EmilioCliff/boffo/internal/postgres"
	"github.com/EmilioCliff/boffo/internal/services"
	"github.com/EmilioCliff/boffo/pkg"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
	ln     net.Listener
	srv    *http.Server

	config     pkg.Config
	tokenMaker pkg.JWTMaker
	repo       *postgres.PostgresRepo

	cache  services.CacheService
	report services.ReportService
}

func NewServer(config pkg.Config, tokenMaker pkg.JWTMaker, repo *postgres.PostgresRepo, cache services.CacheService, report services.ReportService) *Server {
	if config.ENVIRONMENT == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	s := &Server{
		router: r,
		ln:     nil,

		config:     config,
		tokenMaker: tokenMaker,
		repo:       repo,

		cache:  cache,
		report: report,
	}

	s.setUpRoutes()

	return s
}

func (s *Server) setUpRoutes() {
	s.router.Use(CORSmiddleware(s.config.FRONTEND_URL))

	v1 := s.router.Group("/api/v1")

	authGroup := v1.Group("")
	authGroup.Use(authMiddleware(s.tokenMaker))

	adminGroup := v1.Group("")
	adminGroup.Use(
		authMiddleware(s.tokenMaker),
		adminOnlyMiddleware(),
	)

	cacheGroup := v1.Group("")
	cacheGroup.Use(
		authMiddleware(s.tokenMaker),
		redisCacheMiddleware(s.cache),
	)

	adminCacheGroup := v1.Group("")
	adminCacheGroup.Use(
		authMiddleware(s.tokenMaker),
		redisCacheMiddleware(s.cache),
		adminOnlyMiddleware(),
	)

	// health check
	v1.GET("/health-check", s.healthCheckHandler)

	// users routes
	adminGroup.POST("/users", s.createUserHandler)
	cacheGroup.GET("/users/:id", s.getUserHandler)
	authGroup.PUT("/users/:id", s.updateUserHandler)
	adminGroup.DELETE("/users/:id", s.deleteUserHandler)
	adminCacheGroup.GET("/users", s.listUsersHandler)

	v1.POST("/users/login", s.loginUserHandler)
	v1.GET("/users/logout", s.logoutUserHandler)
	v1.GET("/users/refresh-token", s.refreshTokenHandler)
	authGroup.PUT("/users/:id/change-password", s.changePasswordHandler)

	// products routes
	adminGroup.POST("/products", s.createProductHandler)
	cacheGroup.GET("/products/:id", s.getProductHandler)
	adminGroup.PUT("/products/:id", s.updateProductHandler)
	adminGroup.DELETE("/products/:id", s.deleteProductHandler)
	cacheGroup.GET("/products", s.listProductsHandler)

	// company routes
	adminGroup.POST("/company/stock-purchase", s.createProductBatchHandler)
	adminCacheGroup.GET("/company/stock-purchase", s.listProductBatchesHandler)
	adminGroup.POST("/company/stock-distributions", s.createStockDistributionHandler)
	adminCacheGroup.GET("/company/stock-distributions", s.listStockDistributionsHandler)
	adminCacheGroup.GET("/company/stock", s.listCompanyStockHandler)

	// resellers routes
	adminCacheGroup.GET("/admin/resellers", s.listResellersHandler)
	adminCacheGroup.GET("/admin/resellers/:id", s.getResellerByIDHandler)
	authGroup.POST("/resellers", s.createSaleHandler)
	cacheGroup.GET("/resellers", s.listSalesHandler)
	cacheGroup.GET("/resellers/stock", s.listResellerStockHandler)
	authGroup.PUT("/resellers/stock-threshold/:id", s.updateResellerStockThrosholdHandler)

	// good requests routes
	authGroup.POST("/good-requests", s.createGoodRequestHandler)
	cacheGroup.GET("/good-requests", s.listGoodRequestsHandler)
	authGroup.PUT("/good-requests/:id", s.updateGoodRequestByResellerHandler)
	authGroup.DELETE("/good-requests/:id", s.cancelGoodRequestByResellerHandler)
	adminGroup.PUT("/admin/good-requests/:id", s.updateGoodRequestByAdminHandler)

	// payments routes
	adminGroup.POST("/payments", s.createPaymentByAdmin)
	cacheGroup.GET("/payments", s.listPaymentsHandler)

	// stock movements routes
	cacheGroup.GET("/stock-movements", s.listStockMovementsHandler)

	// helper routes
	cacheGroup.GET("/resellers/page-data/:page", s.getResellerPageStatsHandler)
	adminCacheGroup.GET("/admin/page-data/:page", s.getAdminPageStatsHandler)
	cacheGroup.GET("/resellers/form", s.userFormHelperHandler)
	cacheGroup.GET("/resellers/stock/form", s.resellerStockFormHelperHandler)
	cacheGroup.GET("/products/form", s.productFormHelperHandler)
	cacheGroup.GET("/resellers/:id/account", s.getResellerAccountHandler)
	// adminCacheGroup.GET("/admin/stats", s.getAdminStatsHandler)

	// reports routes

	s.srv = &http.Server{
		Addr:         s.config.SERVER_ADDRESS,
		Handler:      s.router.Handler(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
}

func (s *Server) healthCheckHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (s *Server) Start() error {
	var err error
	if s.ln, err = net.Listen("tcp", s.config.SERVER_ADDRESS); err != nil {
		return err
	}

	go func(s *Server) {
		err := s.srv.Serve(s.ln)
		if err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}(s)

	return nil
}

func (s *Server) Stop(ctx context.Context) error {
	log.Println("Shutting down http server...")

	return s.srv.Shutdown(ctx)
}

func (s *Server) GetPort() int {
	if s.ln == nil {
		return 0
	}

	return s.ln.Addr().(*net.TCPAddr).Port
}

func errorResponse(err error) gin.H {
	return gin.H{
		"status_code": pkg.ErrorCode(err),
		"message":     pkg.ErrorMessage(err),
	}
}

func constructCacheKey(path string, queryParams map[string][]string) string {
	const prefix = "/api/v1/"
	if ok := strings.HasPrefix(path, prefix); ok {
		path = strings.TrimPrefix(path, prefix)
	}

	var queryParts []string
	for key, values := range queryParams {
		for _, value := range values {
			queryParts = append(queryParts, fmt.Sprintf("%s=%s", key, value))
		}
	}
	sort.Strings(queryParts) // Sort to ensure cache key consistency

	return fmt.Sprintf("%s:%s", path, strings.Join(queryParts, ":"))
}
