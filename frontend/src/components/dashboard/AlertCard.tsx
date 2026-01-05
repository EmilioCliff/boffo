import type { DashboardStockAlert } from '@/lib/types';
import { AlertTriangle, Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AlertCardProps {
	alerts: DashboardStockAlert[];
}

export default function AlertCard({ alerts }: AlertCardProps) {
	const getAlertIcon = (type: DashboardStockAlert['alert_type']) => {
		switch (type) {
			case 'LOW_STOCK':
				return <Package className="h-4 w-4" />;
			case 'OUT_OF_STOCK':
				return <AlertTriangle className="h-4 w-4" />;
			default:
				return <AlertTriangle className="h-4 w-4" />;
		}
	};

	const getAlertColors = (type: DashboardStockAlert['alert_type']) => {
		switch (type) {
			case 'LOW_STOCK':
				return 'bg-warning/10 text-warning border-warning/20';
			case 'OUT_OF_STOCK':
				return 'bg-destructive/10 text-destructive border-destructive/20';
			default:
				return 'bg-muted text-muted-foreground border-border';
		}
	};

	if (alerts.length === 0) {
		return (
			<div className="rounded-lg border border-border bg-card p-6">
				<h3 className="text-sm font-semibold text-foreground">
					Alerts
				</h3>
				<div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
					<div className="rounded-full bg-success/10 p-3">
						<Package className="h-6 w-6 text-success" />
					</div>
					<p className="mt-3 text-sm font-medium text-foreground">
						All clear!
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						No pending alerts at this time
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-border bg-card p-6">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-foreground">
					Alerts
				</h3>
				<span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
					{alerts.length}
				</span>
			</div>
			<div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
				{alerts.slice(0, 5).map((alert) => (
					<Link
						key={alert.id}
						to="/admin/batches"
						className={`flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm ${getAlertColors(
							alert.alert_type,
						)}`}
					>
						<div className="flex-shrink-0">
							{getAlertIcon(alert.alert_type)}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">
								{alert.product_name}
							</p>
							<p className="text-xs opacity-80 truncate">
								{alert.alert_type === 'OUT_OF_STOCK'
									? 'Out of stock'
									: `Only ${alert.quantity} units remaining`}
							</p>
						</div>
						<ChevronRight className="h-4 w-4 flex-shrink-0 opacity-50" />
					</Link>
				))}
			</div>
			{alerts.length > 5 && (
				<Link
					to="/admin/alerts"
					className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
				>
					View all {alerts.length} alerts
				</Link>
			)}
		</div>
	);
}
