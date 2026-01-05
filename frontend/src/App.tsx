import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Index from './pages/Index';
// import LoginPage from './pages/LoginPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsPage from './pages/admin/ProductsPage';
import BatchesPage from './pages/admin/BatchesPage';
import CompanyStockPage from './pages/admin/CompanyStockPage';
import DistributionPage from './pages/admin/DistributionPage';
import GoodsRequestsPage from './pages/admin/GoodsRequestsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import ResellersPage from './pages/admin/ResellersPage';
import StockMovementsPage from './pages/admin/StockMovementsPage';

// Reseller Pages
import ResellerDashboard from './pages/reseller/ResellerDashboard';
import MyStockPage from './pages/reseller/MyStockPage';
import SalesPage from './pages/reseller/SalesPage';
import ResellerRequestsPage from './pages/reseller/ResellerRequestsPage';
import AccountSummaryPage from './pages/reseller/AccountSummaryPage';
import ResellerDetailPage from './pages/admin/ResellerDetailPage';
import AdminLayout from './components/layout/AdminLayout';
import ResellerLayout from './components/layout/ResellerLayout';
import ResellerPaymentsPage from './pages/reseller/ResellerPaymentsPage';
import ResellerSettingsPage from './pages/reseller/ResellerSettings';
import AdminSettingsPage from './pages/admin/AdminSettings';
import StaffsPage from './pages/admin/StaffsPage';

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Index />} />
						<Route path="/login" element={<Login />} />

						{/* Admin Routes */}
						<Route path="/admin" element={<AdminLayout />}>
							<Route index element={<AdminDashboard />} />
							<Route path="products" element={<ProductsPage />} />
							<Route path="batches" element={<BatchesPage />} />
							<Route
								path="stock"
								element={<CompanyStockPage />}
							/>
							<Route
								path="distribution"
								element={<DistributionPage />}
							/>
							<Route
								path="requests"
								element={<GoodsRequestsPage />}
							/>
							<Route path="payments" element={<PaymentsPage />} />
							<Route
								path="resellers"
								element={<ResellersPage />}
							/>
							<Route
								path="resellers/:id"
								element={<ResellerDetailPage />}
							/>
							<Route path="staffs" element={<StaffsPage />} />
							<Route
								path="movements"
								element={<StockMovementsPage />}
							/>
							<Route
								path="settings"
								element={<AdminSettingsPage />}
							/>
						</Route>

						{/* Reseller Routes */}
						<Route path="/reseller" element={<ResellerLayout />}>
							<Route index element={<ResellerDashboard />} />
							<Route path="stock" element={<MyStockPage />} />
							<Route path="sales" element={<SalesPage />} />
							<Route
								path="requests"
								element={<ResellerRequestsPage />}
							/>
							<Route
								path="account"
								element={<AccountSummaryPage />}
							/>
							<Route
								path="payments"
								element={<ResellerPaymentsPage />}
							/>
							<Route
								path="settings"
								element={<ResellerSettingsPage />}
							/>
						</Route>

						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</AuthProvider>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);

export default App;
