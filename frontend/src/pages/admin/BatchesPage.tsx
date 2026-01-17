import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
	Plus,
	Search,
	Package,
	Hash,
	CalendarIcon,
	Wallet,
	Clock,
} from 'lucide-react';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import GetProductsBatches from '@/services/admin/getProductBatches';
import { useForm } from 'react-hook-form';
import type { ProductBatchForm } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductBatchFormSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import AddProductBatch from '@/services/admin/addProductBatch';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import GetFormHelpers from '@/services/getFormHelpers';
import { format } from 'date-fns';
import PaginationNew from '@/components/PaginationNew';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import GetAdminPageData from '@/services/admin/getPageDataHelper';

export default function BatchesPage() {
	const [status, setStatus] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [filterProductId, setFilterProductId] = useState(0);
	const [selectedProductId, setSelectedProductId] = useState(0);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: [
			'products',
			pageIndex,
			pageSize,
			debouncedInput,
			status,
			filterProductId,
		],
		queryFn: () =>
			GetProductsBatches({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				Status: status,
				ProductID: filterProductId,
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

	const statsQuery = useQuery({
		queryKey: ['admin-page-data', 'batches'],
		queryFn: () => GetAdminPageData('batches'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, debouncedInput, filterProductId, status]);

	const form = useForm<ProductBatchForm>({
		resolver: zodResolver(ProductBatchFormSchema),
		defaultValues: {
			batch_number: '',
			product_id: 0,
			quantity: 0,
			purchase_price: 0,
			date_received: '',
		},
	});

	const createMutation = useMutation({
		mutationFn: AddProductBatch,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['batches'],
			});
			refetch();
			form.reset({});
			toast({
				variant: 'success',
				title: 'Batch Recorded',
				description: 'New product batch has been added successfully.',
			});
			setIsDialogOpen(false);
		},
		onError: (error: any) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message,
			});
		},
	});

	const getStatusBadge = (
		remainingQuantity: number,
		lowStockThreshold: number,
	) => {
		if (remainingQuantity <= 0) {
			return (
				<Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
					Depleted
				</Badge>
			);
		}

		if (remainingQuantity <= lowStockThreshold) {
			return (
				<Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
					Low Stock
				</Badge>
			);
		}

		return (
			<Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
				Active
			</Badge>
		);
	};

	const onSubmit = (data: ProductBatchForm) => {
		if (selectedProductId === 0) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Please select a product for the batch.',
			});
			return;
		}
		createMutation.mutate({ ...data, product_id: selectedProductId });
	};

	const onError = (error: any) => {
		console.log(error);
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return <ErrorCard message={error.message} />;
	}

	const filteredBatches = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.batches;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Batch Management
					</h1>
					<p className="text-muted-foreground">
						Track incoming stock by batches with FIFO visibility
					</p>
				</div>
				<Dialog
					open={isDialogOpen}
					onOpenChange={() => {
						if (isDialogOpen) {
							form.reset();
							setSelectedProductId(0);
						}
						setIsDialogOpen(!isDialogOpen);
					}}
				>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Add New Batch
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[500px]">
						<DialogHeader>
							<DialogTitle>Add New Batch</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
								className="space-y-8"
							>
								<div className="grid gap-4 py-4">
									<div className="grid gap-2">
										<FormField
											control={form.control}
											name="batch_number"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-semibold">
														Batch Number
													</FormLabel>
													<FormControl>
														<Input
															placeholder="BTH-2024-XXX"
															className="placeholder:text-sm placeholder:text-gray-500"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="product">Product</Label>
										<Select
											value={
												selectedProductId
													? selectedProductId.toString()
													: undefined
											}
											onValueChange={(val: string) => {
												setSelectedProductId(
													Number(val),
												);
											}}
											required
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select product" />
											</SelectTrigger>
											<SelectContent>
												{productsForm?.data.map(
													(product) => (
														<SelectItem
															key={product.id}
															value={product.id.toString()}
														>
															{product.name}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<FormField
												control={form.control}
												name="quantity"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															Quantity
														</FormLabel>
														<FormControl>
															<Input
																placeholder="0"
																type="number"
																className="placeholder:text-sm placeholder:text-gray-500"
																{...field}
																onChange={(e) =>
																	field.onChange(
																		e.target
																			.valueAsNumber,
																	)
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className="grid gap-2">
											<FormField
												control={form.control}
												name="purchase_price"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															Purchase Price (KES)
														</FormLabel>
														<FormControl>
															<Input
																placeholder="0.00"
																type="number"
																className="placeholder:text-sm placeholder:text-gray-500"
																{...field}
																onChange={(e) =>
																	field.onChange(
																		e.target
																			.valueAsNumber,
																	)
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
									<div className="grid gap-2">
										<FormField
											control={form.control}
											name="date_received"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-semibold">
														Date Received
													</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={
																		'outline'
																	}
																	className={cn(
																		'w-full pl-3 text-left font-normal',
																		!field.value &&
																			'text-muted-foreground',
																	)}
																>
																	{field.value ? (
																		format(
																			field.value,
																			'PPP',
																		)
																	) : (
																		<span>
																			Pick
																			a
																			date
																		</span>
																	)}
																	<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto p-0"
															align="start"
														>
															<Calendar
																mode="single"
																selected={
																	field.value
																		? new Date(
																				field.value,
																			)
																		: undefined
																}
																onSelect={(
																	date,
																) =>
																	field.onChange(
																		format(
																			date!,
																			'yyyy-MM-dd',
																		),
																	)
																}
																disabled={(
																	date,
																) =>
																	date >
																		new Date() ||
																	date <
																		new Date(
																			'1900-01-01',
																		)
																}
															/>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<Button
										disabled={createMutation.isPending}
										type="submit"
										className="mt-2"
									>
										{createMutation.isPending
											? 'Adding...'
											: 'Add Batch'}
									</Button>
								</div>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Hash className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Batches
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_batches.toLocaleString() ?? '0'}
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
								Active Batches
							</p>
							<p className="text-2xl font-bold">
								{stats?.active_batches.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
							<Clock className="h-6 w-6 text-orange-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Stock Value
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{stats?.remaining_value.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									},
								) ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
							<Wallet className="h-6 w-6 text-blue-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Purchased
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{stats?.total_value.toLocaleString(undefined, {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								}) ?? '0'}
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
				<div className="flex gap-6 items-center">
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
						<Label>Filter by Status</Label>
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
								<SelectItem value="false">
									Out of Stock
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Products Table */}
			<div className="rounded-lg border border-border bg-card">
				<div className="w-full overflow-x-auto">
					<table className="data-table min-w-[900px]">
						<thead>
							<tr>
								<th>Batch Number</th>
								<th>Product</th>
								<th>Category</th>
								<th className="text-right">Qty Received</th>
								<th className="text-right">Qty Remaining</th>
								<th className="text-right">Purchase Price</th>
								<th>Date Received</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{filteredBatches.length > 0 ? (
								filteredBatches.map((batch) => (
									<tr key={batch.id}>
										<td>
											<span className="font-medium">
												{batch.batch_number}
											</span>
										</td>
										<td>
											<span>{batch.product?.name}</span>
										</td>
										<td>{batch.product_category}</td>
										<td className="text-right">
											{batch.quantity.toLocaleString()}
										</td>
										<td className="text-right">
											<span
												className={
													(batch.remaining_quantity ??
														0) < 50
														? 'text-amber-500 font-medium'
														: ''
												}
											>
												{batch?.remaining_quantity?.toLocaleString() ??
													0}
											</span>
										</td>
										<td className="text-right">
											KES{' '}
											{batch.purchase_price.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</td>
										<td className="">
											{format(
												batch.date_received,
												'dd MMM yyyy',
											)}
										</td>
										<td>
											{getStatusBadge(
												batch.remaining_quantity ?? 0,
												batch.product
													?.low_stock_threshold ?? 10,
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={8}
										className="text-center py-8"
									>
										<p className="text-muted-foreground">
											No batch items found
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
