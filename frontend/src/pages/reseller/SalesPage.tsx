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
import { CalendarIcon, Plus, ShoppingCart, TrendingUp } from 'lucide-react';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import GetResellerSales from '@/services/getResellerSales';
import { useAuth } from '@/contexts/AuthContext';
import AddSale from '@/services/reseller/addSale';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SaleForm } from '@/lib/types';
import { SaleFormSchema } from '@/lib/schemas';
import { format } from 'date-fns';
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
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import PaginationNew from '@/components/PaginationNew';
import GetResellerStockForm from '@/services/reseller/getStockForm';
import GetResellerPageData from '@/services/reseller/getPageDataHelper';

export default function SalesPage() {
	const { toast } = useToast();
	const { decoded } = useAuth();
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const queryClient = useQueryClient();
	const [filterProductId, setFilterProductId] = useState(0);
	const [selectedProductId, setSelectedProductId] = useState(0);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ['sales', pageIndex, pageSize, filterProductId],
		queryFn: () =>
			GetResellerSales({
				pageNumber: pageIndex,
				pageSize: pageSize,
				ResellerID: decoded?.user_id || 0,
				ProductID: filterProductId,
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const { data: productsForm } = useQuery({
		queryKey: ['stock', 'form'],
		queryFn: GetResellerStockForm,
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const statsQuery = useQuery({
		queryKey: ['reseller-page-data', 'sales'],
		queryFn: () => GetResellerPageData('sales'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, filterProductId]);

	const form = useForm<SaleForm>({
		resolver: zodResolver(SaleFormSchema),
		defaultValues: {
			product_id: 0,
			quantity: 0,
			selling_price: 0,
			date_sold: format(new Date(), 'yyyy-MM-dd'),
		},
	});

	const createMutation = useMutation({
		mutationFn: AddSale,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['sales'],
			});
			refetch();
			toast({
				variant: 'success',
				title: 'Sale Recorded',
				description: 'The sale has been recorded successfully.',
			});
			setIsDialogOpen(false);
			setFilterProductId(0);
		},
		onError: (error: any) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message,
			});
		},
	});

	const onSubmit = (data: SaleForm) => {
		if (selectedProductId === 0) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Please select a product for the sale.',
			});
			return;
		}
		createMutation.mutate({
			...data,
			product_id: selectedProductId,
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

	const sales = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.sales;

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold">Sales</h1>
					<p className="text-muted-foreground">
						Record and track your sales
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Record Sale
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[450px]">
						<DialogHeader>
							<DialogTitle>Record New Sale</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
								className="space-y-8"
							>
								<div className="grid gap-4 py-4">
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
												name="selling_price"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															Selling Price (KES)
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
											name="date_sold"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-semibold">
														Date Sold
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
										type="submit"
										className="mt-2"
										disabled={createMutation.isPending}
									>
										Record Sale
									</Button>
								</div>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats Card  */}
			<div className="grid gap-4 sm:grid-cols-2">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<ShoppingCart className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Units Sold
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_units_sold.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
							<TrendingUp className="h-6 w-6 text-emerald-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Sales
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{stats?.total_sales_value.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									},
								)}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters  */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
				<div className="flex gap-2 ml-auto">
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
			</div>

			{/* Sales Table */}
			<div className="rounded-lg border border-border bg-card overflow-hidden">
				<table className="data-table">
					<thead>
						<tr>
							<th>Sale ID</th>
							<th>Product</th>
							<th>Unit</th>
							<th className="text-right">Quantity</th>
							<th className="text-right">Selling Price</th>
							<th className="text-right">Total</th>
							<th>Date Sold</th>
						</tr>
					</thead>
					<tbody>
						{sales.length > 0 ? (
							sales.map((product) => (
								<tr key={product.id}>
									<td>
										<span className="font-medium">
											{`SAL-${new Date(
												product.created_at,
											).getFullYear()}-${String(
												product.id,
											).padStart(3, '0')}`}
										</span>
									</td>
									<td>
										<span className="font-medium">
											{product.product?.name}
										</span>
									</td>
									<td className="text-muted-foreground">
										{product.product?.unit}
									</td>
									<td className="text-right">
										{product.quantity.toLocaleString()}
									</td>
									<td className="text-right">
										<span className="font-semibold">
											KES{' '}
											{product.selling_price.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</span>
									</td>
									<td className="text-right">
										<span className="font-semibold">
											KES{' '}
											{product.total_amount.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</span>
									</td>
									<td>
										{format(
											product.date_sold,
											'dd MMM yyyy',
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={7} className="text-center py-8">
									<p className="text-muted-foreground">
										No sales items found
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

			{/* <Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base">
							Sales History
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="mb-4 relative max-w-sm">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search sales..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<div className="rounded-lg border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Product</TableHead>
										<TableHead className="text-right">
											Qty
										</TableHead>
										<TableHead className="text-right">
											Unit Price
										</TableHead>
										<TableHead className="text-right">
											Total
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filtered.map((sale) => (
										<TableRow key={sale.id}>
											<TableCell>
												{new Date(
													sale.date,
												).toLocaleDateString()}
											</TableCell>
											<TableCell className="font-medium">
												{sale.product}
											</TableCell>
											<TableCell className="text-right">
												{sale.quantity}
											</TableCell>
											<TableCell className="text-right">
												KES {sale.unitPrice}
											</TableCell>
											<TableCell className="text-right font-medium">
												KES{' '}
												{sale.total.toLocaleString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card> */}
		</div>
	);
}
