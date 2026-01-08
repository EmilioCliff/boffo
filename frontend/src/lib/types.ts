import type z from 'zod';
import type {
	LoginFormSchema,
	MovementSchema,
	ProductBatchFormSchema,
	StockDistributionFormSchema,
	ProductFormSchema,
	StatsSchema,
	StockUpdateFormSchema,
	UserFormSchema,
	PaymentFormSchema,
	SaleFormSchema,
	GoodRequestSchema,
	ChangePasswordFormSchema,
} from './schemas';

export const ADMIN_ROLE = 'admin';
export const STOCK_IN = 'ADD';
export const STOCK_OUT = 'REMOVE';

// Common response type
export interface CommonResponse {
	statusCode?: string;
	message?: string;
	pagination?: Pagination;
	data: any;
}

export interface CommonFormHelpers {
	id: number;
	name: string;
}

// Pagination info
export interface Pagination {
	page: number;
	page_size: number;
	total: number;
	total_pages: number;
	has_next: boolean;
	has_previous: boolean;
	next_page: number;
	previous_page: number;
}

// Common props for listing
export interface ListCommonProps {
	pageNumber: number;
	pageSize: number;
	Role?: string;
	Search?: string;
	Source?: string;
	InStock?: boolean;
	Status?: string;
	ProductID?: number;
	ResellerID?: number;
	Type?: string;
	Method?: string;
	OwnerType?: string;
	BatchNumber?: string;
	FromDate?: string;
	ToDate?: string;
}

// Decoded token type
export interface JWTDecoded {
	id: number;
	user_id: number;
	email: string;
	name: string;
	phone_number: string;
	role: string;
	exp: number;
	iat: number;
}

// user data type
export interface User {
	id: number;
	name: string;
	email: string;
	phone_number: string;
	role: string;
	deleted: boolean;
	created_at: string;
}

export interface UserShort {
	id: number;
	name: string;
	phone_number: string;
	email?: string;
}

export type UserForm = z.infer<typeof UserFormSchema>;
export type ChangePasswordForm = z.infer<typeof ChangePasswordFormSchema>;

export interface UserResponse extends Omit<CommonResponse, 'data'> {
	data: User[];
}

export interface UserDetailsResponse extends Omit<CommonResponse, 'data'> {
	data: User;
}

// product data type
export interface Product {
	id: number;
	name: string;
	description?: string;
	price: number;
	category: string;
	unit: string;
	low_stock_threshold: number;
	deleted: boolean;
	created_at: string;
}

export interface ProductShort {
	id: number;
	name: string;
	price: number;
	unit: string;
	low_stock_threshold: number;
	description?: string;
}

export type ProductForm = z.infer<typeof ProductFormSchema>;

export interface ProductResponse extends Omit<CommonResponse, 'data'> {
	data: Product;
}

// Admin stats data type
// export interface AdminStats {
// 	TotalCompanyStock: number;
// 	TotalStockDistributed: number;
// 	TotalValueDistributed: number;
// 	TotalPaymentsReceived: number;
// 	TotalOutstandingPayments: number;
// 	TotalActiveResellers: number;
// 	TotalPendingRequests: number;
// 	TotalLowStockProducts: number;
// }

// export interface AdminStatsResponse extends Omit<CommonResponse, 'data'> {
// 	data: AdminStats;
// }

// Company Stock data type
export interface CompanyStock {
	product_id: number;
	quantity: number;
	product?: ProductShort;
	product_category?: string;
}

export interface CompanyStockResponse extends Omit<CommonResponse, 'data'> {
	data: CompanyStock[];
}

// Product Batch data type
export interface ProductBatch {
	id: number;
	product_id: number;
	batch_number: string;
	quantity: number;
	purchase_price: number;
	date_received: string;
	created_at: string;
	remaining_quantity?: number;
	product_category?: string;
	product?: ProductShort;
}

export type ProductBatchForm = z.infer<typeof ProductBatchFormSchema>;

export interface ProductBatchResponse extends Omit<CommonResponse, 'data'> {
	data: ProductBatch[];
}
export interface ProductBatchDetailResponse
	extends Omit<CommonResponse, 'data'> {
	data: ProductBatch;
}

// Stock Distribution data type
export interface StockDistribution {
	id: number;
	reseller_id: number;
	product_id: number;
	quantity: number;
	unit_price: number;
	total_price: number;
	date_distributed: string;
	created_at: string;
	product?: ProductShort;
	user?: UserShort;
}

export type StockDistributionForm = z.infer<typeof StockDistributionFormSchema>;

export interface StockDistributionResponse
	extends Omit<CommonResponse, 'data'> {
	data: StockDistribution[];
}
export interface StockDistributionDetailResponse
	extends Omit<CommonResponse, 'data'> {
	data: StockDistribution;
}

