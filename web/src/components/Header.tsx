import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	const currentPath = location.pathname;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
			{isMenuOpen ? (
				<div className="fixed inset-0 z-50 bg-opacity-95 backdrop-blur-md md:hidden">
					<div className="flex h-16 items-center bg-white bg-opacity-95 backdrop-blur-md justify-between px-4">
						<div className="flex items-center gap-2">
							<Link to="/" className="flex items-center gap-2">
								<div className="relative h-10 w-10 overflow-hidden rounded-full">
									<img
										src="/placeholder.svg?height=40&width=40"
										alt="Boffo Baby Diapers Logo"
										width={40}
										height={40}
										className="object-cover"
									/>
								</div>
								<span className="text-xl font-bold text-pink-600">
									Boffo Baby
								</span>
							</Link>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMenuOpen(false)}
						>
							<X className="h-6 w-6" />
							<span className="sr-only">Close menu</span>
						</Button>
					</div>
					<nav className="px-4 pt-6 h-[100vh] bg-white bg-opacity-95 backdrop-blur-md space-y-6">
						<Link
							to="/"
							// className="block text-lg font-medium hover:text-pink-600 transition-colors"
							className={`block text-lg text-center font-medium transition-colors ${
								currentPath == '/'
									? 'text-pink-600'
									: 'hover:text-pink-600'
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							Home
						</Link>
						<Link
							to="/about"
							// className="block text-lg font-medium hover:text-pink-600 transition-colors"
							className={`block text-lg text-center font-medium transition-colors ${
								currentPath == '/about'
									? 'text-pink-600'
									: 'hover:text-pink-600'
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							About Us
						</Link>
						<Link
							to="/products"
							// className="block text-lg font-medium hover:text-pink-600 transition-colors"
							className={`block text-lg text-center font-medium transition-colors ${
								currentPath.startsWith('/products')
									? 'text-pink-600'
									: 'hover:text-pink-600'
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							Products
						</Link>
						<Link
							to="/manufacturing"
							// className="block text-lg font-medium hover:text-pink-600 transition-colors"
							className={`block text-lg text-center font-medium transition-colors ${
								currentPath == '/manufacturing'
									? 'text-pink-600'
									: 'hover:text-pink-600'
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							How We Make
						</Link>
						<Link
							to="/retailers"
							// className="block text-lg font-medium hover:text-pink-600 transition-colors"
							className={`block text-lg text-center font-medium transition-colors ${
								currentPath == '/retailers'
									? 'text-pink-600'
									: 'hover:text-pink-600'
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							For Retailers
						</Link>
						<Link
							to="/investors"
							// className="block text-lg font-medium hover:text-pink-600 transition-colors"
							className={`block text-lg text-center font-medium transition-colors ${
								currentPath == '/investors'
									? 'text-pink-600'
									: 'hover:text-pink-600'
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							For Investors
						</Link>
						<Link
							to="/contact"
							// className="block text-lg font-medium hover:text-pink-600 transition-colors"
							className={`block text-lg text-center font-medium transition-colors ${
								currentPath == '/contact'
									? 'text-pink-600'
									: 'hover:text-pink-600'
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							Contact
						</Link>
						<Button
							className="w-full mt-auto bg-pink-600 hover:bg-pink-700 rounded-full"
							asChild
						>
							<Link
								to="/contact"
								onClick={() => setIsMenuOpen(false)}
							>
								Get in Touch
							</Link>
						</Button>
					</nav>
				</div>
			) : (
				<div className="container px-4 md:px-6">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center gap-2">
							<Link to="/" className="flex items-center gap-2">
								<div className="relative h-10 w-10 overflow-hidden rounded-full">
									<img
										src="/placeholder.svg?height=40&width=40"
										// src="/boffo-icon-1.png"
										alt="Boffo Baby Diapers Logo"
										width={40}
										height={40}
										className="object-cover"
									/>
								</div>
								<span className="text-xl font-bold text-pink-600">
									Boffo Baby
								</span>
							</Link>
						</div>

						<nav className="hidden md:flex items-center gap-6">
							<Link
								to="/"
								// className="text-sm font-medium hover:text-pink-600 transition-colors"
								className={`text-sm font-medium transition-colors ${
									currentPath == '/'
										? 'text-pink-600'
										: 'hover:text-pink-600'
								}`}
							>
								Home
							</Link>
							<Link
								to="/about"
								// className="text-sm font-medium hover:text-pink-600 transition-colors"
								className={`text-sm font-medium transition-colors ${
									currentPath == '/about'
										? 'text-pink-600'
										: 'hover:text-pink-600'
								}`}
							>
								About Us
							</Link>
							<Link
								to="/products"
								// className="text-sm font-medium hover:text-pink-600 transition-colors"
								className={`text-sm font-medium transition-colors ${
									currentPath.startsWith('/products')
										? 'text-pink-600'
										: 'hover:text-pink-600'
								}`}
							>
								Products
							</Link>
							<Link
								to="/manufacturing"
								// className="text-sm font-medium hover:text-pink-600 transition-colors"
								className={`text-sm font-medium transition-colors ${
									currentPath == '/manufacturing'
										? 'text-pink-600'
										: 'hover:text-pink-600'
								}`}
							>
								How We Make
							</Link>
							<Link
								to="/retailers"
								// className="text-sm font-medium hover:text-pink-600 transition-colors"
								className={`text-sm font-medium transition-colors ${
									currentPath == '/retailers'
										? 'text-pink-600'
										: 'hover:text-pink-600'
								}`}
							>
								For Retailers
							</Link>
							<Link
								to="/investors"
								// className="text-sm font-medium hover:text-pink-600 transition-colors"
								className={`text-sm font-medium transition-colors ${
									currentPath == '/investors'
										? 'text-pink-600'
										: 'hover:text-pink-600'
								}`}
							>
								For Investors
							</Link>
							<Link
								to="/contact"
								// className="text-sm font-medium hover:text-pink-600 transition-colors"
								className={`text-sm font-medium transition-colors ${
									currentPath == '/contact'
										? 'text-pink-600'
										: 'hover:text-pink-600'
								}`}
							>
								Contact
							</Link>
						</nav>

						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								className="text-pink-600"
							>
								<ShoppingBag className="h-5 w-5" />
								<span className="sr-only">Shopping cart</span>
							</Button>

							<Button
								className="hidden md:flex bg-pink-600 hover:bg-pink-700 rounded-full"
								asChild
							>
								<Link to="/contact">Get in Touch</Link>
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								onClick={() => setIsMenuOpen(true)}
							>
								<Menu className="h-6 w-6" />
								<span className="sr-only">Open menu</span>
							</Button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
