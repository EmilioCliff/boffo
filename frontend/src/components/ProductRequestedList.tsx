import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { GoodRequestPayload } from '@/lib/types';

interface RequestedProductsListProps {
	products: GoodRequestPayload[];
}

export function RequestedProductsList({
	products,
}: RequestedProductsListProps) {
	const total = products.reduce(
		(sum, p) => sum + p.quantity * p.price_requested,
		0,
	);

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold">Requested Products</h4>
				<span className="text-xs text-muted-foreground">
					{products.length} items
				</span>
			</div>

			{/* Scroll only this section */}
			<ScrollArea className="h-[220px] rounded-md border">
				<div className="divide-y">
					{products.map((product) => (
						<div
							key={product.product_id}
							className="px-4 py-3 space-y-1 hover:bg-muted/40 transition"
						>
							<p className="font-medium leading-tight">
								{product.product_name}
							</p>

							<div className="flex justify-between text-xs text-muted-foreground">
								<span>
									Qty:{' '}
									<span className="font-medium text-foreground">
										{product.quantity}
									</span>
								</span>
								<span>
									KES {product.price_requested.toFixed(2)} /
									unit
								</span>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>

			<Separator />

			<div className="flex justify-between text-sm font-medium">
				<span>Total Request Value</span>
				<span>
					KES{' '}
					{total.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</span>
			</div>
		</div>
	);
}
