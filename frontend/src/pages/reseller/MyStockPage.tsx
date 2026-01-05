import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Package, AlertTriangle } from 'lucide-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/AuthContext';
import GetResellerStock from '@/services/getResellerStock';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import PaginationNew from '@/components/PaginationNew';
import GetResellerPageData from '@/services/reseller/getPageDataHelper';

export default function MyStockPage() {
	const { decoded } = useAuth();
	const [status, setStatus] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });

	const { isLoading, error, data } = useQuery({
		queryKey: ['stock', pageIndex, pageSize, debouncedInput, status],
		queryFn: () =>
			GetResellerStock({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				Status: status,
				ResellerID: decoded?.user_id || 0,
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const statsQuery = useQuery({
		queryKey: ['reseller-page-data', 'stock'],
		queryFn: () => GetResellerPageData('stock'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, status, debouncedInput]);

	const getStatusBadge = (quantity: number, lowStockThreshold: number) => {
		switch (
			quantity >= lowStockThreshold
				? 'in_stock'
				: quantity > 0
				? 'low_stock'
				: 'out_of_stock'
		) {
			case 'in_stock':
				return <span className="badge-success">In Stock</span>;
			case 'low_stock':
				return <span className="badge-warning">Low Stock</span>;
			case 'out_of_stock':
				return <span className="badge-danger">Out of Stock</span>;
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return <ErrorCard message={error.message} />;
	}

	const stocks = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.stock;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">My Stock</h1>
				<p className="text-muted-foreground">
					View your current inventory
				</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Package className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Units
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_units}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
							<Package className="h-6 w-6 text-emerald-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Value
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{stats?.total_value.toLocaleString(undefined, {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								})}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
							<AlertTriangle className="h-6 w-6 text-amber-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Low Stock
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_low_stock}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters  */}
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
				<div className="flex gap-2">
					<Select
						value={status}
						defaultValue={status}
						onValueChange={(val: string) => {
							setStatus(val);
						}}
					>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="true">In Stock</SelectItem>
							<SelectItem value="false">Out of Stock</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Stock Table */}
			<div className="rounded-lg border border-border bg-card overflow-hidden">
				<table className="data-table">
					<thead>
						<tr>
							<th>Product</th>
							<th>Category</th>
							<th>Unit</th>
							<th className="text-right">Current Stock</th>
							<th className="text-right">Threshold</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{stocks.length > 0 ? (
							stocks.map((product) => (
								<tr key={product.product_id}>
									<td>
										<span className="font-medium">
											{product.product?.name}
										</span>
									</td>
									<td className="text-muted-foreground">
										{product.product_category}
									</td>
									<td className="text-muted-foreground">
										{product.product?.unit}
									</td>
									<td className="text-right">
										<span className="font-semibold">
											{product.quantity.toLocaleString()}
										</span>
									</td>
									<td className="text-right ">
										{product.low_stock_threshold}
									</td>
									<td>
										{getStatusBadge(
											product.quantity,
											product.low_stock_threshold ?? 10,
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className="text-center py-8">
									<p className="text-muted-foreground">
										No stock items found
									</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
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
