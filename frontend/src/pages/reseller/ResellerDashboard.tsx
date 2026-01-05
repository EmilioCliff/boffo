import {
	Package,
	ShoppingCart,
	Wallet,
	AlertTriangle,
	TrendingUp,
	Plus,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import GetResellerPageData from '@/services/reseller/getPageDataHelper';
import { format, isToday, isYesterday } from 'date-fns';
import EmptyState from '@/components/EmptyState';

export default function ResellerDashboard() {
	const navigate = useNavigate();
	const statsQuery = useQuery({
		queryKey: ['reseller-page-data', 'dashboard'],
		queryFn: () => GetResellerPageData('dashboard'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	};

	function formatSmartDate(date: Date | string) {
		const d = typeof date === 'string' ? new Date(date) : date;

		if (isToday(d)) {
			return `Today`;
		}

		if (isYesterday(d)) {
			return `Yesterday`;
		}

		return format(d, 'MMM dd, yyyy, h:mm a');
	}

	const stats = statsQuery.data?.data.dashboard;

	return (
		<div>
			{/* Page Header */}
			<div className="page-header">
				<div>
					<h1 className="page-title">Dashboard</h1>
					<p className="page-description">
						Track your sales and manage your inventory.
					</p>
				</div>
				<div className="flex gap-3">
					<Button variant="outline" asChild>
						<Link to="/reseller/requests">
							<Package className="mr-2 h-4 w-4" />
							Request Goods
						</Link>
					</Button>
					<Button asChild>
						<Link to="/reseller/sales">
							<Plus className="mr-2 h-4 w-4" />
							Record Sale
						</Link>
					</Button>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<KPICard
					title="Current Stock"
					value={stats?.current_stock.toLocaleString() ?? 0}
					icon={Package}
					description="Total units in hand"
					variant="default"
				/>
				<KPICard
					title="Total Sales"
					value={formatCurrency(stats?.total_sales.sales_value ?? 0)}
					icon={ShoppingCart}
					description={`${
						stats?.total_sales.units_sold ?? 0
					} units sold`}
					variant="accent"
				/>
				<KPICard
					title="Outstanding Balance"
					value={formatCurrency(stats?.outstanding_balance ?? 0)}
					icon={Wallet}
					description="Amount owed to Boffo"
					variant="warning"
				/>
				<KPICard
					title=" Profit"
					value={formatCurrency(stats?.profit ?? 0)}
					icon={TrendingUp}
					description="Estimated margin"
					variant="accent"
				/>
			</div>

			{/* Main Content Grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Stock Overview */}
				<div className="rounded-lg border border-border bg-card p-6">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-sm font-semibold text-foreground">
								Stock Overview
							</h3>
							<p className="text-xs text-muted-foreground mt-1">
								Your current inventory levels
							</p>
						</div>
						<Link
							to="/reseller/stock"
							className="text-xs font-medium text-primary hover:underline"
						>
							View all
						</Link>
					</div>
					{stats?.stock_overview &&
					stats.stock_overview.length > 0 ? (
						<div className="space-y-4">
							{stats.stock_overview.map((item) => (
								<div key={item.id} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											{item.quantity <
												item.low_stock_threshold && (
												<AlertTriangle className="h-4 w-4 text-warning" />
											)}
											<span className="text-sm font-medium">
												{item.name}
											</span>
										</div>
										<span
											className={`text-sm font-semibold ${
												item.quantity <
												item.low_stock_threshold
													? 'text-warning'
													: 'text-foreground'
											}`}
										>
											{item.quantity} units
										</span>
									</div>
									<Progress
										value={Math.min(
											(item.quantity /
												item.low_stock_threshold) *
												100,
											100,
										)}
										className={`h-1.5 ${
											item.quantity <
											item.low_stock_threshold
												? '[&>div]:bg-warning'
												: ''
										}`}
									/>
								</div>
							))}
						</div>
					) : (
						<EmptyState
							icon={Package}
							title="No stock items"
							description="You don't have any stock yet. Request goods to get started."
							action={{
								label: 'Request Goods',
								onClick: () => navigate('/reseller/requests'),
							}}
						/>
					)}
				</div>

				{/* Recent Sales */}
				<div className="rounded-lg border border-border bg-card p-6">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-sm font-semibold text-foreground">
								Recent Sales
							</h3>
							<p className="text-xs text-muted-foreground mt-1">
								Your latest transactions
							</p>
						</div>
						<Link
							to="/reseller/sales"
							className="text-xs font-medium text-primary hover:underline"
						>
							View all
						</Link>
					</div>
					{stats?.recent_sales && stats.recent_sales.length > 0 ? (
						<div className="space-y-4">
							{stats.recent_sales.map((sale) => (
								<div
									key={sale.id}
									className="flex items-center justify-between py-2 border-b border-border last:border-0"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
											<ShoppingCart className="h-4 w-4 text-success" />
										</div>
										<div>
											<p className="text-sm font-medium">
												{sale.product_name}
											</p>
											<p className="text-xs text-muted-foreground">
												{sale.quantity} units •{' '}
												{formatSmartDate(
													sale.date_sold,
												)}
											</p>
										</div>
									</div>
									<span className="text-sm font-semibold text-success">
										+{formatCurrency(sale.total_amount)}
									</span>
								</div>
							))}
						</div>
					) : (
						<EmptyState
							icon={ShoppingCart}
							title="No sales yet"
							description="Start recording sales to see them here."
							action={{
								label: 'Record Sale',
								onClick: () => navigate('/reseller/sales'),
							}}
						/>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="mt-8 rounded-lg border border-border bg-card p-6">
				<h3 className="text-sm font-semibold text-foreground mb-4">
					Quick Actions
				</h3>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<Link
						to="/reseller/sales"
						className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
					>
						<div className="rounded-lg bg-success/10 p-2.5">
							<ShoppingCart className="h-5 w-5 text-success" />
						</div>
						<div>
							<p className="text-sm font-medium">Record Sale</p>
							<p className="text-xs text-muted-foreground">
								Add new sale
							</p>
						</div>
					</Link>
					<Link
						to="/reseller/requests"
						className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
					>
						<div className="rounded-lg bg-info/10 p-2.5">
							<Package className="h-5 w-5 text-info" />
						</div>
						<div>
							<p className="text-sm font-medium">Request Goods</p>
							<p className="text-xs text-muted-foreground">
								Order more stock
							</p>
						</div>
					</Link>
					<Link
						to="/reseller/stock"
						className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
					>
						<div className="rounded-lg bg-primary/10 p-2.5">
							<Package className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">View Stock</p>
							<p className="text-xs text-muted-foreground">
								Check inventory
							</p>
						</div>
					</Link>
					<Link
						to="/reseller/account"
						className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
					>
						<div className="rounded-lg bg-warning/10 p-2.5">
							<Wallet className="h-5 w-5 text-warning" />
						</div>
						<div>
							<p className="text-sm font-medium">Account</p>
							<p className="text-xs text-muted-foreground">
								View balance
							</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
