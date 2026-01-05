import {
	Package,
	Truck,
	CreditCard,
	AlertTriangle,
	Users,
	TrendingUp,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import AlertCard from '@/components/dashboard/AlertCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import StockOverviewChart from '@/components/dashboard/StockOverviewChart';
import TopResellersCard from '@/components/dashboard/TopResellersCard';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import GetAdminPageData from '@/services/admin/getPageDataHelper';

export default function AdminDashboard() {
	const statsQuery = useQuery({
		queryKey: ['admin-page-data', 'dashboard'],
		queryFn: () => GetAdminPageData('dashboard'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const stats = statsQuery.data?.data.dashboard;

	return (
		<div>
			{/* Page Header */}
			<div className="page-header">
				<div>
					<h1 className="page-title">Dashboard</h1>
					<p className="page-description">
						Welcome back! Here's an overview of your business.
					</p>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<KPICard
					title="Total Company Stock"
					value={stats?.total_company_stock.toLocaleString() || '—'}
					icon={Package}
					description="Units across all products"
					variant="default"
				/>
				<KPICard
					title="Stock Distributed"
					value={
						stats?.stock_distributed_units.toLocaleString() || '—'
					}
					icon={Truck}
					description="Units distributed to resellers"
					variant="accent"
				/>
				<KPICard
					title="Total Value Distributed"
					value={`KES ${
						stats?.total_value_distributed.toLocaleString() || '—'
					}`}
					icon={TrendingUp}
					description="At reseller prices"
				/>
				<KPICard
					title="Payments Received"
					value={`KES ${
						stats?.payment_received.toLocaleString() || '—'
					}`}
					icon={CreditCard}
					description="Payment recorded"
					variant="accent"
				/>
			</div>

			{/* Secondary KPIs */}
			<div className="grid gap-6 md:grid-cols-3 mb-8">
				<KPICard
					title="Low Stock Alerts"
					value={stats?.company_low_stock.toLocaleString() || '—'}
					icon={AlertTriangle}
					description="Products below threshold"
					variant="warning"
				/>
				<KPICard
					title="Pending Requests"
					value={
						stats?.total_pending_requests.toLocaleString() || '—'
					}
					icon={Package}
					description="Awaiting approval"
					variant="default"
				/>
				<KPICard
					title="Active Resellers"
					value={stats?.active_resellers.toLocaleString() || '—'}
					icon={Users}
					description="With stock balance"
					variant="accent"
				/>
			</div>

			{/* Charts and Activity */}
			<div className="grid gap-6 lg:grid-cols-3 mb-8">
				<div className="lg:col-span-2">
					<StockOverviewChart
						data={stats?.weekly_stock_chart ?? []}
					/>
				</div>
				<AlertCard alerts={stats?.stock_alerts ?? []} />
			</div>

			{/* Bottom Section */}
			<div className="grid gap-6 lg:grid-cols-2">
				<RecentActivityCard
					activities={stats?.recent_activities ?? []}
				/>
				<TopResellersCard resellers={stats?.top_resellers ?? []} />
			</div>
		</div>
	);
}
