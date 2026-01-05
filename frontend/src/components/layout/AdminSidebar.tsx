import { Link, useLocation } from 'react-router-dom';
import {
	LayoutDashboard,
	Package,
	Layers,
	// Warehouse,
	Truck,
	FileText,
	CreditCard,
	Users,
	ArrowLeftRight,
	LogOut,
	Settings,
	UserCog,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarHeader,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const adminNavItems = [
	{ title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
	{ title: 'Resellers', href: '/admin/resellers', icon: Users },
	{ title: 'Products', href: '/admin/products', icon: Package },
	{ title: 'Batches', href: '/admin/batches', icon: Layers },
	// { title: 'Company Stock', href: '/admin/stock', icon: Warehouse },
	{ title: 'Distribution', href: '/admin/distribution', icon: Truck },
	{ title: 'Goods Requests', href: '/admin/requests', icon: FileText },
	{ title: 'Payments', href: '/admin/payments', icon: CreditCard },
	{ title: 'Staffs', href: '/admin/staffs', icon: UserCog },
	{
		title: 'Stock Movements',
		href: '/admin/movements',
		icon: ArrowLeftRight,
	},
];

export default function AdminSidebar() {
	const { decoded, logout } = useAuth();
	const location = useLocation();

	const isActive = (href: string) => {
		const path = location.pathname;

		if (href === '/admin') {
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
					<span className="font-bold">Boffo</span>
				</div>
			</SidebarHeader>

			{/* Content */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Admin</SidebarGroupLabel>

					<SidebarMenu>
						{adminNavItems.map((item) => (
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
										<item.icon className={cn(`h-4 w-4`)} />
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
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium">
						{decoded?.name?.charAt(0)}
					</div>
					<div className="truncate">
						<p className="text-sm font-medium">{decoded?.name}</p>
						<p className="text-xs opacity-70">{decoded?.email}</p>
					</div>
				</div>

				<div className="flex gap-2 px-3">
					<Link
						to="/admin/settings"
						className="flex flex-1 items-center justify-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-xs"
					>
						<Settings className="h-3.5 w-3.5" />
						Settings
					</Link>

					<button
						onClick={logout}
						className="flex flex-1 items-center justify-center gap-2 rounded-md bg-destructive px-3 py-2 text-xs text-destructive-foreground"
					>
						<LogOut className="h-3.5 w-3.5" />
						Logout
					</button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
