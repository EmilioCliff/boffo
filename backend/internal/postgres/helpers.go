package postgres

import (
	"context"
	"encoding/json"

	"github.com/EmilioCliff/boffo/pkg"
)

func (rr *ResellerRepository) GetResellerPageData(ctx context.Context, resellerID uint32, page string) (any, error) {
	switch page {
	case "dashboard":
		data, err := rr.queries.GetResellerDashboardData(ctx, int64(resellerID))
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller dashboard data: %s", err.Error())
		}

		var dashboard any
		if err := json.Unmarshal(data, &dashboard); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal reseller dashboard data: %s", err.Error())
		}

		return dashboard, nil
	case "stock":
		data, err := rr.queries.GetResellerStockPageStats(ctx, int64(resellerID))
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller stock page stats: %s", err.Error())
		}

		var stockStats any
		if err := json.Unmarshal(data, &stockStats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal reseller stock page stats: %s", err.Error())
		}

		return stockStats, nil
	case "sales":
		data, err := rr.queries.GetResellerSalesPageStats(ctx, int64(resellerID))
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller sales page stats: %s", err.Error())
		}

		var salesStats any
		if err := json.Unmarshal(data, &salesStats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal reseller sales page stats: %s", err.Error())
		}

		return salesStats, nil

	case "goods_requests":
		data, err := rr.queries.GetResellerGoodsRequestsPageStats(ctx, int64(resellerID))
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get reseller good_requests page stats: %s", err.Error())
		}

		var goodRequestsStats any
		if err := json.Unmarshal(data, &goodRequestsStats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal reseller good_requests page stats: %s", err.Error())
		}

		return goodRequestsStats, nil
	default:
		return nil, pkg.Errorf(pkg.INVALID_ERROR, "unknown page: %s", page)
	}
}

func (cr *CompanyRepository) GetAdminPageData(ctx context.Context, page string) (any, error) {
	switch page {
	case "dashboard":
		data, err := cr.queries.GetAdminDashboardStats(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get admin stats page data: %s", err.Error())
		}

		var stats any
		if err := json.Unmarshal(data, &stats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal admin stats page data: %s", err.Error())
		}

		// get weekly stock chat
		chartData, err := cr.queries.GetAdminWeeklyStockChart(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get admin weekly stock chart data: %s", err.Error())
		}

		stats.(map[string]any)["weekly_stock_chart"] = chartData

		return stats, nil

	case "products":
		data, err := cr.queries.GetAdminProductsPageStats(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get products stats page data: %s", err.Error())
		}

		var stats any
		if err := json.Unmarshal(data, &stats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal products stats page data: %s", err.Error())
		}

		return stats, nil

	case "batches":
		data, err := cr.queries.GetAdminBatchesPageStats(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get batches stats page data: %s", err.Error())
		}

		var stats any
		if err := json.Unmarshal(data, &stats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal batches stats page data: %s", err.Error())
		}

		return stats, nil

	case "distributions":
		data, err := cr.queries.GetAdminDistributionPageStats(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get distributions stats page data: %s", err.Error())
		}

		var stats any
		if err := json.Unmarshal(data, &stats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal distributions stats page data: %s", err.Error())
		}

		return stats, nil

	case "goods_requests":
		data, err := cr.queries.GetAdminGoodsRequestsPageStats(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get goods_requests stats page data: %s", err.Error())
		}

		var stats any
		if err := json.Unmarshal(data, &stats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal goods_requests stats page data: %s", err.Error())
		}

		return stats, nil

	case "payments":
		data, err := cr.queries.GetAdminPaymentsPageStats(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get payments stats page data: %s", err.Error())
		}

		var stats any
		if err := json.Unmarshal(data, &stats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal payments stats page data: %s", err.Error())
		}

		return stats, nil

	case "resellers":
		data, err := cr.queries.GetAdminResellersPageStats(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get resellers stats page data: %s", err.Error())
		}

		var stats any
		if err := json.Unmarshal(data, &stats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal resellers stats page data: %s", err.Error())
		}

		return stats, nil

	case "stock_movements":
		data, err := cr.queries.GetAdminStockMovementsPageStats(ctx)
		if err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to get stock_movements stats page data: %s", err.Error())
		}

		var stats any
		if err := json.Unmarshal(data, &stats); err != nil {
			return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to unmarshal stock_movements stats page data: %s", err.Error())
		}

		return stats, nil

	default:
		return nil, pkg.Errorf(pkg.INVALID_ERROR, "unknown page: %s", page)
	}
}
