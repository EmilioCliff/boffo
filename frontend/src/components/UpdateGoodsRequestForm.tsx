import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GoodRequestForm, GoodsRequest } from '@/lib/types';
import { GoodRequestSchema } from '@/lib/schemas';
import { useState } from 'react';
import GetFormHelpers from '@/services/getFormHelpers';
import UpdateGoodRequest from '@/services/reseller/updateGoodRequest';
import { useToast } from '@/hooks/use-toast';

interface Props {
	request: GoodsRequest;
	onSuccess: () => void;
}

export function UpdateGoodsRequestForm({ request, onSuccess }: Props) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const form = useForm<GoodRequestForm>({
		resolver: zodResolver(GoodRequestSchema),
		defaultValues: {
			data: request.payload.map((item) => ({
				product_id: item.product_id,
				product_name: item.product_name,
				quantity: item.quantity,
				price_requested: item.price_requested,
			})),
		},
	});

	const { fields, append, remove, update } = useFieldArray({
		control: form.control,
		name: 'data',
	});

	const { data: productsForm } = useQuery({
		queryKey: ['products', 'form'],
		queryFn: GetFormHelpers,
		staleTime: 5 * 1000,
	});

	/* Local add-row state */
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null,
	);
	const [quantity, setQuantity] = useState(0);
	const [priceRequested, setPriceRequested] = useState(0);

	const updateMutation = useMutation({
		mutationFn: (data: { id: number; form: GoodRequestForm }) =>
			UpdateGoodRequest(data.id, data.form),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['goods_requested'],
			});
			form.reset();
			toast({
				variant: 'success',
				title: 'Request Updated',
				description: `Goods request has been successfully updated.`,
			});
			onSuccess();
		},
		onError: (error: any) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message,
			});
		},
	});

	const onSubmit = (data: GoodRequestForm) => {
		updateMutation.mutate({ id: request.id || 0, form: data });
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			{/* Add product row */}
			<div className="grid gap-4">
				<div className="grid gap-2">
					<Label>Add Product</Label>
					<Select
						onValueChange={(val) =>
							setSelectedProductId(Number(val))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select product" />
						</SelectTrigger>
						<SelectContent>
							{productsForm?.data?.map((p) => (
								<SelectItem key={p.id} value={p.id.toString()}>
									{p.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label>Quantity</Label>
						<Input
							type="number"
							value={quantity}
							onChange={(e) =>
								setQuantity(Number(e.target.value))
							}
						/>
					</div>
					<div>
						<Label>Price Requested</Label>
						<Input
							type="number"
							min={0}
							value={priceRequested}
							onChange={(e) =>
								setPriceRequested(Number(e.target.value))
							}
						/>
					</div>
				</div>

				<Button
					type="button"
					// variant="secondary"
					disabled={!selectedProductId || quantity <= 0}
					onClick={() => {
						const product = productsForm?.data?.find(
							(p) => p.id === selectedProductId,
						);
						if (!product) return;

						append({
							product_id: product.id,
							product_name: product.name,
							quantity,
							price_requested: priceRequested,
						});

						setSelectedProductId(null);
						setQuantity(0);
						setPriceRequested(0);
					}}
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Product
				</Button>
			</div>

			{/* Editable list */}
			<div className="space-y-3">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className="flex items-center justify-between rounded-md border p-3"
					>
						<div>
							<p className="font-medium">{field.product_name}</p>
							<div className="flex gap-2 mt-2">
								<Input
									type="number"
									min={1}
									value={field.quantity}
									onChange={(e) =>
										update(index, {
											...field,
											quantity: Number(e.target.value),
										})
									}
								/>
								<Input
									type="number"
									min={0}
									value={field.price_requested}
									onChange={(e) =>
										update(index, {
											...field,
											price_requested: Number(
												e.target.value,
											),
										})
									}
								/>
							</div>
						</div>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => remove(index)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>

			{/* Submit */}
			<div className="flex justify-end gap-2 pt-4">
				<Button type="button" variant="outline" onClick={onSuccess}>
					Cancel
				</Button>
				<Button type="submit" disabled={fields.length === 0}>
					Update Request
				</Button>
			</div>
		</form>
	);
}
