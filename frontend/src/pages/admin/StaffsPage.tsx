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
import { Search, Plus, User, Shield, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import GetUsers from '@/services/admin/getUsers';
import AddUser from '@/services/admin/addUser';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import PaginationNew from '@/components/PaginationNew';
import { useForm } from 'react-hook-form';
import type { UserForm } from '@/lib/types';
import { UserFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import DeleteUser from '@/services/admin/deleteUser';
import DeleteConfirm from '@/components/DeleteConfirm';

export default function StaffsPage() {
	const { decoded } = useAuth();
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchQuery, setSearchQuery] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [deleteConfirm, setDeleteConfirm] = useState(false);
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });
	const [deleteStaff, setDeleteStaff] = useState(0);

	// Check if user is the main admin
	const isMainAdmin =
		decoded?.email === 'emiliocliff@gmail.com' ||
		decoded?.email === 'abrahamlorot@yahoo.com';

	const { isLoading, error, data } = useQuery({
		queryKey: ['staffs', pageIndex, pageSize, debouncedInput],
		queryFn: () =>
			GetUsers({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				Role: 'admin',
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
		enabled: isMainAdmin,
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
			role: 'admin',
		},
	});

	const createMutation = useMutation({
		mutationFn: AddUser,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['staffs'],
			});
			form.reset({
				name: '',
				email: '',
				phone_number: '',
				role: 'admin',
			});
			toast({
				variant: 'success',
				title: 'Staff Created',
				description: 'The staff user has been created successfully.',
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
		createMutation.mutate(data);
	};

	const onError = (error: any) => {
		console.log(error);
	};

	const deleteMutation = useMutation({
		mutationFn: DeleteUser,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['staffs'],
			});
			toast({
				variant: 'success',
				title: 'Staff Deleted',
				description: 'The staff user has been deleted successfully.',
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
		deleteMutation.mutate(id);
	};

	// Show unauthorized message if not main admin
	if (!isMainAdmin) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Card className="max-w-md">
					<CardContent className="flex flex-col items-center gap-4 p-8">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
							<Shield className="h-8 w-8 text-destructive" />
						</div>
						<div className="text-center">
							<h2 className="text-2xl font-bold mb-2">
								Not Authorized
							</h2>
							<p className="text-muted-foreground">
								You do not have permission to access this page.
								Only the main administrator can manage staff
								members.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return <ErrorCard message={error.message} />;
	}

	const staffs = data?.data || [];
	const pagination = data?.pagination;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Staff Management
					</h1>
					<p className="text-muted-foreground">
						Manage administrator accounts
					</p>
				</div>
				<Dialog
					open={isDialogOpen}
					onOpenChange={() => {
						form.reset({
							name: '',
							email: '',
							phone_number: '',
							role: 'admin',
						});
						setIsDialogOpen(!isDialogOpen);
					}}
				>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Add Staff
						</Button>
					</DialogTrigger>
					<DialogContent
						aria-describedby={undefined}
						className="sm:max-w-[500px]"
					>
						<DialogHeader>
							<DialogTitle>Add New Admin</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
								className="space-y-4"
							>
								<div className="grid gap-4 py-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Full Name</FormLabel>
												<FormControl>
													<Input
														placeholder="John Doe"
														{...field}
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
												<FormLabel>
													Email Address
												</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="john@example.com"
														{...field}
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
												<FormLabel>
													Phone Number
												</FormLabel>
												<FormControl>
													<Input
														placeholder="+254712345678"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
										<p className="text-sm text-blue-900">
											<strong>Note:</strong> The user will
											be created with the role of Admin. A
											default password "zi2r*9E_" is
											generate.
										</p>
									</div>

									<Button
										className="mt-2"
										type="submit"
										disabled={createMutation.isPending}
									>
										{createMutation.isPending
											? 'Creating...'
											: 'Create Admin'}
									</Button>
								</div>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats Card */}
			<div className="grid gap-4 sm:grid-cols-1">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<User className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Staff
							</p>
							<p className="text-2xl font-bold">
								{pagination?.total || 0}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Search */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search staff..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			{/* Staff Table */}
			<div className="rounded-lg border border-border bg-card">
				<div className="w-full overflow-x-auto">
					<table className="data-table min-w-[900px]">
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Role</th>
								<th>Joined</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{staffs.length > 0 ? (
								staffs.map((staff) => (
									<tr key={staff.id}>
										<td>
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
													<User className="h-5 w-5 text-primary" />
												</div>
												<span className="font-medium">
													{staff.name}
												</span>
											</div>
										</td>
										<td>
											<div className="flex items-center gap-2">
												<Mail className="h-4 w-4 text-muted-foreground" />
												{staff.email}
											</div>
										</td>
										<td>
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4 text-muted-foreground" />
												{staff.phone_number}
											</div>
										</td>
										<td>
											<Badge className="bg-primary/10 text-primary hover:bg-primary/20">
												{staff.role}
											</Badge>
										</td>
										<td>
											{format(
												staff.created_at,
												'dd MMM yyyy',
											)}
										</td>
										<td>
											<Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
												Active
											</Badge>
										</td>
										<td>
											<Button
												size="sm"
												variant="outline"
												disabled={
													deleteMutation.isPending
												}
												className="h-7 text-xs 
													text-destructive 
													hover:text-destructive 
													hover:bg-destructive/10
													hover:border-destructive
												"
												onClick={() => {
													setDeleteStaff(staff.id);
													setDeleteConfirm(true);
												}}
											>
												Delete
											</Button>
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
											No staff members found
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

			{/* Delete Product Confirmation  */}
			<DeleteConfirm
				resourceName="staff"
				action="Delete Staff"
				open={deleteConfirm}
				setOpen={setDeleteConfirm}
				onConfirm={() => onDelete(deleteStaff)}
				onCancel={() => setDeleteStaff(0)}
			/>
		</div>
	);
}
