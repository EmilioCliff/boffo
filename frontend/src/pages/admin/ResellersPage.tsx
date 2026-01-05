import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Search,
	Users,
	Package,
	CreditCard,
	TrendingUp,
	Eye,
	Plus,
} from 'lucide-react';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import GetResellers from '@/services/admin/getResellers';
import type { UserForm } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserFormSchema } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import AddUser from '@/services/admin/addUser';
import { useToast } from '@/hooks/use-toast';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import PaginationNew from '@/components/PaginationNew';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import GetAdminPageData from '@/services/admin/getPageDataHelper';

export default function ResellersPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { toast } = useToast();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ['resellers', pageIndex, pageSize, debouncedInput],
		queryFn: () =>
			GetResellers({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const statsQuery = useQuery({
		queryKey: ['admin-page-data', 'resellers'],
		queryFn: () => GetAdminPageData('resellers'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, debouncedInput]);

	const form = useForm<UserForm>({
		resolver: zodResolver(UserFormSchema),
		defaultValues: {
			name: '',
			email: '',
			phone_number: '',
			role: 'RESELLER',
		},
	});

	const createMutation = useMutation({
		mutationFn: AddUser,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['resellers'],
			});
			refetch();
			form.reset({});
			toast({
				variant: 'success',
				title: 'User Added',
				description: 'The user has been added successfully.',
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

	const onSubmit = (data: UserForm) => {
		createMutation.mutate({ ...data, role: 'staff' });
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

	const filteredResellers = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.resellers;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Resellers
					</h1>
					<p className="text-muted-foreground">
						Manage reseller accounts and view their activity
					</p>
				</div>
				<Dialog
					open={isDialogOpen}
					onOpenChange={() => {
						form.reset();
						setIsDialogOpen(!isDialogOpen);
					}}
				>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Add Reseller
						</Button>
					</DialogTrigger>
					<DialogContent
						aria-describedby={undefined}
						className="sm:max-w-[500px]"
					>
						<DialogHeader>
							<DialogTitle>Add Reseller</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
								className="space-y-8"
							>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<FormField
												control={form.control}
												name="name"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															User Name
														</FormLabel>
														<FormControl>
															<Input
																placeholder="John Doe"
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
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															Email
														</FormLabel>
														<FormControl>
															<Input
																placeholder="john.doe@example.com"
																className="placeholder:text-sm placeholder:text-gray-500"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										{/* <div className="grid grid-cols-2 gap-4"> */}
										<div className="grid gap-2">
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
												name="role"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-gray-700 font-semibold">
															Role
														</FormLabel>
														<FormControl>
															<Input
																placeholder="John Doe"
																className="placeholder:text-sm placeholder:text-gray-500"
																{...field}
																readOnly
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										{/* </div> */}
									</div>
									<Button className="mt-2" type="submit">
										Create Reseller
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
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Resellers
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_resellers.toLocaleString() ?? '0'}
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
								Active Resellers
							</p>
							<p className="text-2xl font-bold">
								{stats?.active_resellers.toLocaleString() ??
									'0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
							<Package className="h-6 w-6 text-blue-500" />
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
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
							<CreditCard className="h-6 w-6 text-amber-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Outstanding
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{stats?.outstanding_payments.toLocaleString(
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
			</div>

			{/* Resellers Table */}
			<div className="rounded-lg border border-border bg-card">
				<div className="w-full overflow-x-auto">
					<table className="data-table min-w-[900px]">
						<thead>
							<tr>
								<th>Reseller</th>
								<th>Phone</th>
								<th className="text-right">Current Stock</th>
								<th className="text-right">Total Sales</th>
								<th className="text-right">Payments</th>
								<th className="text-right">Balance</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredResellers.length > 0 ? (
								filteredResellers.map((reseller) => (
									<tr key={reseller.user.id}>
										<td>
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarFallback className="bg-primary/10 text-primary text-xs">
														{reseller.user.name
															.split(' ')
															.map((n) => n[0])
															.join('')}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">
														{reseller.user.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{reseller.user.email}
													</p>
												</div>
											</div>
										</td>
										<td>{reseller.user.phone_number}</td>
										<td className="text-right">
											{
												reseller.account
													.total_stock_received
											}
										</td>
										<td className="text-right">
											KES{' '}
											{reseller.account.total_sales_value.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</td>
										<td className="text-right font-semibold">
											KES{' '}
											{reseller.account.total_paid.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</td>
										<td className="text-right">
											<span
												className={
													reseller.account.balance > 0
														? 'text-amber-500 font-medium'
														: 'text-emerald-500'
												}
											>
												KES{' '}
												{reseller.account.balance.toLocaleString(
													undefined,
													{
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													},
												)}
											</span>
										</td>
										<td>
											{reseller.user.id ? (
												<Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
													Active
												</Badge>
											) : (
												<Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
													Inactive
												</Badge>
											)}
										</td>
										<td>
											<Button
												size="sm"
												variant="ghost"
												className="h-8 gap-1"
												onClick={() =>
													// console.log(reseller.user.id)
													navigate(
														`/admin/resellers/${reseller.user.id}`,
													)
												}
											>
												<Eye className="h-4 w-4" />
												View
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
											No reseller items found
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
