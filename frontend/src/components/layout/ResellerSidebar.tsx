import { Link, useLocation } from 'react-router-dom';
import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	FileText,
	Wallet,
	LogOut,
	Settings,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const resellerNavItems = [
	{ title: 'Dashboard', href: '/reseller', icon: LayoutDashboard },
	{ title: 'My Stock', href: '/reseller/stock', icon: Package },
	{ title: 'Sales', href: '/reseller/sales', icon: ShoppingCart },
	{ title: 'Goods Requests', href: '/reseller/requests', icon: FileText },
	{ title: 'My Payments', href: '/reseller/payments', icon: Wallet },
];

export default function ResellerSidebar() {
	const { decoded, logout } = useAuth();
	const location = useLocation();

	const isActive = (href: string) => {
		const path = location.pathname;

		if (href === '/reseller') {
			return path === href;
		}

		return path === href || path.startsWith(`${href}/`);
	};

	return (
		<Sidebar className="h-full">
			{/* Header */}
			<SidebarHeader className="px-4">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
						<Package className="h-4 w-4 text-sidebar-primary-foreground" />
					</div>
					<span className="block font-bold">Boffo</span>
				</div>
			</SidebarHeader>

			{/* Navigation */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Reseller</SidebarGroupLabel>

					<SidebarMenu>
						{resellerNavItems.map((item) => (
							<SidebarMenuItem key={item.href}>
								<SidebarMenuButton asChild>
									<Link
										to={item.href}
										className={cn(
											'flex items-center gap-2',
											isActive(item.href)
												? 'bg-sidebar-accent text-sidebar-primary font-medium'
												: 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
										)}
									>
										<item.icon className="h-4 w-4" />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			{/* Footer */}
			<SidebarFooter className="space-y-3">
				<div className="flex items-center gap-3 px-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
						{decoded?.name?.charAt(0)}
					</div>
					<div className="truncate">
						<p className="text-sm font-medium">{decoded?.name}</p>
						<p className="text-xs opacity-60">{decoded?.email}</p>
					</div>
				</div>

				<div className="flex gap-2 px-3">
					<Link
						to="/reseller/settings"
						className="flex flex-1 items-center justify-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-xs transition-colors hover:bg-sidebar-accent/80"
					>
						<Settings className="h-3.5 w-3.5" />
						Settings
					</Link>

					<button
						onClick={logout}
						className="flex flex-1 items-center justify-center gap-2 rounded-md bg-destructive px-3 py-2 text-xs text-destructive-foreground transition-colors"
					>
						<LogOut className="h-3.5 w-3.5" />
						Logout
					</button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
