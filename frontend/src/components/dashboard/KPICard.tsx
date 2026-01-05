import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	description?: string;
	variant?: 'default' | 'accent' | 'warning' | 'destructive';
}

export default function KPICard({
	title,
	value,
	icon: Icon,
	trend,
	description,
	variant = 'default',
}: KPICardProps) {
	const iconBgClasses = {
		default: 'bg-primary/10 text-primary',
		accent: 'bg-accent/10 text-accent',
		warning: 'bg-warning/10 text-warning',
		destructive: 'bg-destructive/10 text-destructive',
	};

	return (
		<div className="kpi-card animate-fade-in">
			<div className="flex items-start justify-between">
				<div className={cn('rounded-lg p-2.5', iconBgClasses[variant])}>
					<Icon className="h-5 w-5" />
				</div>
				{trend && (
					<div
						className={cn(
							'flex items-center gap-1 text-sm font-medium',
							trend.isPositive
								? 'text-success'
								: 'text-destructive',
						)}
					>
						{trend.isPositive ? (
							<TrendingUp className="h-4 w-4" />
						) : (
							<TrendingDown className="h-4 w-4" />
						)}
						<span>{Math.abs(trend.value)}%</span>
					</div>
				)}
			</div>
			<div className="mt-4">
				<p className="kpi-label">{title}</p>
				<p className="kpi-value mt-1">{value}</p>
				{description && (
					<p className="mt-2 text-xs text-muted-foreground">
						{description}
					</p>
				)}
			</div>
		</div>
	);
}
