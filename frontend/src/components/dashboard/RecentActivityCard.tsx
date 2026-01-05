import type { DashboardRecentActivity } from '@/lib/types';
import { formatActivityTime } from '@/lib/utils';
import {
	Package,
	Truck,
	CreditCard,
	ShoppingCart,
	ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivityCardProps {
	activities: DashboardRecentActivity[];
	viewAllLink?: string;
}

export default function RecentActivityCard({
	activities,
	viewAllLink = '/admin/movements',
}: RecentActivityCardProps) {
	const getActivityIcon = (type: DashboardRecentActivity['type']) => {
		switch (type) {
			case 'STOCK_RECEIVED':
				return (
					<div className="rounded-full bg-success/10 p-2">
						<Package className="h-4 w-4 text-success" />
					</div>
				);
			case 'STOCK_DISTRIBUTED':
				return (
					<div className="rounded-full bg-info/10 p-2">
						<Truck className="h-4 w-4 text-info" />
					</div>
				);
			case 'PAYMENT_RECEIVED':
				return (
					<div className="rounded-full bg-accent/10 p-2">
						<CreditCard className="h-4 w-4 text-accent" />
					</div>
				);
			case 'RESELLER_SALE':
				return (
					<div className="rounded-full bg-warning/10 p-2">
						<ShoppingCart className="h-4 w-4 text-warning" />
					</div>
				);
			default:
				return (
					<div className="rounded-full bg-muted p-2">
						<Package className="h-4 w-4 text-muted-foreground" />
					</div>
				);
		}
	};

	return (
		<div className="rounded-lg border border-border bg-card p-6">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-foreground">
					Recent Activity
				</h3>
				<Link
					to={viewAllLink}
					className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
				>
					View all
					<ArrowRight className="h-3 w-3" />
				</Link>
			</div>
			<div className="mt-4 space-y-4">
				{activities.map((activity) => (
					<div key={activity.id} className="flex items-start gap-3">
						{getActivityIcon(activity.type)}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-foreground truncate">
								{activity.title}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								{activity.description}
							</p>
						</div>
						<span className="text-xs text-muted-foreground whitespace-nowrap">
							{formatActivityTime(activity.created_at)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
