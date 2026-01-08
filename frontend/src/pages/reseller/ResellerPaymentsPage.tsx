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
import { Label } from '@/components/ui/label';
import {
	Search,
	CreditCard,
	Wallet,
	TrendingUp,
	CalendarIcon,
} from 'lucide-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import GetPayments from '@/services/admin/getPayments';
import { format } from 'date-fns';
import { DateRangePicker } from '@/components/DateRangePicker';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import PaginationNew from '@/components/PaginationNew';
import { useAuth } from '@/contexts/AuthContext';
import GetResellerPageData from '@/services/reseller/getPageDataHelper';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ResellerPaymentsPage() {
	const { decoded } = useAuth();
	const { toast } = useToast();
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [recordedByFilter, setRecordedByFilter] = useState('all');
	const [methodFilter, setMethodFilter] = useState<string>('all');
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });

	const resellerId = decoded?.user_id || 0;

	const { isLoading, error, data } = useQuery({
		queryKey: [
			'reseller-payments',
			pageIndex,
			pageSize,
			fromDate,
			toDate,
			debouncedInput,
			recordedByFilter,
			methodFilter,
			resellerId,
		],
		queryFn: () =>
			GetPayments({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				Status: recordedByFilter,
				Method: methodFilter,
				FromDate: fromDate,
				ToDate: toDate,
				ResellerID: resellerId,
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
		enabled: resellerId > 0,
	});

	const statsQuery = useQuery({
		queryKey: ['reseller-page-data', 'payments', resellerId],
		queryFn: () => GetResellerPageData('payments'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
		enabled: resellerId > 0,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [
		pageSize,
		debouncedInput,
		fromDate,
		toDate,
		recordedByFilter,
		methodFilter,
	]);

	const setTimeRange = ({ from, to }: { from: string; to: string }) => {
		setFromDate(from);
		setToDate(to);
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

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return <ErrorCard message={error.message} />;
	}

	const filteredPayments = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.payments;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						My Payments
					</h1>
					<p className="text-muted-foreground">
						Track your payment history
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<CreditCard className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Payments
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_payments.toLocaleString() ?? '0'}
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
								Total Paid
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{stats?.total_received.toLocaleString(
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
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
							<Wallet className="h-6 w-6 text-green-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								M-PESA Total
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{stats?.mpesa_total.toLocaleString(undefined, {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								}) ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
							<CalendarIcon className="h-6 w-6 text-blue-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Cash Total
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{stats?.cash_total.toLocaleString(undefined, {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								}) ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex">
				<DateRangePicker
					className="ml-auto my-4"
					setTimeRange={setTimeRange}
				/>
			</div>

			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search payments..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row sm:gap-6 items-start sm:items-center">
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
								<SelectItem value="all">All Methods</SelectItem>
								<SelectItem value="MPESA">M-PESA</SelectItem>
								<SelectItem value="CASH">Cash</SelectItem>
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
								<SelectItem value="all">All Source</SelectItem>
								<SelectItem value="SYSTEM">System</SelectItem>
								<SelectItem value="ADMIN">Internal</SelectItem>
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
								<th className="text-right">Amount</th>
								<th>Method</th>
								<th>Reference</th>
								<th>Date</th>
								<th>Source</th>
								<th>Actions</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{filteredPayments.length > 0 ? (
								filteredPayments.map((payment) => (
									<tr key={payment.id}>
										<td>
											<span className="font-medium">
												{`PAY-${new Date(
													payment.created_at,
												).getFullYear()}-${String(
													payment.id,
												).padStart(3, '0')}`}
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
											{getMethodBadge(payment.method)}
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
										<td>{payment.recorded_by}</td>
										<td>
											<Button
												size="sm"
												variant="outline"
												className="h-7 text-xs "
												onClick={() =>
													toast({
														title: 'Download Receipt',
														description:
															'This feature is coming soon!',
													})
												}
											>
												Download Receipt
											</Button>
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
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="text-center py-8"
									>
										<p className="text-muted-foreground">
											No payment items found
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
