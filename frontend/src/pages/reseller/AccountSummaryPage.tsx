import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wallet, Package, ShoppingCart, CreditCard } from 'lucide-react';

const accountData = {
	stockReceived: 375,
	stockValue: 299500,
	totalSales: 285000,
	paymentsMade: 220000,
	balance: 65000,
};
const recentTransactions = [
	{
		id: '1',
		type: 'stock',
		description: 'Stock Received - Pampers Size 4',
		amount: 47500,
		date: '2024-02-10',
	},
	{
		id: '2',
		type: 'payment',
		description: 'Payment - M-PESA',
		amount: -45000,
		date: '2024-02-10',
	},
	{
		id: '3',
		type: 'sale',
		description: 'Sale - Various Products',
		amount: 28750,
		date: '2024-02-09',
	},
	{
		id: '4',
		type: 'stock',
		description: 'Stock Received - Huggies Size 3',
		amount: 26400,
		date: '2024-02-08',
	},
	{
		id: '5',
		type: 'payment',
		description: 'Payment - Cash',
		amount: -22000,
		date: '2024-02-06',
	},
];

export default function AccountSummaryPage() {
	if (1) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						Reseller Account
					</h1>
					<p className="text-gray-500">
						This feature is not yet implemented
					</p>
				</div>
			</div>
		);
	}
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Account Summary</h1>
				<p className="text-muted-foreground">
					View your account balance and transactions
				</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Package className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Stock Received
							</p>
							<p className="text-2xl font-bold">
								KES {accountData.stockValue.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
							<ShoppingCart className="h-6 w-6 text-emerald-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Total Sales
							</p>
							<p className="text-2xl font-bold">
								KES {accountData.totalSales.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
							<CreditCard className="h-6 w-6 text-blue-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Payments Made
							</p>
							<p className="text-2xl font-bold">
								KES {accountData.paymentsMade.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="border-amber-500/30 bg-amber-500/5">
					<CardContent className="flex items-center gap-4 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
							<Wallet className="h-6 w-6 text-amber-500" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Outstanding Balance
							</p>
							<p className="text-2xl font-bold text-amber-500">
								KES {accountData.balance.toLocaleString()}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">
						Recent Transactions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Type</TableHead>
									<TableHead className="text-right">
										Amount
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentTransactions.map((tx) => (
									<TableRow key={tx.id}>
										<TableCell>
											{new Date(
												tx.date,
											).toLocaleDateString()}
										</TableCell>
										<TableCell className="font-medium">
											{tx.description}
										</TableCell>
										<TableCell>
											<Badge
												className={
													tx.type === 'payment'
														? 'bg-blue-500/10 text-blue-500'
														: tx.type === 'stock'
														? 'bg-purple-500/10 text-purple-500'
														: 'bg-emerald-500/10 text-emerald-500'
												}
											>
												{tx.type
													.charAt(0)
													.toUpperCase() +
													tx.type.slice(1)}
											</Badge>
										</TableCell>
										<TableCell
											className={`text-right font-medium ${
												tx.amount < 0
													? 'text-blue-500'
													: ''
											}`}
										>
											{tx.amount < 0 ? '-' : '+'}KES{' '}
											{Math.abs(
												tx.amount,
											).toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
