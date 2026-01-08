import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
	Search,
	Package,
	TrendingUp,
	TrendingDown,
	Activity,
	ArrowUpRight,
	ArrowDownRight,
	DollarSign,
	ShoppingCart,
	Boxes,
	AlertCircle,
	ArrowDownCircle,
	ArrowUpCircle,
	Wallet,
} from 'lucide-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import GetStockMovements from '@/services/admin/getStockMovements';
import { format } from 'date-fns';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import PaginationNew from '@/components/PaginationNew';
import { useAuth } from '@/contexts/AuthContext';
import GetResellerPageData from '@/services/reseller/getPageDataHelper';
import EmptyState from '@/components/EmptyState';
import { formatCurrency } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

export default function AccountSummaryPage() {
	const { decoded } = useAuth();
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchQuery, setSearchQuery] = useState('');
	const [movementTypeFilter, setMovementTypeFilter] = useState<string>('all');
	const [sourceFilter, setSourceFilter] = useState<string>('all');
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });

	const resellerId = decoded?.user_id || 0;

	// Fetch stock movements
	const { isLoading, error, data } = useQuery({
		queryKey: [
			'reseller-stock-movements',
			pageIndex,
			pageSize,
			debouncedInput,
			movementTypeFilter,
			sourceFilter,
		],
		queryFn: () =>
			GetStockMovements({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				Type: movementTypeFilter,
				Source: sourceFilter,
				ResellerID: resellerId,
				OwnerType: 'RESELLER',
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const statsQuery = useQuery({
		queryKey: ['reseller-page-data', 'account_summary', resellerId],
		queryFn: () => GetResellerPageData('account_summary'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
		enabled: resellerId > 0,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [debouncedInput, movementTypeFilter, sourceFilter]);

	const getTypeBadge = (type: string) => {
		return type === 'IN' ? (
			<Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 gap-1">
				<ArrowDownCircle className="h-3 w-3" />
				IN
			</Badge>
		) : (
			<Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 gap-1">
				<ArrowUpCircle className="h-3 w-3" />
				OUT
			</Badge>
		);
	};

	const getSourceBadge = (source: string) => {
		const styles: Record<string, string> = {
			PURCHASE: 'bg-emerald-500/10 text-emerald-500',
			DISTRIBUTION: 'bg-blue-500/10 text-blue-500',
			SALE: 'bg-amber-500/10 text-amber-500',
		};
		return (
			<Badge className={`${styles[source]} hover:opacity-80`}>
				{source.charAt(0).toUpperCase() + source.slice(1)}
			</Badge>
		);
	};

	const stats = statsQuery.data?.data.account_summary;
	const stockMovements = data?.data || [];
	const pagination = data?.pagination;

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return <ErrorCard message={error.message} />;
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Account Summary
				</h1>
				<p className="text-muted-foreground">
					Overview of your business performance and inventory
					movements
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Package className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Value Received
							</p>
							<p className="text-2xl font-bold">
								{formatCurrency(
									stats?.total_value_received || 0,
									false,
								)}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Sales Made
							</p>
							<p className="text-2xl font-bold">
								{formatCurrency(
									stats?.total_sales_value || 0,
									false,
								)}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Wallet className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Paid
							</p>
							<p className="text-2xl font-bold">
								{formatCurrency(stats?.total_paid || 0, false)}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<AlertCircle className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Outstanding Balance
							</p>
							<p className="text-2xl font-bold">
								{formatCurrency(stats?.balance || 0, false)}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Stock Movements Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-xl">
								Stock Movement History
							</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">
								Track all your inventory movements and
								transactions
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
						<div className="relative w-full sm:w-72">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search stock movements..."
								className="pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className="flex flex-col gap-4 sm:flex-row sm:gap-6 items-start sm:items-center">
							<div className="space-y-2">
								<Label htmlFor="movement-type">
									Movement Type
								</Label>
								<Select
									value={movementTypeFilter}
									defaultValue={movementTypeFilter}
									onValueChange={setMovementTypeFilter}
								>
									<SelectTrigger className="w-32">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											All Movements
										</SelectItem>
										<SelectItem value="IN">In</SelectItem>
										<SelectItem value="OUT">Out</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="source">Source</Label>
								<Select
									value={sourceFilter}
									defaultValue={sourceFilter}
									onValueChange={setSourceFilter}
								>
									<SelectTrigger className="w-32">
										<SelectValue placeholder="Source" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											All Source
										</SelectItem>
										<SelectItem value="PURCHASE">
											Purchase
										</SelectItem>
										<SelectItem value="DISTRIBUTION">
											Distribution
										</SelectItem>
										<SelectItem value="SALE">
											Sale
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Table */}
					<div className="rounded-lg border border-border bg-card">
						<div className="w-full overflow-x-auto">
							<table className="data-table min-w-[900px]">
								<thead>
									<tr>
										<th>Date</th>
										<th>Product</th>
										<th>Type</th>
										<th>Quantity</th>
										<th className="text-right">
											Unit Price
										</th>
										<th className="text-right">
											Total Value
										</th>
										<th>Source</th>
										<th>Note</th>
									</tr>
								</thead>
								<tbody>
									{stockMovements.length > 0 ? (
										stockMovements.map((movement) => {
											const totalValue =
												movement.quantity *
												movement.unit_price;

											return (
												<tr
													key={movement.id}
													className="border-b hover:bg-muted/50 transition-colors"
												>
													<td className="px-4 py-3 text-sm">
														{format(
															new Date(
																movement.created_at,
															),
															'MMM dd, yyyy',
														)}
														<br />
														<span className="text-xs text-muted-foreground">
															{format(
																new Date(
																	movement.created_at,
																),
																'HH:mm',
															)}
														</span>
													</td>
													<td className="px-4 py-3">
														<div className="flex flex-col">
															<span className="font-medium text-sm">
																{movement
																	.product
																	?.name ||
																	'N/A'}
															</span>
															{movement.product_category && (
																<span className="text-xs text-muted-foreground">
																	{
																		movement.product_category
																	}
																</span>
															)}
														</div>
													</td>
													<td className="px-4 py-3">
														{getTypeBadge(
															movement.movement_type,
														)}
													</td>
													<td className="text-center">
														<span
															className={
																movement.movement_type ===
																'IN'
																	? 'text-emerald-500'
																	: 'text-blue-500'
															}
														>
															{movement.movement_type ===
															'IN'
																? '+'
																: '-'}
															{movement.quantity.toLocaleString()}
														</span>
													</td>
													<td className="text-right text-sm">
														{formatCurrency(
															movement.unit_price,
														)}
													</td>
													<td className="text-right font-medium text-sm">
														{formatCurrency(
															totalValue,
														)}
													</td>
													<td className="">
														{getSourceBadge(
															movement.source,
														)}
													</td>
													<td className="max-w-[100px] truncate">
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<span>
																	{
																		movement.note
																	}
																</span>
															</TooltipTrigger>
															<TooltipContent>
																{movement.note}
															</TooltipContent>
														</Tooltip>
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td
												colSpan={8}
												className="text-center py-8"
											>
												<p className="text-muted-foreground">
													No movements items found
												</p>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>

					{pagination && (
						<PaginationNew
							page={pagination.page}
							pageSize={pagination.page_size}
							total={pagination.total}
							totalPages={pagination.total_pages}
							hasNext={pagination.has_next}
							hasPrevious={pagination.has_previous}
							nextPage={pagination.next_page}
							previousPage={pagination.previous_page}
							onPageChange={(newPage) => setPageIndex(newPage)}
							onPageSizeChange={(size) => setPageSize(size)}
						/>
					)}
				</CardContent>
			</Card>

			{/* Additional Insights */}
			{/* <div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-green-600" />
							Stock Inflow
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									This Month
								</span>
								<span className="font-semibold">
									1000 items
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									Pending Requests
								</span>
								<span className="font-semibold">
									1000
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<TrendingDown className="h-5 w-5 text-orange-600" />
							Stock Outflow
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									Total Sales
								</span>
								<span className="font-semibold">
									1000 items
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									Revenue
								</span>
								<span className="font-semibold">
									KES 1,000,000
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div> */}
		</div>
	);
}
