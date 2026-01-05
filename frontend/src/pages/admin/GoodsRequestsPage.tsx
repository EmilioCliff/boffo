import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { XCircle, Clock, AlertCircle, AlertTriangle } from 'lucide-react';
import type { GoodsRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import GetGoodsRequested from '@/services/getGoodsRequested';
import GetResellersFormData from '@/services/admin/getResellersFormData';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import PaginationNew from '@/components/PaginationNew';
import { format } from 'date-fns';
import { RequestedProductsList } from '@/components/ProductRequestedList';
import UpdateGoodRequest from '@/services/admin/updateGoodRequest';
import GetAdminPageData from '@/services/admin/getPageDataHelper';

export default function GoodsRequestsPage() {
	const [status, setStatus] = useState('all');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [filterResellerId, setFilterResellerId] = useState(0);
	const [selectedRequest, setSelectedRequest] = useState<GoodsRequest | null>(
		null,
	);
	const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
		null,
	);
	const [adminComment, setAdminComment] = useState('');
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: [
			'goods_requested',
			pageIndex,
			pageSize,
			status,
			filterResellerId,
		],
		queryFn: () =>
			GetGoodsRequested({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Status: status,
				ResellerID: filterResellerId,
			}),
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
		queryKey: ['admin-page-data', 'goods_requests'],
		queryFn: () => GetAdminPageData('goods_requests'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, status, filterResellerId]);

	const updateMutation = useMutation({
		mutationFn: UpdateGoodRequest,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['goods_requested'],
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

	const getStatusBadge = (status: string) => {
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

		updateMutation.mutate({
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

	const filteredRequests = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.goods_requests;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-foreground">
					Goods Requests
				</h1>
				<p className="text-muted-foreground">
					Review and manage reseller stock requests
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
								{stats?.total_pending.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
							<AlertCircle className="h-6 w-6 text-blue-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Approved
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_approved.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
							<AlertTriangle className="h-6 w-6 text-orange-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Cancelled
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_cancelled.toLocaleString() ?? '0'}
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
								{stats?.total_rejected.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
				<div className="ml-auto flex gap-6 items-center">
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

			{/* Goods Requested Table */}
			<div className="rounded-lg border border-border bg-card">
				<div className="w-full overflow-x-auto">
					<table className="data-table min-w-[900px]">
						<thead>
							<tr>
								<th>Request ID</th>
								<th>Reseller</th>
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
										<td>
											<span>{request.user?.name}</span>
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
											{getStatusBadge(request.status)}
										</td>
										<td>
											<div className="flex gap-2 items-center">
												{request.status === 'PENDING' &&
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
								))
							) : (
								<tr>
									<td
										colSpan={6}
										className="text-center py-8"
									>
										<p className="text-muted-foreground">
											No request items found
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

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
										{selectedRequest.user?.name}
									</p>
								</div>
							</div>
							{selectedRequest?.payload && (
								<RequestedProductsList
									products={selectedRequest.payload}
								/>
							)}
							<div className="grid gap-2">
								<Label htmlFor="comment">Admin Comment</Label>
								<Textarea
									id="comment"
									placeholder={
										actionType === 'approve'
											? 'Add any notes for the reseller...'
											: 'Explain the reason for rejection...'
									}
									value={adminComment}
									onChange={(e) =>
										setAdminComment(e.target.value)
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
										Reseller:
									</span>
									<p className="font-medium">
										{selectedRequest.user?.name}
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
										{selectedRequest.comment}
									</p>
								</div>
							</div>
							{selectedRequest?.payload && (
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
