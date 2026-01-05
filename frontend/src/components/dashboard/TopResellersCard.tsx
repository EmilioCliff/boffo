import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { DashboardTopReseller } from '@/lib/types';

interface TopResellersCardProps {
	resellers: DashboardTopReseller[];
}

export default function TopResellersCard({ resellers }: TopResellersCardProps) {
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 0,
		}).format(value);
	};

	return (
		<div className="rounded-lg border border-border bg-card p-6">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-foreground">
					Top Resellers
				</h3>
				<Link
					to="/admin/resellers"
					className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
				>
					View all
					<ArrowRight className="h-3 w-3" />
				</Link>
			</div>
			<div className="mt-4 space-y-4">
				{resellers.map((reseller, index) => (
					<div key={reseller.id} className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
									{index + 1}
								</div>
								<div>
									<p className="text-sm font-medium text-foreground">
										{reseller.name}
									</p>
									<p className="text-xs text-muted-foreground">
										Sales:{' '}
										{formatCurrency(
											reseller.total_sales_value,
										)}
									</p>
								</div>
							</div>
							<span className="text-sm font-semibold text-foreground">
								{formatCurrency(reseller.stock_value)}
							</span>
						</div>
						<Progress
							value={reseller.performance}
							className="h-1.5"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