// Good requests data type
export interface GoodRequestPayload {
	product_id: number;
	product_name: string;
	quantity: number;
	price_requested: number;
}

export interface GoodsRequest {
	id: number;
	reseller_id: number;
	payload: GoodRequestPayload[];
	status: string;
	comment?: string;
	cancelled: boolean;
	cancelled_at?: string;
	updated_at: string;
	created_at: string;
	user?: UserShort;
}

export type GoodRequestForm = z.infer<typeof GoodRequestSchema>;

export interface GoodsRequestResponse extends Omit<CommonResponse, 'data'> {
	data: GoodsRequest[];
}
export interface GoodsRequestDetailResponse
	extends Omit<CommonResponse, 'data'> {
	data: GoodsRequest;
}
export interface AdminGoodRequestUpdate {
	id: number;
	status?: string;
	comment?: string;
}
export interface ResellerGoodRequestUpdate {
	id: number;
	data: GoodRequestPayload[];
}

// Payment data type
export interface Payment {
	id: number;
	reseller_id: number;
	amount: number;
	method: string;
	reference?: string;
	recorded_by: number;
	date_paid: string;
	created_at: string;
	user?: UserShort;
}

export type PaymentForm = z.infer<typeof PaymentFormSchema>;

export interface PaymentResponse extends Omit<CommonResponse, 'data'> {
	data: Payment[];
}
export interface PaymentDetailResponse extends Omit<CommonResponse, 'data'> {
	data: Payment;
}

// Stock movement data type
export interface StockMovement {
	id: number;
	product_id: number;
	owner_type: string;
	owner_id?: number;
	movement_type: string;
	quantity: number;
	unit_price: number;
	source: string;
	note?: string;
	created_at: string;
	product_category?: string;
	product?: ProductShort;
	user?: UserShort;
}

export interface StockMovementResponse extends Omit<CommonResponse, 'data'> {
	data: StockMovement[];
}

// Reseller data type
export interface ResellerAccount {
	reseller_id: number;
	total_stock_received: number;
	total_value_received: number;
	total_sales_value: number;
	total_paid: number;
	total_cogs: number;
	balance: number;
}

export interface Reseller {
	user: User;
	account: ResellerAccount;
}

export interface ResellerResponse extends Omit<CommonResponse, 'data'> {
	data: Reseller[];
}
export interface ResellerDetailResponse extends Omit<CommonResponse, 'data'> {
	data: Reseller;
}

// Reseller stock data type
export interface ResellerStock {
	reseller_id: number;
	product_id: number;
	quantity: number;
	product_category?: string;
	low_stock_threshold?: number;
	product?: ProductShort;
	user?: UserShort;
}

export interface ResellerStockResponse extends Omit<CommonResponse, 'data'> {
	data: ResellerStock[];
}

// Reseller sales data type
export interface ResellerSale {
	id: number;
	reseller_id: number;
	product_id: number;
	quantity: number;
	selling_price: number;
	total_amount: number;
	date_sold: string;
	created_at: string;
	product_category?: string;
	product?: ProductShort;
	user?: UserShort;
}

export type SaleForm = z.infer<typeof SaleFormSchema>;

export interface ResellerSalesResponse extends Omit<CommonResponse, 'data'> {
	data: ResellerSale[];
}
export interface ResellerSaleDetailResponse
	extends Omit<CommonResponse, 'data'> {
	data: ResellerSale;
}

// Reseller Stock Form
export interface ResellerStockFormHelpers {
	id: number;
	name: string;
	quantity: number;
	low_stock_threshold: number;
}

export interface ResellerStockFormHelpersResponse
	extends Omit<CommonResponse, 'data'> {
	data: ResellerStockFormHelpers[];
}

// Common types for page data
export interface PaymentsStats {
	cash_total: number;
	mpesa_total: number;
	total_payments: number;
	total_received: number;
}

// Reseller page data type
export interface GoodsRequestStats {
	approved_requests: number;
	pending_requests: number;
	rejected_requests: number;
	total_requests: number;
}

export interface SalesStats {
	total_sales_value: number;
	total_units_sold: number;
}

export interface StockStats {
	total_low_stock: number;
	total_units: number;
	total_value: number;
}

export interface DashboardStats {
	current_stock: number;
	outstanding_balance: number;
	profit: number;

	total_sales: {
		sales_value: number;
		units_sold: number;
	};

	recent_sales: RecentSale[];
	stock_overview: StockOverview[];
}

export interface RecentSale {
	id: number;
	product_name: string;
	quantity: number;
	selling_price: number;
	total_amount: number;
	date_sold: string; // ISO string
}

export interface StockOverview {
	id: number;
	name: string;
	quantity: number;
	low_stock_threshold: number;
}

