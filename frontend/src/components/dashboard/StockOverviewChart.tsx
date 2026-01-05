import type { StockChartData } from '@/lib/types';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

interface StockOverviewChartProps {
	data: StockChartData[];
}

export default function StockOverviewChart({ data }: StockOverviewChartProps) {
	return (
		<div className="rounded-lg border border-border bg-card p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-sm font-semibold text-foreground">
						Stock Overview
					</h3>
					<p className="text-xs text-muted-foreground mt-1">
						Company stock vs distributed inventory
					</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-chart-1" />
						<span className="text-xs text-muted-foreground">
							In Stock
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-chart-2" />
						<span className="text-xs text-muted-foreground">
							Distributed
						</span>
					</div>
				</div>
			</div>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient
								id="colorInStock"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor="hsl(var(--chart-1))"
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor="hsl(var(--chart-1))"
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient
								id="colorDistributed"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor="hsl(var(--chart-2))"
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor="hsl(var(--chart-2))"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="hsl(var(--border))"
							vertical={false}
						/>
						<XAxis
							dataKey="date"
							axisLine={false}
							tickLine={false}
							tick={{
								fill: 'hsl(var(--muted-foreground))',
								fontSize: 12,
							}}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{
								fill: 'hsl(var(--muted-foreground))',
								fontSize: 12,
							}}
							tickFormatter={(value) => `${value / 1000}k`}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: 'hsl(var(--card))',
								border: '1px solid hsl(var(--border))',
								borderRadius: '8px',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							}}
							labelStyle={{ color: 'hsl(var(--foreground))' }}
						/>
						<Area
							type="monotone"
							dataKey="in_stock"
							stroke="hsl(var(--chart-1))"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorInStock)"
						/>
						<Area
							type="monotone"
							dataKey="distributed"
							stroke="hsl(var(--chart-2))"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorDistributed)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
