import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Search,
	Warehouse,
	Package,
	AlertTriangle,
	TrendingUp,
} from 'lucide-react';

interface StockItem {
	id: string;
	productName: string;
	category: string;
	sku: string;
	totalStock: number;
	minStock: number;
	maxStock: number;
	unitPrice: number;
	status: 'in_stock' | 'low_stock' | 'out_of_stock';
	lastUpdated: string;
}

const mockStockItems: StockItem[] = [
	{
		id: '1',
		productName: 'Pampers Premium Size 4',
		category: 'Diapers',
		sku: 'PAM-P4-001',
		totalStock: 320,
		minStock: 100,
		maxStock: 500,
		unitPrice: 950,
		status: 'in_stock',
		lastUpdated: '2024-02-10',
	},
	{
		id: '2',
		productName: 'Huggies Ultra Comfort Size 3',
		category: 'Diapers',
		sku: 'HUG-UC3-001',
		totalStock: 45,
		minStock: 100,
		maxStock: 400,
		unitPrice: 880,
		status: 'low_stock',
		lastUpdated: '2024-02-09',
	},
	{
		id: '3',
		productName: 'Softcare Premium Tissue',
		category: 'Toilet Paper',
		sku: 'SFT-PT-001',
		totalStock: 0,
		minStock: 200,
		maxStock: 1000,
		unitPrice: 150,
		status: 'out_of_stock',
		lastUpdated: '2024-02-08',
	},
	{
		id: '4',
		productName: 'Molfix Comfort Size 5',
		category: 'Diapers',
		sku: 'MOL-C5-001',
		totalStock: 280,
		minStock: 50,
		maxStock: 300,
		unitPrice: 820,
		status: 'in_stock',
		lastUpdated: '2024-02-10',
	},
	{
		id: '5',
		productName: 'Nice & Soft Toilet Roll 10pk',
		category: 'Toilet Paper',
		sku: 'NAS-TR10-001',
		totalStock: 650,
		minStock: 150,
		maxStock: 800,
		unitPrice: 220,
		status: 'in_stock',
		lastUpdated: '2024-02-10',
	},
	{
		id: '6',
		productName: 'Pampers Baby Dry Size 2',
		category: 'Diapers',
		sku: 'PAM-BD2-001',
		totalStock: 85,
		minStock: 100,
		maxStock: 400,
		unitPrice: 780,
		status: 'low_stock',
		lastUpdated: '2024-02-09',
	},
];

export default function CompanyStockPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');

	const filteredStock = mockStockItems.filter((item) => {
		const matchesSearch =
			item.productName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.sku.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			categoryFilter === 'all' || item.category === categoryFilter;
		const matchesStatus =
			statusFilter === 'all' || item.status === statusFilter;
		return matchesSearch && matchesCategory && matchesStatus;
	});

	const getStatusBadge = (status: StockItem['status']) => {
		switch (status) {
			case 'in_stock':
				return (
					<Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
						In Stock
					</Badge>
				);
			case 'low_stock':
				return (
					<Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
						Low Stock
					</Badge>
				);
			case 'out_of_stock':
				return (
					<Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
						Out of Stock
					</Badge>
				);
		}
	};

	const totalItems = mockStockItems.reduce(
		(sum, item) => sum + item.totalStock,
		0,
	);
	const totalValue = mockStockItems.reduce(
		(sum, item) => sum + item.totalStock * item.unitPrice,
		0,
	);
	const lowStockCount = mockStockItems.filter(
		(item) => item.status === 'low_stock',
	).length;
	const outOfStockCount = mockStockItems.filter(
		(item) => item.status === 'out_of_stock',
	).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-foreground">
					Company Stock
				</h1>
				<p className="text-muted-foreground">
					Monitor stock levels across all products
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
								{totalItems.toLocaleString()}
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
								Total Value
							</p>
							<p className="text-2xl font-bold">
								KES{' '}
								{totalValue.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
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
								{lowStockCount}
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
								{outOfStockCount}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Stock Table */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Stock Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex flex-col gap-4 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search by product or SKU..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select
							value={categoryFilter}
							onValueChange={setCategoryFilter}
						>
							<SelectTrigger className="w-full sm:w-[150px]">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Categories
								</SelectItem>
								<SelectItem value="Diapers">Diapers</SelectItem>
								<SelectItem value="Toilet Paper">
									Toilet Paper
								</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}
						>
							<SelectTrigger className="w-full sm:w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="in_stock">
									In Stock
								</SelectItem>
								<SelectItem value="low_stock">
									Low Stock
								</SelectItem>
								<SelectItem value="out_of_stock">
									Out of Stock
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>SKU</TableHead>
									<TableHead>Category</TableHead>
									<TableHead className="text-right">
										Stock Level
									</TableHead>
									<TableHead className="w-[150px]">
										Capacity
									</TableHead>
									<TableHead className="text-right">
										Unit Price
									</TableHead>
									<TableHead className="text-right">
										Total Value
									</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredStock.map((item) => {
									const capacityPercent =
										(item.totalStock / item.maxStock) * 100;
									return (
										<TableRow key={item.id}>
											<TableCell className="font-medium">
												{item.productName}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{item.sku}
											</TableCell>
											<TableCell>
												{item.category}
											</TableCell>
											<TableCell className="text-right">
												{item.totalStock} /{' '}
												{item.maxStock}
											</TableCell>
											<TableCell>
												<Progress
													value={capacityPercent}
													className="h-2"
												/>
											</TableCell>
											<TableCell className="text-right">
												KES {item.unitPrice}
											</TableCell>
											<TableCell className="text-right font-medium">
												KES{' '}
												{(
													item.totalStock *
													item.unitPrice
												).toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})}
											</TableCell>
											<TableCell>
												{getStatusBadge(item.status)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
