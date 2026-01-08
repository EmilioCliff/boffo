import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

export default function AdminLayout() {
	const { decoded, isAuthenticated, isChecking } = useAuth();

	if (isChecking) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<span className="text-muted-foreground">Checking session…</span>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (decoded?.role !== 'admin') {
		return <Navigate to="/reseller" replace />;
	}

	return (
		<SidebarProvider>
			<div className="min-h-screen bg-background flex min-w-0 w-full">
				<AdminSidebar />

				<div className="flex-1 flex flex-col min-w-0">
					{/* Top Header */}
					<header className="sticky top-0 z-30 flex h-16 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
						<div className="flex items-center gap-4">
							<SidebarTrigger>
								<Button variant="ghost" size="icon">
									<Menu className="w-5 h-5" />
								</Button>
							</SidebarTrigger>
						</div>
					</header>

					{/* Page Content */}
					<main className="flex-1 min-w-0 overflow-x-auto">
						<div className="p-6 min-w-0 max-w-full">
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
