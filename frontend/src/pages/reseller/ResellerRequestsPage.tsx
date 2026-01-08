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
import { Plus, FileText, Clock, CheckCircle, X, XCircle } from 'lucide-react';
import type {
	CommonDataResponse,
	GoodRequestForm,
	GoodsRequest,
} from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import GetGoodsRequested from '@/services/getGoodsRequested';
import { useAuth } from '@/contexts/AuthContext';
import AddGoodRequest from '@/services/reseller/addGoodRequest';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import { Form } from '@/components/ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoodRequestSchema } from '@/lib/schemas';
import GetFormHelpers from '@/services/getFormHelpers';
import PaginationNew from '@/components/PaginationNew';
import { RequestedProductsList } from '@/components/ProductRequestedList';
import { format } from 'date-fns';
import { UpdateGoodsRequestForm } from '@/components/UpdateGoodsRequestForm';
import GetResellerPageData from '@/services/reseller/getPageDataHelper';
import CancelGoodRequest from '@/services/reseller/cancelGoodRequest';

export default function ResellerRequestsPage() {
	const { decoded } = useAuth();
	const [status, setStatus] = useState('all');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] =
		useState<CommonDataResponse | null>(null);
	const [quantity, setQuantity] = useState<number>(0);
	const [priceRequested, setPriceRequested] = useState<number>(0);
	const [selectedRequest, setSelectedRequest] = useState<GoodsRequest | null>(
		null,
	);
	const [actionType, setActionType] = useState<'edit' | 'cancel' | null>(
		null,
	);
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ['goods_requested', pageIndex, pageSize, status],
		queryFn: () =>
			GetGoodsRequested({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Status: status,
				ResellerID: decoded?.user_id || 0,
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
		queryKey: ['reseller-page-data', 'goods_requests'],
		queryFn: () => GetResellerPageData('goods_requests'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, status]);

	const form = useForm<GoodRequestForm>({
		resolver: zodResolver(GoodRequestSchema),
		defaultValues: {
			data: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'data',
	});

	const createMutation = useMutation({
		mutationFn: AddGoodRequest,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['goods_requested'],
			});
			refetch();
			setSelectedRequest(null);
			setActionType(null);
			form.reset();
			toast({
				variant: 'success',
				title: 'Request Added',
				description: `Goods request has been successfully added.`,
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

	const getStatusBadge = (status: string) => {
		const styles: Record<string, string> = {
			PENDING: 'bg-amber-500/10 text-amber-500',
			APPROVED: 'bg-blue-500/10 text-blue-500',
			REJECTED: 'bg-destructive/10 text-destructive',
		};
		return (
			<Badge className={styles[status]}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</Badge>
		);
	};

	const onSubmit = (data: GoodRequestForm) => {
		createMutation.mutate(data);
	};

	const onError = (message: any) => {
		toast({
			variant: 'destructive',
			title: 'Error',
			description: message,
		});
	};

	const cancelMutation = useMutation({
		mutationFn: CancelGoodRequest,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['goods_requested'],
			});
			refetch();
			setSelectedRequest(null);
			setActionType(null);
			form.reset();
			toast({
				variant: 'success',
				title: 'Request Added',
				description: `Goods request has been successfully added.`,
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

	const onDelete = (id: number) => {
		cancelMutation.mutate(id);
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return <ErrorCard message={error.message} />;
	}

	const filteredRequests = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.goods_requests;

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold">Goods Requests</h1>
					<p className="text-muted-foreground">
						Request stock from the company
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							New Request
						</Button>
					</DialogTrigger>

					<DialogContent className="sm:max-w-[550px]">
						<DialogHeader>
							<DialogTitle>Create Goods Request</DialogTitle>
						</DialogHeader>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
								className="space-y-6"
							>
								{/* Add Product Row */}
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label>Product</Label>
										<Select
											value={
												selectedProduct?.id?.toString() ||
												''
											}
											onValueChange={(value) => {
												const product =
													productsForm?.data?.find(
														(p) =>
															p.id ===
															Number(value),
													);
												setSelectedProduct(
													product ?? null,
												);
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select product" />
											</SelectTrigger>
											<SelectContent>
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

									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<Label>Quantity</Label>
											<Input
												type="number"
												// min={1}
												value={quantity}
												onChange={(e) =>
													setQuantity(
														Number(e.target.value),
													)
												}
											/>
										</div>

										<div className="grid gap-2">
											<Label>Price Requested</Label>
											<Input
												type="number"
												min={0}
												value={priceRequested}
												onChange={(e) =>
													setPriceRequested(
														Number(e.target.value),
													)
												}
											/>
										</div>
									</div>

									<Button
										type="button"
										// variant="secondary"
										disabled={
											!selectedProduct || quantity <= 0
										}
										onClick={() => {
											if (!selectedProduct) return;

											append({
												product_id: selectedProduct.id,
												product_name:
													selectedProduct.name,
												quantity,
												price_requested: priceRequested,
											});

											// reset row
											setSelectedProduct(null);
											setQuantity(0);
											setPriceRequested(0);
										}}
									>
										Add Product
									</Button>
								</div>

								{/* Added Products */}
								{fields.length > 0 && (
									<div className="space-y-3">
										<h4 className="text-sm font-semibold">
											Requested Products
										</h4>

										{fields.map((field, index) => (
											<div
												key={field.id}
												className="flex items-center justify-between rounded-md border p-3"
											>
												<div>
													<p className="font-medium">
														{field.product_name}
													</p>
													<p className="text-sm text-muted-foreground">
														Qty: {field.quantity} ·
														Price:{' '}
														{field.price_requested}
													</p>
												</div>

												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() =>
														remove(index)
													}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								)}

								{/* Submit */}
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => setIsDialogOpen(false)}
									>
										Cancel
									</Button>

									<Button
										type="submit"
										disabled={fields.length === 0}
									>
										Submit Request
									</Button>
								</div>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats Cards  */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<FileText className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Requests
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_requests.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
							<Clock className="h-6 w-6 text-amber-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Pending
							</p>
							<p className="text-2xl font-bold">
								{stats?.pending_requests.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
							<CheckCircle className="h-6 w-6 text-blue-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Approved
							</p>
							<p className="text-2xl font-bold">
								{stats?.approved_requests.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
							<XCircle className="h-6 w-6 text-destructive" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Rejected
							</p>
							<p className="text-2xl font-bold">
								{stats?.rejected_requests.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters  */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
				<div className="ml-auto flex gap-6 items-center">
					<div className="space-y-2">
						<Label>Filter by Status</Label>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="PENDING">Pending</SelectItem>
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

			{/* Goods Requests Table (Reseller) */}
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
							{filteredRequests.length > 0 ? (
								filteredRequests.map((request) => (
									<tr key={request.id}>
										<td>
											<span className="font-medium">
												{`REQ-${new Date(
													request.created_at,
												).getFullYear()}-${String(
													request.id,
												).padStart(3, '0')}`}
											</span>
										</td>

										<td>{request.comment || '-'}</td>

										<td>
											{format(
												request.created_at,
												'dd MMM yyyy',
											)}
										</td>

										<td>
											{getStatusBadge(request.status)}
										</td>

										<td>
											<div className="flex gap-2 items-center">
												{/* Update */}
												{request.status === 'PENDING' &&
													!request.cancelled && (
														<Button
															size="sm"
															variant="outline"
															className="h-7 text-xs"
															onClick={() => {
																setSelectedRequest(
																	request,
																);
																setActionType(
																	'edit',
																);
															}}
														>
															Update
														</Button>
													)}

												{/* Cancel */}
												{request.status === 'PENDING' &&
													!request.cancelled && (
														<Button
															size="sm"
															variant="outline"
															className="h-7 text-xs text-destructive hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
															onClick={() => {
																setSelectedRequest(
																	request,
																);
																setActionType(
																	'cancel',
																);
															}}
														>
															Cancel
														</Button>
													)}
												{request.cancelled && (
													<span className="text-sm text-muted-foreground italic">
														Cancelled
													</span>
												)}
												{/* View */}
												<Button
													size="sm"
													variant="ghost"
													className="h-7 text-xs"
													onClick={() => {
														setSelectedRequest(
															request,
														);
														setActionType(null);
													}}
												>
													View
												</Button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="text-center py-8"
									>
										<p className="text-muted-foreground">
											No requests items found
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Cancel Request Dialog  */}
			<Dialog
				open={actionType === 'cancel'}
				onOpenChange={() => setActionType(null)}
			>
				<DialogContent className="sm:max-w-[450px]">
					<DialogHeader>
						<DialogTitle>Cancel Request</DialogTitle>
					</DialogHeader>

					{selectedRequest && (
						<div className="space-y-4 py-4">
							<p className="text-sm text-muted-foreground">
								Are you sure you want to cancel this goods
								request? This action cannot be undone.
							</p>

							{selectedRequest.payload && (
								<RequestedProductsList
									products={selectedRequest.payload}
								/>
							)}

							<Button
								variant="destructive"
								className="w-full"
								onClick={() => onDelete(selectedRequest.id)}
							>
								Cancel Request
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Update Dialog  */}
			<Dialog
				open={actionType === 'edit'}
				onOpenChange={() => setActionType(null)}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Update Goods Request</DialogTitle>
					</DialogHeader>

					{selectedRequest && (
						<UpdateGoodsRequestForm
							request={selectedRequest}
							onSuccess={() => {
								setActionType(null);
								setSelectedRequest(null);
								refetch();
							}}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* View Dialog  */}
			<Dialog
				open={!!selectedRequest && !actionType}
				onOpenChange={() => setSelectedRequest(null)}
			>
				<DialogContent className="sm:max-w-[450px]">
					<DialogHeader>
						<DialogTitle>Request Details</DialogTitle>
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
										{getStatusBadge(selectedRequest.status)}
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
										{selectedRequest.comment || '-'}
									</p>
								</div>
							</div>

							{selectedRequest.payload && (
								<RequestedProductsList
									products={selectedRequest.payload}
								/>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

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
