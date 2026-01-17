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
	CreditCard,
	Wallet,
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
import GetPayments from '@/services/admin/getPayments';
import { format } from 'date-fns';
import { DateRangePicker } from '@/components/DateRangePicker';
import GetResellersFormData from '@/services/admin/getResellersFormData';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import PaginationNew from '@/components/PaginationNew';
import { useForm } from 'react-hook-form';
import type { PaymentForm } from '@/lib/types';
import { PaymentFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import AddPayment from '@/services/admin/addPayment';
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
import GetAdminPageData from '@/services/admin/getPageDataHelper';

export default function PaymentsPage() {
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [recordedByFilter, setRecordedByFilter] = useState('all');
	const [methodFilter, setMethodFilter] = useState<string>('all');
	const [filterResellerId, setFilterResellerId] = useState(0);
	const [selectedResellerId, setSelectedResellerId] = useState(0);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('MPESA');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: [
			'payments',
			pageIndex,
			pageSize,
			fromDate,
			toDate,
			debouncedInput,
			recordedByFilter,
			methodFilter,
			filterResellerId,
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
		queryKey: ['admin-page-data', 'payments'],
		queryFn: () => GetAdminPageData('payments'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
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
		filterResellerId,
	]);

	const form = useForm<PaymentForm>({
		resolver: zodResolver(PaymentFormSchema),
		defaultValues: {
			reseller_id: 0,
			amount: 0,
			method: 'MPESA',
			reference: '',
			date_paid: format(new Date(), 'yyyy-MM-dd'),
		},
	});

	const createMutation = useMutation({
		mutationFn: AddPayment,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['payments'],
			});
			refetch();
			form.reset();
			toast({
				variant: 'success',
				title: 'Payment Recorded',
				description: 'The payment has been recorded successfully.',
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

	const onSubmit = (data: PaymentForm) => {
		if (selectedResellerId === 0 || selectedPaymentMethod === '') {
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					'Please select a reseller and payment method for the payment.',
			});
			return;
		}
		createMutation.mutate({
			...data,
			reseller_id: selectedResellerId,
			method: selectedPaymentMethod,
		});
	};

	const onError = (error: any) => {
		console.log(error);
	};

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
						Payments
					</h1>
					<p className="text-muted-foreground">
						Record and track reseller payments
					</p>
				</div>
				<Dialog
					open={isDialogOpen}
					onOpenChange={() => {
						form.reset();
						setSelectedPaymentMethod('MPESA');
						setSelectedResellerId(0);
						setIsDialogOpen(!isDialogOpen);
					}}
				>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Record Payment
						</Button>
					</DialogTrigger>
					<DialogContent
						aria-describedby={undefined}
						className="sm:max-w-[500px]"
					>
						<DialogHeader>
							<DialogTitle>Record New Payment</DialogTitle>
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
													: '0'
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
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<FormField
												control={form.control}
												name="amount"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															Amount
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
											<Label htmlFor="method">
												Payment Method
											</Label>
											<Select
												value={selectedPaymentMethod}
												onValueChange={(
													val: string,
												) => {
													setSelectedPaymentMethod(
														val,
													);
												}}
												required
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select method" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="MPESA">
														M-PESA
													</SelectItem>
													<SelectItem value="CASH">
														Cash
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="grid gap-2">
										<FormField
											control={form.control}
											name="reference"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-semibold">
														Reference Number
													</FormLabel>
													<FormControl>
														<Input
															placeholder="QKJ3HSMD92"
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
										<FormField
											control={form.control}
											name="date_paid"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-gray-700 font-semibold">
														Date Paid
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
										className="mt-2"
										type="submit"
									>
										{createMutation.isPending
											? 'Recording...'
											: 'Record Payment'}
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
								Total Received
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
						placeholder="Search products..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row sm:gap-6 items-start sm:items-center">
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

			{/* Distribution Table */}
			<div className="rounded-lg border border-border bg-card">
				<div className="w-full overflow-x-auto">
					<table className="data-table min-w-[900px]">
						<thead>
							<tr>
								<th>Payment ID</th>
								<th>Reseller</th>
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
										<td>
											<span>{payment.user?.name}</span>
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
										colSpan={9}
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
