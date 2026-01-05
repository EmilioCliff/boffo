import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	ArrowLeft,
	BadgeCheck,
	Mail,
	MapPin,
	PenLine,
	Phone,
	Search,
	Store,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import GetReseller from '@/services/admin/getReseller';
import { useForm } from 'react-hook-form';
import type { GoodsRequest, UserForm } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserFormSchema } from '@/lib/schemas';
import UpdateUser from '@/services/admin/updateUser';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import GetResellerStock from '@/services/getResellerStock';
import PaginationNew from '@/components/PaginationNew';
import GetFormHelpers from '@/services/getFormHelpers';
import GetResellerSales from '@/services/getResellerSales';
import GetPayments from '@/services/admin/getPayments';
import { Label } from '@/components/ui/label';
import GetGoodsRequested from '@/services/getGoodsRequested';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { RequestedProductsList } from '@/components/ProductRequestedList';
import { Textarea } from '@/components/ui/textarea';
import UpdateGoodRequest from '@/services/admin/updateGoodRequest';

export default function ResellerDetailPage() {
	const [status, setStatus] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [editMode, setEditMode] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get('tab') ?? 'stock';
	const [filterProductId, setFilterProductId] = useState(0);

	const [recordedByFilter, setRecordedByFilter] = useState('all');
	const [methodFilter, setMethodFilter] = useState<string>('all');

	const [selectedRequest, setSelectedRequest] = useState<GoodsRequest | null>(
		null,
	);
	const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
		null,
	);
	const [adminComment, setAdminComment] = useState('');

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ['resellers', id],
		queryFn: () => GetReseller(Number(id)),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const stockQuery = useQuery({
		queryKey: [
			'resellers',
			id,
			'stock',
			pageIndex,
			pageSize,
			debouncedInput,
			status,
		],
		queryFn: () =>
			GetResellerStock({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				Status: status,
				ResellerID: Number(id),
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
		enabled: activeTab === 'stock',
	});

	const salesQuery = useQuery({
		queryKey: [
			'resellers',
			id,
			'sales',
			pageIndex,
			pageSize,
			filterProductId,
		],
		queryFn: () =>
			GetResellerSales({
				pageNumber: pageIndex,
				pageSize: pageSize,
				ResellerID: Number(id),
				ProductID: filterProductId,
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
		enabled: activeTab === 'sales',
	});

	const paymentsQuery = useQuery({
		queryKey: [
			'resellers',
			id,
			'payments',
			pageIndex,
			pageSize,
			debouncedInput,
			recordedByFilter,
			methodFilter,
		],
		queryFn: () =>
			GetPayments({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				Status: recordedByFilter,
				Method: methodFilter,
				ResellerID: Number(id),
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
		enabled: activeTab === 'payments',
	});

	const goodsRequestedQuery = useQuery({
		queryKey: ['resellers', id, 'requests', pageIndex, pageSize, status],
		queryFn: () =>
			GetGoodsRequested({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Status: status,
				ResellerID: Number(id),
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
		enabled: activeTab === 'requests',
	});

	const { data: productsForm } = useQuery({
		queryKey: ['products', 'form'],
		queryFn: GetFormHelpers,
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, debouncedInput, status, debouncedInput]);

	useEffect(() => {
		setPageIndex(1);
		setStatus('all');
		setRecordedByFilter('all');
		setMethodFilter('all');
		setSearchQuery('');
		setAdminComment('');
		setFilterProductId(0);
		setSelectedRequest(null);
		setActionType(null);
	}, [activeTab]);

	const form = useForm<UserForm>({
		resolver: zodResolver(UserFormSchema),
		defaultValues: {
			id: Number(id) ?? 0,
			name: data?.data.user.name ?? '',
			email: data?.data.user.email ?? '',
			phone_number: data?.data.user.phone_number ?? '',
			role: data?.data.user.role ?? '',
		},
	});
	const originalRole = useRef(form.getValues('role'));
	const currentRole = form.watch('role');

	const updateMutation = useMutation({
		mutationFn: UpdateUser,
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({
				queryKey: ['resellers', id],
			});
			refetch();
			form.reset({
				id: data.data.id,
				name: data.data.name,
				email: data.data.email,
				phone_number: data.data.phone_number,
				role: data.data.role,
			});
			toast({
				variant: 'success',
				title: 'Reseller updated',
				description: 'Reseller details have been updated successfully.',
			});
			setEditMode(false);
		},
		onError: (error: any) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message,
			});
		},
	});

	const updateGoodReqMutation = useMutation({
		mutationFn: UpdateGoodRequest,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['resellers', id],
			});
			refetch();
			setSelectedRequest(null);
			setActionType(null);
			setAdminComment('');
			toast({
				variant: 'success',
				title: 'Request Updated',
				description: `Goods request has been successfully ${
					actionType === 'approve' ? 'approved' : 'rejected'
				}.`,
			});
		},
		onError: (error: any) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message,
			});
		},
	});

	const onSubmit = (data: UserForm) => {
		updateMutation.mutate(data);
	};

	const onError = (error: any) => {
		console.log(error);
	};

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

	const getMethodBadge = (method: string) => {
		switch (method) {
			case 'MPESA':
				return (
					<Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
						M-PESA
					</Badge>
				);
			case 'CASH':
				return (
					<Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
						Cash
					</Badge>
				);
		}
	};

	const getStatusBadgeGoods = (status: string) => {
		switch (status) {
			case 'PENDING':
				return (
					<Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
						Pending
					</Badge>
				);
			case 'APPROVED':
				return (
					<Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
						Approved
					</Badge>
				);
			case 'REJECTED':
				return (
					<Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
						Rejected
					</Badge>
				);
		}
	};

	const handleCancel = () => {
		form.reset();
		setEditMode(false);
	};

	const handleAction = () => {
		if (!selectedRequest || !actionType || !adminComment) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					'Please provide an admin comment before proceeding.',
			});
			return;
		}

		updateGoodReqMutation.mutate({
			id: selectedRequest.id,
			status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
			comment: adminComment,
		});
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return <ErrorCard message={error.message} />;
	}

	const profile = data?.data;
	const totalPaid = profile?.account.total_paid ?? 0;
	const totalValue = profile?.account.total_value_received ?? 1;

	const progress = Math.min(100, (totalPaid / totalValue) * 100);

	return (
		<div className="space-y-6">
			<Button
				onClick={() => navigate('/admin/resellers')}
				variant="ghost"
				size="sm"
				className="gap-2"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to resellers
			</Button>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-3">
						<Avatar className="h-12 w-12">
							<AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
								{profile?.user.name
									.split(' ')
									.map((n) => n[0])
									.join('')}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="text-2xl font-bold text-foreground">
								{profile?.user.name}
							</h1>
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<BadgeCheck className="h-4 w-4 text-emerald-500" />
									<span>RESELLER</span>
									<Separator
										orientation="vertical"
										className="h-4 hidden sm:block"
									/>
								</div>
								<span>
									Joined{' '}
									{format(
										profile?.user.created_at ?? new Date(),
										'PPP',
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Badge
						variant={'outline'}
						className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
					>
						Active
					</Badge>
				</div>
			</div>

			{/* Reseller account snapshot */}
			<div className="grid gap-4 lg:grid-cols-4">
				<Card className="lg:col-span-2 shadow-sm">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base font-semibold">
							<Store className="h-4 w-4 text-primary" />
							Account snapshot
						</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-4">
						<div className="rounded-lg border bg-muted/40 p-3">
							<p className="text-xs text-muted-foreground">
								Total stock issued
							</p>
							<p className="mt-2 text-xl font-semibold">
								{profile?.account.total_stock_received.toLocaleString()}{' '}
								units
							</p>
						</div>
						<div className="rounded-lg border bg-muted/40 p-3">
							<p className="text-xs text-muted-foreground">
								Value of stock issued
							</p>
							<p className="mt-2 text-xl font-semibold">
								KES{' '}
								{profile?.account.total_value_received.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									},
								)}
							</p>
						</div>
						<div className="rounded-lg border bg-muted/40 p-3">
							<p className="text-xs text-muted-foreground">
								Total sales
							</p>
							<p className="mt-2 text-xl font-semibold text-emerald-600">
								KES{' '}
								{profile?.account.total_sales_value.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									},
								)}
							</p>
						</div>
						<div className="rounded-lg border bg-muted/40 p-3">
							<p className="text-xs text-muted-foreground">
								Payment received
							</p>
							<p className="mt-2 text-xl font-semibold text-primary">
								KES{' '}
								{profile?.account.total_paid.toLocaleString(
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
				<Card className="shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Outstanding</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">
								Balance
							</span>
							<span className="font-semibold text-amber-600">
								KES{' '}
								{profile?.account.balance.toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									},
								)}
							</span>
						</div>
						<div className="h-2 rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-amber-500 transition-all"
								style={{
									width: `${progress}%`,
								}}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Track upcoming settlements. Connect payments to
							reduce this balance.
						</p>
					</CardContent>
				</Card>
				<Card className="shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Contact</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-muted-foreground">
						<div className="flex items-center gap-2 text-foreground">
							<Phone className="h-4 w-4 text-primary" />
							<span>{profile?.user.phone_number}</span>
						</div>
						<div className="flex items-center gap-2 text-foreground">
							<Mail className="h-4 w-4 text-primary" />
							<span>{profile?.user.email}</span>
						</div>
						<div className="flex items-center gap-2 text-foreground">
							<MapPin className="h-4 w-4 text-primary" />
							<span>Nairobi, Kenya</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Reseller profile form */}
			<Card className="shadow-sm">
				<CardHeader className="flex  gap-2 border-b pb-4">
					<div className="grid gap-1">
						<CardTitle className="text-base font-semibold flex items-center gap-2">
							<PenLine className="h-4 w-4 text-primary" />
							Reseller profile
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Edit basic details. Saving only updates local state
							until backend wiring is added.
						</p>
					</div>
					<div className="flex items-center gap-2 rounded-lg border bg-card px-3 ml-auto py-2 text-sm">
						<span className="text-muted-foreground">Edit mode</span>
						<Switch
							checked={editMode}
							onCheckedChange={(checked) => setEditMode(checked)}
						/>
					</div>
				</CardHeader>
				<CardContent className="">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, onError)}
							className="space-y-8"
						>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-700 font-semibold">
												Name
											</FormLabel>
											<FormControl>
												<Input
													placeholder="john doe"
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													readOnly={!editMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-700 font-semibold">
												Email
											</FormLabel>
											<FormControl>
												<Input
													placeholder="john.doe@gmail.com"
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													readOnly={!editMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone_number"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-700 font-semibold">
												Phone Number
											</FormLabel>
											<FormControl>
												<Input
													placeholder="0712345678"
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													readOnly={!editMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-700 font-semibold">
												Role
											</FormLabel>

											<FormControl>
												<Select
													value={field.value}
													onValueChange={
														field.onChange
													}
													disabled={!editMode}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select role" />
													</SelectTrigger>

													<SelectContent>
														<SelectItem value="admin">
															Admin
														</SelectItem>
														<SelectItem value="staff">
															Reseller
														</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>

											{/* ⚠️ Role change warning */}
											{editMode &&
												currentRole !==
													originalRole.current && (
													<p className="mt-2 text-sm text-amber-600">
														Changing the role will
														affect user permissions
														and data.
													</p>
												)}

											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex">
								<div className="flex gap-6 ml-auto">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleCancel}
										disabled={!editMode}
									>
										Reset
									</Button>
									<Button
										type="submit"
										size="sm"
										disabled={!editMode}
									>
										Save changes
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{/* Tabs: Stock, Sales, Payments, Requests */}
			<Tabs
				value={activeTab}
				onValueChange={(tab) => setSearchParams({ tab })}
				className="space-y-4"
			>
				<TabsList className="w-full justify-start gap-2 overflow-auto">
					<TabsTrigger value="stock">Stock on hand</TabsTrigger>
					<TabsTrigger value="sales">Sales</TabsTrigger>
					<TabsTrigger value="payments">Payments</TabsTrigger>
					<TabsTrigger value="requests">Goods requests</TabsTrigger>
				</TabsList>

				<TabsContent value="stock" className="space-y-3">
					<Card className="shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-base">
								Stock by product
							</CardTitle>
						</CardHeader>
						<CardContent className="p">
							{/* Filters  */}
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
								<div className="relative w-full sm:w-72">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										placeholder="Search products..."
										className="pl-10"
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
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
											<SelectItem value="all">
												All Status
											</SelectItem>
											<SelectItem value="true">
												In Stock
											</SelectItem>
											<SelectItem value="false">
												Out of Stock
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Stock Table */}
							<div className="rounded-lg border border-border bg-card">
								<div className="w-full overflow-x-auto">
									<table className="data-table min-w-[900px]">
										<thead>
											<tr>
												<th>Product</th>
												<th>Category</th>
												<th>Unit</th>
												<th className="text-right">
													Current Stock
												</th>
												<th className="text-right">
													Threshold
												</th>
												<th>Status</th>
											</tr>
										</thead>
										<tbody>
											{stockQuery.data?.data &&
											stockQuery.data?.data.length > 0 ? (
												stockQuery.data?.data.map(
													(product) => (
														<tr
															key={
																product.product_id
															}
														>
															<td>
																<span className="font-medium">
																	{
																		product
																			.product
																			?.name
																	}
																</span>
															</td>
															<td className="text-muted-foreground">
																{
																	product.product_category
																}
															</td>
															<td className="text-muted-foreground">
																{
																	product
																		.product
																		?.unit
																}
															</td>
															<td className="text-right">
																<span className="font-semibold">
																	{product.quantity.toLocaleString()}
																</span>
															</td>
															<td className="text-right ">
																{
																	product.low_stock_threshold
																}
															</td>
															<td>
																{getStatusBadge(
																	product.quantity,
																	product.low_stock_threshold ??
																		10,
																)}
															</td>
														</tr>
													),
												)
											) : (
												<tr>
													<td
														colSpan={6}
														className="text-center py-8"
													>
														<p className="text-muted-foreground">
															No stock items found
														</p>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* Pagination */}
							{stockQuery.data?.pagination && (
								<PaginationNew
									page={stockQuery.data.pagination.page}
									pageSize={
										stockQuery.data.pagination.page_size
									}
									total={stockQuery.data.pagination.total}
									totalPages={
										stockQuery.data.pagination.total_pages
									}
									hasNext={
										stockQuery.data.pagination.has_next
									}
									hasPrevious={
										stockQuery.data.pagination.has_previous
									}
									nextPage={
										stockQuery.data.pagination.next_page
									}
									previousPage={
										stockQuery.data.pagination.previous_page
									}
									onPageChange={(newPage) =>
										setPageIndex(newPage)
									}
									onPageSizeChange={(size) =>
										setPageSize(size)
									}
								/>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="sales" className="space-y-3">
					<Card className="shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-base">
								Sales made
							</CardTitle>
						</CardHeader>
						<CardContent>
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
											<SelectItem value="0">
												All Products
											</SelectItem>
											{productsForm?.data?.map(
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
							</div>

							{/* Sales Table */}
							<div className="rounded-lg border border-border bg-card">
								<div className="w-full overflow-x-auto">
									<table className="data-table min-w-[900px]">
										<thead>
											<tr>
												<th>Sale ID</th>
												<th>Product</th>
												<th>Unit</th>
												<th className="text-right">
													Quantity
												</th>
												<th className="text-right">
													Selling Price
												</th>
												<th className="text-right">
													Total
												</th>
												<th>Date Sold</th>
											</tr>
										</thead>
										<tbody>
											{salesQuery.data?.data &&
											salesQuery.data.data.length > 0 ? (
												salesQuery.data?.data.map(
													(product) => (
														<tr key={product.id}>
															<td>
																<span className="font-medium">
																	{`SAL-${new Date(
																		product.created_at,
																	).getFullYear()}-${String(
																		product.id,
																	).padStart(
																		3,
																		'0',
																	)}`}
																</span>
															</td>
															<td>
																<span className="font-medium">
																	{
																		product
																			.product
																			?.name
																	}
																</span>
															</td>
															<td className="text-muted-foreground">
																{
																	product
																		.product
																		?.unit
																}
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
													),
												)
											) : (
												<tr>
													<td
														colSpan={7}
														className="text-center py-8"
													>
														<p className="text-muted-foreground">
															No sales items found
														</p>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* Pagination */}
							{salesQuery.data?.pagination && (
								<PaginationNew
									page={salesQuery.data.pagination.page}
									pageSize={
										salesQuery.data.pagination.page_size
									}
									total={salesQuery.data.pagination.total}
									totalPages={
										salesQuery.data.pagination.total_pages
									}
									hasNext={
										salesQuery.data.pagination.has_next
									}
									hasPrevious={
										salesQuery.data.pagination.has_previous
									}
									nextPage={
										salesQuery.data.pagination.next_page
									}
									previousPage={
										salesQuery.data.pagination.previous_page
									}
									onPageChange={(newPage) =>
										setPageIndex(newPage)
									}
									onPageSizeChange={(size) =>
										setPageSize(size)
									}
								/>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="payments" className="space-y-3">
					<Card className="shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-base">
								Payment history
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Filters  */}
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
								<div className="relative w-full sm:w-72">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										placeholder="Search products..."
										className="pl-10"
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
									/>
								</div>
								<div className="flex gap-6 items-center">
									<div className="space-y-2">
										<Label>Filter by Method</Label>
										<Select
											value={methodFilter}
											onValueChange={setMethodFilter}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Filter by method" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">
													All Methods
												</SelectItem>
												<SelectItem value="MPESA">
													M-PESA
												</SelectItem>
												<SelectItem value="CASH">
													Cash
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Filter by Source</Label>
										<Select
											value={recordedByFilter}
											onValueChange={setRecordedByFilter}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Filter by Source" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">
													All Source
												</SelectItem>
												<SelectItem value="SYSTEM">
													System
												</SelectItem>
												<SelectItem value="ADMIN">
													Internal
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							{/* Payments Table */}
							<div className="rounded-lg border border-border bg-card">
								<div className="w-full overflow-x-auto">
									<table className="data-table min-w-[900px]">
										<thead>
											<tr>
												<th>Payment ID</th>
												<th className="text-right">
													Amount
												</th>
												<th>Method</th>
												<th>Reference</th>
												<th>Date</th>
												<th>Source</th>
												<th>Status</th>
											</tr>
										</thead>
										<tbody>
											{paymentsQuery.data?.data &&
											paymentsQuery.data.data.length >
												0 ? (
												paymentsQuery.data?.data.map(
													(payment) => (
														<tr key={payment.id}>
															<td>
																<span className="font-medium">
																	{`PAY-${new Date(
																		payment.created_at,
																	).getFullYear()}-${String(
																		payment.id,
																	).padStart(
																		3,
																		'0',
																	)}`}
																</span>
															</td>

															<td className="text-right">
																KES{' '}
																{payment.amount.toLocaleString(
																	undefined,
																	{
																		minimumFractionDigits: 2,
																		maximumFractionDigits: 2,
																	},
																)}
															</td>
															<td>
																{getMethodBadge(
																	payment.method,
																)}
															</td>
															<td>
																{payment.reference
																	? payment.reference
																	: '-'}
															</td>
															<td className="">
																{format(
																	payment.date_paid,
																	'dd MMM yyyy',
																)}
															</td>
															<td>
																{
																	payment.recorded_by
																}
															</td>
															<td>
																{payment.date_paid ? (
																	<Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
																		Confirmed
																	</Badge>
																) : (
																	<Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
																		Pending
																	</Badge>
																)}
															</td>
															<td></td>
														</tr>
													),
												)
											) : (
												<tr>
													<td
														colSpan={7}
														className="text-center py-8"
													>
														<p className="text-muted-foreground">
															No payment items
															found
														</p>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* Pagination */}
							{paymentsQuery.data?.pagination && (
								<PaginationNew
									page={paymentsQuery.data.pagination.page}
									pageSize={
										paymentsQuery.data.pagination.page_size
									}
									total={paymentsQuery.data.pagination.total}
									totalPages={
										paymentsQuery.data.pagination
											.total_pages
									}
									hasNext={
										paymentsQuery.data.pagination.has_next
									}
									hasPrevious={
										paymentsQuery.data.pagination
											.has_previous
									}
									nextPage={
										paymentsQuery.data.pagination.next_page
									}
									previousPage={
										paymentsQuery.data.pagination
											.previous_page
									}
									onPageChange={(newPage) =>
										setPageIndex(newPage)
									}
									onPageSizeChange={(size) =>
										setPageSize(size)
									}
								/>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="requests" className="space-y-3">
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="text-base">
								Recent goods requests
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Filters */}
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
								<div className="ml-auto flex gap-6 items-center">
									<div className="space-y-2">
										<Label>Filter by Status</Label>
										<Select
											value={status}
											onValueChange={setStatus}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Filter by status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">
													All Status
												</SelectItem>
												<SelectItem value="PENDING">
													Pending
												</SelectItem>
												<SelectItem value="APPROVED">
													Approved
												</SelectItem>
												<SelectItem value="REJECTED">
													Rejected
												</SelectItem>
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
												<th>Request ID</th>
												<th>Comment</th>
												<th>Date</th>
												<th>Status</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{goodsRequestedQuery.data?.data &&
											goodsRequestedQuery.data.data
												.length > 0 ? (
												goodsRequestedQuery.data?.data.map(
													(request) => (
														<tr key={request.id}>
															<td>
																<span className="font-medium">
																	{`REQ-${new Date(
																		request.created_at,
																	).getFullYear()}-${String(
																		request.id,
																	).padStart(
																		3,
																		'0',
																	)}`}
																</span>
															</td>

															<td>
																{request.comment
																	? request.comment
																	: '-'}
															</td>
															<td className="">
																{format(
																	request.created_at,
																	'dd MMM yyyy',
																)}
															</td>
															<td>
																{getStatusBadgeGoods(
																	request.status,
																)}
															</td>
															<td>
																<div className="flex gap-2 items-center">
																	{request.status ===
																		'PENDING' &&
																		!request.cancelled && (
																			<>
																				<Button
																					size="sm"
																					variant="outline"
																					className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
																					onClick={() => {
																						setSelectedRequest(
																							request,
																						);
																						setActionType(
																							'approve',
																						);
																					}}
																				>
																					Approve
																				</Button>
																				<Button
																					size="sm"
																					variant="outline"
																					className="h-7 text-xs text-destructive hover:text-destructive"
																					onClick={() => {
																						setSelectedRequest(
																							request,
																						);
																						setActionType(
																							'reject',
																						);
																					}}
																				>
																					Reject
																				</Button>
																			</>
																		)}
																	{request.cancelled && (
																		<span className="text-sm text-muted-foreground italic">
																			Cancelled
																		</span>
																	)}
																	<Button
																		size="sm"
																		variant="ghost"
																		className="h-7 text-xs"
																		onClick={() =>
																			setSelectedRequest(
																				request,
																			)
																		}
																	>
																		View
																	</Button>
																</div>
															</td>
														</tr>
													),
												)
											) : (
												<tr>
													<td
														colSpan={5}
														className="text-center py-8"
													>
														<p className="text-muted-foreground">
															No request items
															found
														</p>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* Pagination */}
							{goodsRequestedQuery.data?.pagination && (
								<PaginationNew
									page={
										goodsRequestedQuery.data.pagination.page
									}
									pageSize={
										goodsRequestedQuery.data.pagination
											.page_size
									}
									total={
										goodsRequestedQuery.data.pagination
											.total
									}
									totalPages={
										goodsRequestedQuery.data.pagination
											.total_pages
									}
									hasNext={
										goodsRequestedQuery.data.pagination
											.has_next
									}
									hasPrevious={
										goodsRequestedQuery.data.pagination
											.has_previous
									}
									nextPage={
										goodsRequestedQuery.data.pagination
											.next_page
									}
									previousPage={
										goodsRequestedQuery.data.pagination
											.previous_page
									}
									onPageChange={(newPage) =>
										setPageIndex(newPage)
									}
									onPageSizeChange={(size) =>
										setPageSize(size)
									}
								/>
							)}

							{/* Action Dialog */}
							<Dialog
								open={!!actionType}
								onOpenChange={() => setActionType(null)}
							>
								<DialogContent className="sm:max-w-[450px]">
									<DialogHeader>
										<DialogTitle>
											{actionType === 'approve'
												? 'Approve Request'
												: 'Reject Request'}
										</DialogTitle>
									</DialogHeader>
									{selectedRequest && (
										<div className="space-y-4 py-4">
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<span className="text-muted-foreground">
														Request ID:
													</span>
													<p className="font-medium">
														{`REQ-${new Date(
															selectedRequest.created_at,
														).getFullYear()}-${String(
															selectedRequest.id,
														).padStart(3, '0')}`}
													</p>
												</div>
												<div>
													<span className="text-muted-foreground">
														Reseller:
													</span>
													<p className="font-medium">
														{
															selectedRequest.user
																?.name
														}
													</p>
												</div>
											</div>
											{selectedRequest?.payload && (
												<RequestedProductsList
													products={
														selectedRequest.payload
													}
												/>
											)}
											<div className="grid gap-2">
												<Label htmlFor="comment">
													Admin Comment
												</Label>
												<Textarea
													id="comment"
													placeholder={
														actionType === 'approve'
															? 'Add any notes for the reseller...'
															: 'Explain the reason for rejection...'
													}
													value={adminComment}
													onChange={(e) =>
														setAdminComment(
															e.target.value,
														)
													}
												/>
											</div>
											<Button
												className="w-full"
												variant={
													actionType === 'reject'
														? 'destructive'
														: 'default'
												}
												onClick={handleAction}
											>
												{actionType === 'approve'
													? 'Approve Request'
													: 'Reject Request'}
											</Button>
										</div>
									)}
								</DialogContent>
							</Dialog>

							{/* View Dialog */}
							<Dialog
								open={!!selectedRequest && !actionType}
								onOpenChange={() => setSelectedRequest(null)}
							>
								<DialogContent className="sm:max-w-[450px]">
									<DialogHeader>
										<DialogTitle>
											Request Details
										</DialogTitle>
									</DialogHeader>
									{selectedRequest && (
										<div className="space-y-4 py-4">
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<span className="text-muted-foreground">
														Request ID:
													</span>
													<p className="font-medium">
														{`REQ-${new Date(
															selectedRequest.created_at,
														).getFullYear()}-${String(
															selectedRequest.id,
														).padStart(3, '0')}`}
													</p>
												</div>
												<div>
													<span className="text-muted-foreground">
														Status:
													</span>
													<p>
														{getStatusBadgeGoods(
															selectedRequest.status,
														)}
													</p>
												</div>
												<div>
													<span className="text-muted-foreground">
														Reseller:
													</span>
													<p className="font-medium">
														{
															selectedRequest.user
																?.name
														}
													</p>
												</div>
												<div>
													<span className="text-muted-foreground">
														Date:
													</span>
													<p className="font-medium">
														{format(
															selectedRequest.created_at,
															'dd MMM yyyy',
														)}
													</p>
												</div>

												<div className="col-span-2">
													<span className="text-muted-foreground">
														Notes:
													</span>
													<p className="font-medium">
														{
															selectedRequest.comment
														}
													</p>
												</div>
											</div>
											{selectedRequest?.payload && (
												<RequestedProductsList
													products={
														selectedRequest.payload
													}
												/>
											)}
										</div>
									)}
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
