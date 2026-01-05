import { useEffect, useState } from 'react';
import {
	Plus,
	Search,
	MoreHorizontal,
	Package,
	Edit,
	Trash2,
	Eye,
	Warehouse,
	AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import PaginationNew from '@/components/PaginationNew';
import { useDebounce } from '@/hooks/useDebounce';
import GetCompanyProducts from '@/services/admin/getCompanyProducts';
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import Spinner from '@/components/Spinner';
import ErrorCard from '@/components/ErrorCard';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import type { CompanyStock, ProductForm } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormSchema } from '@/lib/schemas';
import { Textarea } from '@/components/ui/textarea';
import AddProduct from '@/services/admin/addProduct';
import UpdateProduct from '@/services/admin/updateProduct';
import DeleteProduct from '@/services/admin/deleteProduct';
import DeleteConfirm from '@/components/DeleteConfirm';
import GetAdminPageData from '@/services/admin/getPageDataHelper';

export default function ProductsPage() {
	const [status, setStatus] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const debouncedInput = useDebounce({ value: searchQuery, delay: 500 });
	const [editingProduct, setEditingProduct] = useState<CompanyStock | null>(
		null,
	);

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ['products', pageIndex, pageSize, debouncedInput, status],
		queryFn: () =>
			GetCompanyProducts({
				pageNumber: pageIndex,
				pageSize: pageSize,
				Search: debouncedInput,
				Status: status,
			}),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	const statsQuery = useQuery({
		queryKey: ['admin-page-data', 'products'],
		queryFn: () => GetAdminPageData('products'),
		staleTime: 5 * 1000,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		setPageIndex(1);
	}, [pageSize, debouncedInput, status, debouncedInput]);

	const form = useForm<ProductForm>({
		resolver: zodResolver(ProductFormSchema),
		defaultValues: {
			id: editingProduct?.product_id,
			name: editingProduct?.product?.name || '',
			category: editingProduct?.product_category || '',
			unit: editingProduct?.product?.unit || '',
			low_stock_threshold:
				editingProduct?.product?.low_stock_threshold || 0,
			price: editingProduct?.product?.price || 0,
			description: editingProduct?.product?.description || '',
		},
	});

	useEffect(() => {
		if (editingProduct && isViewDialogOpen) {
			form.reset({
				id: editingProduct.product_id,
				name: editingProduct.product?.name || '',
				category: editingProduct.product_category || '',
				unit: editingProduct.product?.unit || '',
				low_stock_threshold:
					editingProduct.product?.low_stock_threshold || 0,
				price: editingProduct.product?.price || 0,
				description: editingProduct.product?.description || '',
			});
		}
	}, [editingProduct, isViewDialogOpen, form]);

	const createMutation = useMutation({
		mutationFn: AddProduct,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['products'],
			});
			refetch();
			form.reset({});
			toast({
				variant: 'success',
				title: 'Product created',
				description: 'The product has been successfully created.',
			});
			setIsViewDialogOpen(false);
		},
		onError: (error: any) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message,
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: UpdateProduct,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['products'],
			});
			form.reset({});
			toast({
				variant: 'success',
				title: 'Product updated',
				description: 'The product has been successfully updated.',
			});
			setIsViewDialogOpen(false);
		},
		onError: (error: any) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message,
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: DeleteProduct,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['products'],
			});
			// refetch();
			setEditingProduct(null);
			toast({
				variant: 'success',
				title: 'Product deleted',
				description: 'The product has been successfully deleted.',
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

	const onSubmit = (data: ProductForm) => {
		if (editingProduct) {
			updateMutation.mutate({ ...data, id: editingProduct.product_id });
		} else {
			createMutation.mutate(data);
		}
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

	const filteredProducts = data?.data || [];
	const pagination = data?.pagination;
	const stats = statsQuery.data?.data.products;

	return (
		<div>
			{/* Page Header */}
			<div className="page-header">
				<div>
					<h1 className="page-title">Products</h1>
					<p className="page-description">
						Manage your product catalog and inventory thresholds.
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Product
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Add New Product</DialogTitle>
							<DialogDescription>
								Create a new product in your catalog.
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
								className="space-y-8"
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<Label className="text-gray-700 font-semibold">
													Name
												</Label>
												<FormControl>
													<Input
														placeholder="Product Name"
														className="placeholder:text-sm placeholder:text-gray-500"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<Label className="text-gray-700 font-semibold">
													Category
												</Label>
												<FormControl>
													<Input
														placeholder="Category Name"
														className="placeholder:text-sm placeholder:text-gray-500"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="unit"
										render={({ field }) => (
											<FormItem>
												<Label className="text-gray-700 font-semibold">
													Unit
												</Label>
												<FormControl>
													<Input
														placeholder="tube"
														className="placeholder:text-sm placeholder:text-gray-500"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="price"
										render={({ field }) => (
											<FormItem>
												<Label className="text-gray-700 font-semibold">
													Price per Unit
												</Label>
												<FormControl>
													<Input
														placeholder="50"
														type="number"
														className="placeholder:text-sm placeholder:text-gray-500"
														{...field}
														onChange={(e) =>
															field.onChange(
																Number(
																	e.target
																		.value,
																),
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="low_stock_threshold"
										render={({ field }) => (
											<FormItem>
												<Label className="text-gray-700 font-semibold">
													Minimum Stock
												</Label>
												<FormControl>
													<Input
														placeholder="50"
														type="number"
														className="placeholder:text-sm placeholder:text-gray-500"
														{...field}
														onChange={(e) =>
															field.onChange(
																Number(
																	e.target
																		.value,
																),
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem className="md:col-span-2">
												<Label className="text-gray-700 font-semibold">
													Description
												</Label>
												<FormControl>
													<Textarea
														placeholder="Product description..."
														className="placeholder:text-sm placeholder:text-gray-500"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex justify-end gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setEditingProduct(null);
											form.reset({});
											setIsDialogOpen(false);
										}}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										// onClick={form.handleSubmit()}
										disabled={
											createMutation.isPending ||
											updateMutation.isPending
										}
									>
										{editingProduct
											? updateMutation.isPending
												? 'Updating...'
												: 'Update'
											: createMutation.isPending
											? 'Adding...'
											: 'Add'}{' '}
										Product
									</Button>
								</div>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Warehouse className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Units
							</p>
							<p className="text-2xl font-bold">
								{stats?.total_units.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
							<AlertTriangle className="h-6 w-6 text-amber-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Low Stock Items
							</p>
							<p className="text-2xl font-bold">
								{stats?.low_stock_items.toLocaleString() ?? '0'}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
							<Package className="h-6 w-6 text-destructive" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Out of Stock
							</p>
							<p className="text-2xl font-bold">
								{stats?.low_stock_items.toLocaleString() ?? '0'}
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
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="true">In Stock</SelectItem>
							<SelectItem value="false">Out of Stock</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Products Table */}
			<div className="rounded-lg border border-border bg-card overflow-hidden">
				<table className="data-table">
					<thead>
						<tr>
							<th>Product</th>
							<th>Category</th>
							<th>Unit</th>
							<th>Current Stock</th>
							<th>Threshold</th>
							<th>Status</th>
							<th className="w-12"></th>
						</tr>
					</thead>
					<tbody>
						{filteredProducts.length > 0 ? (
							filteredProducts.map((product) => (
								<tr key={product.product_id}>
									<td>
										<span className="font-medium">
											{product.product?.name}
										</span>
									</td>
									<td className="text-muted-foreground">
										{product.product_category}
									</td>
									<td className="text-muted-foreground">
										{product.product?.unit}
									</td>
									<td>
										<span className="font-semibold">
											{product.quantity.toLocaleString()}
										</span>
									</td>
									<td className="text-muted-foreground">
										{product.product?.low_stock_threshold}
									</td>
									<td>
										{getStatusBadge(
											product.quantity,
											product.product
												?.low_stock_threshold ?? 10,
										)}
									</td>
									<td>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => {
														setEditingProduct(
															product,
														);
														setIsEditMode(false);
														setIsViewDialogOpen(
															true,
														);
													}}
												>
													<Eye className="mr-2 h-4 w-4" />
													View Details
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setEditingProduct(
															product,
														);
														setIsEditMode(true);
														setIsViewDialogOpen(
															true,
														);
													}}
												>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setEditingProduct(
															product,
														);
														setDeleteConfirm(true);
													}}
													className=" text-destructive focus:text-destructive hover:text-destructive focus:bg-destructive/10 hover:bg-destructive/10 "
												>
													<Trash2 className="mr-2 h-4 w-4 text-current" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={7} className="text-center py-8">
									<p className="text-muted-foreground">
										No product items found
									</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* View/Edit Product Dialog */}
			<Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<div className="flex items-center justify-between">
							<div>
								<DialogTitle>
									{isEditMode
										? 'Edit Product'
										: 'Product Details'}
								</DialogTitle>
								<DialogDescription>
									{isEditMode
										? 'Update product information.'
										: 'View product information.'}
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, onError)}
							className="space-y-8"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<Label className="text-gray-700 font-semibold">
												Name
											</Label>
											<FormControl>
												<Input
													placeholder="Product Name"
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													readOnly={!isEditMode}
													disabled={!isEditMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<Label className="text-gray-700 font-semibold">
												Category
											</Label>
											<FormControl>
												<Input
													placeholder="Category Name"
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													readOnly={!isEditMode}
													disabled={!isEditMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="unit"
									render={({ field }) => (
										<FormItem>
											<Label className="text-gray-700 font-semibold">
												Unit
											</Label>
											<FormControl>
												<Input
													placeholder="tube"
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													readOnly={!isEditMode}
													disabled={!isEditMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<Label className="text-gray-700 font-semibold">
												Price per Unit
											</Label>
											<FormControl>
												<Input
													placeholder="50"
													type="number"
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													onChange={(e) =>
														field.onChange(
															Number(
																e.target.value,
															),
														)
													}
													readOnly={!isEditMode}
													disabled={!isEditMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="low_stock_threshold"
									render={({ field }) => (
										<FormItem>
											<Label className="text-gray-700 font-semibold">
												Minimum Stock
											</Label>
											<FormControl>
												<Input
													placeholder="50"
													type="number"
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													onChange={(e) =>
														field.onChange(
															Number(
																e.target.value,
															),
														)
													}
													readOnly={!isEditMode}
													disabled={!isEditMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<Label className="text-gray-700 font-semibold">
												Description
											</Label>
											<FormControl>
												<Textarea
													placeholder="Product description..."
													className="placeholder:text-sm placeholder:text-gray-500"
													{...field}
													readOnly={!isEditMode}
													disabled={!isEditMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<Button
										type="button"
										id="edit-mode"
										variant="outline"
										size="sm"
										onClick={() =>
											setIsEditMode(!isEditMode)
										}
									>
										{isEditMode ? 'View' : 'Edit'}
									</Button>
								</div>
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setEditingProduct(null);
											setIsEditMode(false);
											form.reset({});
											setIsViewDialogOpen(false);
										}}
									>
										{isEditMode ? 'Cancel' : 'Close'}
									</Button>
									{isEditMode && (
										<Button
											type="submit"
											disabled={updateMutation.isPending}
										>
											{updateMutation.isPending
												? 'Updating...'
												: 'Update Product'}
										</Button>
									)}
								</div>
							</div>
						</form>
					</Form>
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
			<DeleteConfirm
				resourceName="product"
				action="Delete Product"
				open={deleteConfirm}
				setOpen={setDeleteConfirm}
				onConfirm={() => onDelete(editingProduct?.product_id || 0)}
				onCancel={() => setEditingProduct(null)}
			/>
		</div>
	);
}
