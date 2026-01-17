import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
	Truck,
	Package,
	Users,
	TrendingUp,
	CalendarIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import GetStockDistributions from '@/services/admin/getStockDistributions';
import GetFormHelpers from '@/services/getFormHelpers';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import PaginationNew from '@/components/PaginationNew';
import GetResellersFormData from '@/services/admin/getResellersFormData';
import { format } from 'date-fns';
import type { StockDistributionForm } from '@/lib/types';
import AddStockDistribution from '@/services/admin/addStockDistribution';
import { useForm } from 'react-hook-form';
import { StockDistributionFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
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

export default function DistributionPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [filterProductId, setFilterProductId] = useState(0);
	const [filterResellerId, setFilterResellerId] = useState(0);
	const [selectedProductId, setSelectedProductId] = useState(0);
	const [selectedResellerId, setSelectedResellerId] = useState(0);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: [
			'stock_distributions',
			pageIndex,
			pageSize,
			debouncedInput,
			filterProductId,
			filterResellerId,
		],
		queryFn: () =>
			GetStockDistributions({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				ProductID: filterProductId,
				ResellerID: filterResellerId,
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
		queryKey: ['admin-page-data', 'distributions'],
		queryFn: () => GetAdminPageData('distributions'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, debouncedInput, filterProductId, filterResellerId]);

	const form = useForm<StockDistributionForm>({
		resolver: zodResolver(StockDistributionFormSchema),
		defaultValues: {
			reseller_id: 0,
			product_id: 0,
			quantity: 0,
			unit_price: 0,
			date_distributed: format(new Date(), 'yyyy-MM-dd'),
		},
	});

	const createMutation = useMutation({
		mutationFn: AddStockDistribution,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['stock_distributions'],
			});
			refetch();
			form.reset({});
			toast({
				variant: 'success',
				title: 'Stock Distributed',
				description: `Stock distribution to reseller ID ${selectedResellerId} has been recorded successfully.`,
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

	const onSubmit = (data: StockDistributionForm) => {
		if (selectedProductId === 0 || selectedResellerId === 0) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					'Please select a product and reseller for the distribution.',
			});
			return;
		}
		createMutation.mutate({
			...data,
			product_id: selectedProductId,
			reseller_id: selectedResellerId,
		});
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

	const filteredDistributions = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.distributions;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Stock Distribution
					</h1>
					<p className="text-muted-foreground">
						Distribute stock to resellers with batch-aware tracking
					</p>
				</div>
				<Dialog
					open={isDialogOpen}
					onOpenChange={() => {
						if (isDialogOpen) {
							form.reset();
							setSelectedProductId(0);
							setSelectedResellerId(0);
						}
						setIsDialogOpen(!isDialogOpen);
					}}
				>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							New Distribution
						</Button>
					</DialogTrigger>
					<DialogContent
						aria-describedby={undefined}
						className="sm:max-w-[500px]"
					>
						<DialogHeader>
							<DialogTitle>Create Distribution</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
								className="space-y-8"
							>
								<div className="grid gap-4 py-4">
									<div className="grid gap-2">
										<Label htmlFor="reseller">
											Reseller
										</Label>
										<Select
											value={
												selectedResellerId
													? selectedResellerId.toString()
													: undefined
											}
											onValueChange={(val: string) => {
												setSelectedResellerId(
													Number(val),
												);
											}}
											required
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select reseller" />
											</SelectTrigger>
											<SelectContent>
												{resellersForm?.data.map(
													(reseller) => (
														<SelectItem
															key={reseller.id}
															value={reseller.id.toString()}
														>
															{reseller.name}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
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
												name="unit_price"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															Unit Price (KES)
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
										<div className="grid gap-2">
											<FormField
												control={form.control}
												name="date_distributed"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															Date Distributed
														</FormLabel>
														<Popover>
															<PopoverTrigger
																asChild
															>
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
									</div>
									<Button
										disabled={createMutation.isPending}
										className="mt-2"
										type="submit"
									>
										{createMutation.isPending
											? 'Creating...'
											: 'Create Distribution'}
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
							<Truck className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Distributions
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_distribution.toLocaleString() ??
									'0'}
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
								Units Distributed
							</p>
							<p className="text-2xl font-bold">
								{stats?.units_distributed.toLocaleString() ??
									'0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
							<TrendingUp className="h-6 w-6 text-blue-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Value Distributed
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
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
							<Users className="h-6 w-6 text-purple-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Active Resellers
							</p>
							<p className="text-2xl font-bold">
								{stats?.active_resellers.toLocaleString() ??
									'0'}
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
				</div>
			</div>

			{/* Distribution Table */}
			<div className="rounded-lg border border-border bg-card">
				<div className="w-full overflow-x-auto">
					<table className="data-table min-w-[900px]">
						<thead>
							<tr>
								<th>Distribution ID</th>
								<th>Reseller</th>
								<th>Product</th>
								<th className="text-right">Quantity</th>
								<th className="text-right">Unit Price</th>
								<th className="text-right">Total Value</th>
								<th>Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredDistributions.length > 0 ? (
								filteredDistributions.map((dist) => (
									<tr key={dist.id}>
										<td>
											<span className="font-medium">
												{`DIST-${new Date(
													dist.date_distributed,
												).getFullYear()}-${String(
													dist.id,
												).padStart(3, '0')}`}
											</span>
										</td>
										<td>
											<span>{dist.user?.name}</span>
										</td>
										<td>{dist.product?.name}</td>
										<td className="text-right">
											{dist.quantity.toLocaleString()}
										</td>
										<td className="text-right">
											KES{' '}
											{dist.unit_price.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											) ?? 0}
										</td>
										<td className="text-right font-semibold">
											KES{' '}
											{dist.total_price.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</td>
										<td className="">
											{format(
												dist.date_distributed,
												'dd MMM yyyy',
											)}
										</td>
										<td>
											<Button
												size="sm"
												variant="outline"
												className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
												onClick={() =>
													toast({
														title: 'Download Invoice',
														description:
															'This feature is coming soon!',
													})
												}
											>
												Download Invoice
											</Button>
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
											No distribution items found
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