export interface AccountSummary {
	total_stock_received: number;
	total_value_received: number;
	total_sales_value: number;
	total_paid: number;
	total_cogs: number;
	balance: number;
}

export interface HelpersData {
	goods_requests?: GoodsRequestStats;
	sales?: SalesStats;
	stock?: StockStats;
	dashboard?: DashboardStats;
	payments?: PaymentsStats;
	account_summary?: AccountSummary;
}

export interface HelpersResponse extends Omit<CommonResponse, 'data'> {
	data: HelpersData;
}

// Admin page data type
export interface StockChartData {
	date: string;
	in_stock: number;
	distributed: number;
}

export interface DashboardRecentActivity {
	id: number;
	title: string;
	description: string;
	type: string;
	created_at: string; // ISO date
}

export interface DashboardStockAlert {
	id: number;
	product_name: string;
	quantity: number;
	low_stock_threshold: number;
	alert_type: string;
}

export interface DashboardTopReseller {
	id: number;
	name: string;
	total_sales_value: number;
	stock_value: number;
	performance: number; // percentage (+ / -)
}

export interface AdminDashboardStats {
	active_resellers: number;
	company_low_stock: number;
	payment_received: number;
	stock_distributed_units: number;
	total_company_stock: number;
	total_pending_requests: number;
	total_value_distributed: number;
	recent_activities: DashboardRecentActivity[];
	stock_alerts: DashboardStockAlert[];
	top_resellers: DashboardTopReseller[];
	weekly_stock_chart: StockChartData[];
}

export interface ProductsStats {
	low_stock_items: number;
	out_of_stock: number;
	total_units: number;
}

export interface BatchesStats {
	active_batches: number;
	remaining_value: number;
	total_batches: number;
	total_value: number;
}

export interface DistributionsStats {
	active_resellers: number;
	total_distribution: number;
	total_value: number;
	units_distributed: number;
}

export interface GoodsRequestsStats {
	total_approved: number;
	total_cancelled: number;
	total_pending: number;
	total_rejected: number;
}

export interface ResellersStats {
	active_resellers: number;
	outstanding_payments: number;
	total_resellers: number;
	total_stock_out: number;
}

export interface StockMovementsStats {
	net_movement: number;
	total_movements: number;
	total_stock_in: number;
	total_stock_out: number;
}

export interface AdminHelpersData {
	dashboard?: AdminDashboardStats;
	products?: ProductsStats;
	batches?: BatchesStats;
	distributions?: DistributionsStats;
	goods_requests?: GoodsRequestsStats;
	payments?: PaymentsStats;
	resellers?: ResellersStats;
	stock_movements?: StockMovementsStats;
}

export interface AdminHelpersResponse extends Omit<CommonResponse, 'data'> {
	data: AdminHelpersData;
}

// Dashboard data type
export interface DashboardData {
	total_products: number;
	total_low_stock: number;
	total_out_of_stock: number;
	stock_value: number;
	low_stock: {
		id: number;
		name: string;
		stock: number;
		low_stock_threshold: number;
	}[];
	recent_stock_in: {
		id: number;
		product_name: string;
		quantity: number;
		price: number;
		created_at: string;
	}[];
	recent_stock_out: {
		id: number;
		product_name: string;
		quantity: number;
		price: number;
		created_at: string;
	}[];
	weekly_aggr: {
		day: string;
		sales: number;
		total_transacted: number;
		total_amount: number;
	}[];
}

// Helper data type
export interface CommonDataResponse {
	id: number;
	name: string;
	description?: string;
}

// Types from schema
// users
// export type User = z.infer<typeof UserSchema>;
// export type UserForm = z.infer<typeof UserFormSchema>;

// products
// export type Product = z.infer<typeof ProductSchema>;
export type StockUpdateForm = z.infer<typeof StockUpdateFormSchema>;

// others
export type Transaction = z.infer<typeof MovementSchema>;
export type Stats = z.infer<typeof StatsSchema>;
export type LoginForm = z.infer<typeof LoginFormSchema>;

// Types responses
// users
export interface AuthResponse extends Omit<CommonResponse, 'data'> {
	data: {
		access_token: string;
		user: User;
	};
}
// export interface UserResponse extends Omit<CommonResponse, 'data'> {
// 	data: User;
// }

// products
export interface GetProductsResponse extends Omit<CommonResponse, 'data'> {
	data: Product[];
}

// others
export interface GetDashboardDataResponse extends Omit<CommonResponse, 'data'> {
	data: DashboardData;
}
export interface GetTransactionsResponse extends Omit<CommonResponse, 'data'> {
	data: Transaction[];
}
export interface GetStatsResponse extends Omit<CommonResponse, 'data'> {
	data: Stats;
}
export interface CommonHelpersResponse extends Omit<CommonResponse, 'data'> {
	data: CommonDataResponse[];
}
