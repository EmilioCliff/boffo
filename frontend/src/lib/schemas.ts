import { z } from 'zod';

export const ProductFormSchema = z.object({
	id: z.number().int().nonnegative().optional(),
	name: z.string().min(1),
	description: z.string().optional(),
	price: z.number().nonnegative(),
	category: z.string().min(1),
	unit: z.string().min(1),
	low_stock_threshold: z.number().int().nonnegative(),
});

export const ProductBatchFormSchema = z.object({
	product_id: z.number().int().nonnegative(),
	batch_number: z.string().min(1),
	quantity: z.number().int().nonnegative(),
	purchase_price: z.number().nonnegative(),
	date_received: z.string(), // ISO date string
});

export const StockDistributionFormSchema = z.object({
	reseller_id: z.number().int().nonnegative(),
	product_id: z.number().int().nonnegative(),
	quantity: z.number().int().nonnegative(),
	unit_price: z.number().nonnegative(),
	date_distributed: z.string(), // ISO date string
});

export const PaymentFormSchema = z.object({
	reseller_id: z.number().int().nonnegative(),
	amount: z.number().nonnegative(),
	method: z.string(),
	reference: z.string().optional(),
	date_paid: z.string(), // ISO date string
});

export const UserFormSchema = z.object({
	id: z.number().int().nonnegative().optional(),
	name: z.string().min(1),
	email: z.string(),
	phone_number: z.string().min(10),
	role: z.string(),
});

export const SaleFormSchema = z.object({
	product_id: z.number().int().nonnegative(),
	quantity: z.number().int().nonnegative(),
	selling_price: z.number().nonnegative(),
	date_sold: z.string(), // ISO date string
});

export const GoodRequestSchema = z.object({
	data: z.array(
		z.object({
			product_id: z.number().int().nonnegative(),
			product_name: z.string().min(1),
			quantity: z.number().int().nonnegative(),
			price_requested: z.number().nonnegative(),
		}),
	),
});

// export const ProductSchema = z.object({
// 	id: z.number().int().nonnegative(),
// 	name: z.string().min(1),
// 	description: z.string().optional(),
// 	price: z.number().nonnegative(),
// 	stock: z.number().int().nonnegative(),
// 	category: z.string().min(1),
// 	unit: z.string().min(1),
// 	low_stock_threshold: z.number().int().nonnegative(),
// 	deleted: z.boolean(),
// 	created_at: z.string(), // ISO date string
// });

export const StockUpdateFormSchema = z.object({
	quantity: z.number().int().nonnegative(),
	note: z.string().optional(),
	batch_number: z.string().optional(),
});

export const MovementSchema = z.object({
	id: z.number().int().nonnegative(),
	product_id: z.number().int().nonnegative(),
	quantity: z.number().int().nonnegative(),
	price: z.number().nonnegative(),
	type: z.string().min(1),
	note: z.string().nullable().optional(),
	batch_number: z.string().nullable().optional(),
	performed_by: z.number().int().nonnegative(),
	created_at: z.string(), // ISO date string
	product_name: z.string().min(1),
	user_name: z.string().min(1),
});

export const StatsSchema = z.object({
	total_users: z.number().int().nonnegative(),
	total_products: z.number().int().nonnegative(),
	total_low_stock: z.number().int().nonnegative(),
	total_out_of_stock: z.number().int().nonnegative(),
	total_stocks_added: z.number().int().nonnegative(),
	total_stocks_added_value: z.number().nonnegative(),
	total_stocks_removed: z.number().int().nonnegative(),
	total_stocks_removed_value: z.number().nonnegative(),
	total_value: z.number().nonnegative(),
});

// export const UserSchema = z.object({
// 	id: z.number().int().nonnegative(),
// 	name: z.string().min(1),
// 	email: z.string().email(),
// 	phone_number: z.string().min(1),
// 	role: z.string().min(1),
// 	deleted: z.boolean(),
// 	created_at: z.string(), // ISO date string
// });

// export const UserFormSchema = z.object({
// 	name: z.string().min(1),
// 	email: z.string().email(),
// 	phone_number: z.string().min(10),
// 	role: z.string().min(1, { message: 'Role required' }),
// });

export const LoginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(2),
});
