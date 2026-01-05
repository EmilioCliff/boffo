import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Search,
	ArrowLeftRight,
	ArrowDownCircle,
	ArrowUpCircle,
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import GetStockMovements from '@/services/admin/getStockMovements';
import GetFormHelpers from '@/services/getFormHelpers';
import GetResellersFormData from '@/services/admin/getResellersFormData';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import PaginationNew from '@/components/PaginationNew';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import GetAdminPageData from '@/services/admin/getPageDataHelper';

export default function StockMovementsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [filterProductId, setFilterProductId] = useState(0);
	const [filterResellerId, setFilterResellerId] = useState(0);
	const [filterOwnerType, setFilterOwnerType] = useState('all');
	const [filterMovementType, setFilterMovementType] = useState('all');
	const [filterSource, setFilterSource] = useState('all');
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });

	const { isLoading, error, data } = useQuery({
		queryKey: [
			'stock_movements',
			pageIndex,
			pageSize,
			debouncedInput,
			filterProductId,
			filterResellerId,
			filterMovementType,
			filterSource,
			filterOwnerType,
		],
		queryFn: () =>
			GetStockMovements({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				ProductID: filterProductId,
				ResellerID: filterResellerId,
				OwnerType: filterOwnerType,
				Type: filterMovementType,
				Source: filterSource,
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const { data: productsForm } = useQuery({
		queryKey: ['products', 'form'],
		queryFn: GetFormHelpers,
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const { data: resellersForm } = useQuery({
		queryKey: ['resellers', 'form'],
		queryFn: GetResellersFormData,
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const statsQuery = useQuery({
		queryKey: ['admin-page-data', 'stock_movements'],
		queryFn: () => GetAdminPageData('stock_movements'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [
		pageSize,
		debouncedInput,
		filterProductId,
		filterResellerId,
		filterMovementType,
		filterSource,
		filterOwnerType,
	]);

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

	if (isLoading) {
		return <Spinner />;
	}
	if (error) {
		return <ErrorCard message={error.message} />;
	}

	const filteredMovements = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.stock_movements;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-foreground">
					Stock Movements
				</h1>
				<p className="text-muted-foreground">
					Complete audit trail of all stock movements
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<ArrowLeftRight className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Movements
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_movements.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
							<ArrowDownCircle className="h-6 w-6 text-emerald-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Stock In
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_stock_in.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
							<ArrowUpCircle className="h-6 w-6 text-blue-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Stock Out
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_stock_out.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search products..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row sm:gap-6 items-start sm:items-center">
					<div className="space-y-2">
						<Label>Filter by Product</Label>
						<Select
							value={filterProductId.toString()}
							onValueChange={(v: any) =>
								setFilterProductId(Number(v))
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="0">All Products</SelectItem>
								{productsForm?.data?.map((product) => (
									<SelectItem
										key={product.id}
										value={product.id.toString()}
									>
										{product.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Filter by Reseller</Label>
						<Select
							value={filterResellerId.toString()}
							onValueChange={(val: string) => {
								setFilterResellerId(Number(val));
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="0">All Resellers</SelectItem>
								{resellersForm?.data?.map((reseller) => (
									<SelectItem
										key={reseller.id}
										value={reseller.id.toString()}
									>
										{reseller.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Filter by Owner</Label>
						<Select
							value={filterOwnerType}
							defaultValue={filterOwnerType}
							onValueChange={(val: string) => {
								setFilterOwnerType(val);
							}}
						>
							<SelectTrigger className="w-32">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Owners</SelectItem>
								<SelectItem value="COMPANY">Company</SelectItem>
								<SelectItem value="RESELLER">
									Reseller
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Filter by Movement</Label>
						<Select
							value={filterMovementType}
							defaultValue={filterMovementType}
							onValueChange={(val: string) => {
								setFilterMovementType(val);
							}}
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
						<Label>Filter by Source</Label>
						<Select
							value={filterSource}
							defaultValue={filterSource}
							onValueChange={(val: string) => {
								setFilterSource(val);
							}}
						>
							<SelectTrigger className="w-32">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Source</SelectItem>
								<SelectItem value="PURCHASE">
									Purchase
								</SelectItem>
								<SelectItem value="DISTRIBUTION">
									Distribution
								</SelectItem>
								<SelectItem value="SALE">Sale</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Stock Movement Table */}
			<div className="rounded-lg border border-border bg-card">
				<div className="w-full overflow-x-auto">
					<table className="data-table min-w-[900px]">
						<thead>
							<tr>
								<th>Movement ID</th>
								<th>Type</th>
								<th>Source</th>
								<th>Product</th>
								<th className="text-right">Quantity</th>
								<th className="text-right">Unit Price</th>
								<th>Note</th>
								<th>Date & Time</th>
								<th>Performed By</th>
							</tr>
						</thead>
						<tbody>
							{filteredMovements.length > 0 ? (
								filteredMovements.map((movement) => (
									<tr key={movement.id}>
										<td>
											<span className="font-medium">
												{`MOV-${new Date(
													movement.created_at,
												).getFullYear()}-${String(
													movement.id,
												).padStart(3, '0')}`}
											</span>
										</td>
										<td>
											{getTypeBadge(
												movement.movement_type,
											)}
										</td>
										<td>
											{getSourceBadge(movement.source)}
										</td>
										<td>{movement.product?.name}</td>
										<td className="text-right">
											<span
												className={
													movement.movement_type ===
													'IN'
														? 'text-emerald-500'
														: 'text-blue-500'
												}
											>
												{movement.movement_type === 'IN'
													? '+'
													: '-'}
												{movement.quantity.toLocaleString()}
											</span>
										</td>
										<td className="text-right">
											KES{' '}
											{movement.unit_price.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											) ?? 0}
										</td>
										<td className="max-w-[100px] truncate">
											<Tooltip>
												<TooltipTrigger asChild>
													<span>{movement.note}</span>
												</TooltipTrigger>
												<TooltipContent>
													{movement.note}
												</TooltipContent>
											</Tooltip>
										</td>
										<td>
											{format(
												movement.created_at,
												'dd MMM yyyy',
											)}{' '}
											<span className="text-muted-foreground">
												{format(
													movement.created_at,
													'HH:mm a',
												)}
											</span>
										</td>
										<td>
											{movement.user?.name
												? movement.user.name
												: 'System'}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={9}
										className="text-center py-8"
									>
										<p className="text-muted-foreground">
											No stock movement items found
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
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
		</div>
	);
}
