import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
	return (
		<footer className="bg-pink-50 border-t">
			<div className="container px-4 md:px-6 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div>
						<Link to="/" className="flex items-center gap-2 mb-4">
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
						<p className="text-gray-600 mb-4">
							Kenya's favorite baby diaper brand, made with love
							for your little one's comfort and your peace of
							mind.
						</p>
						<div className="flex gap-4">
							<Link
								to="https://facebook.com"
								className="text-gray-600 hover:text-pink-600 transition-colors"
							>
								<Facebook className="h-5 w-5" />
								<span className="sr-only">Facebook</span>
							</Link>
							<Link
								to="https://instagram.com"
								className="text-gray-600 hover:text-pink-600 transition-colors"
							>
								<Instagram className="h-5 w-5" />
								<span className="sr-only">Instagram</span>
							</Link>
							<Link
								to="https://twitter.com"
								className="text-gray-600 hover:text-pink-600 transition-colors"
							>
								<Twitter className="h-5 w-5" />
								<span className="sr-only">Twitter</span>
							</Link>
						</div>
					</div>

					<div>
						<h3 className="font-bold text-lg mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/products"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									Products
								</Link>
							</li>
							<li>
								<Link
									to="/manufacturing"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									How We Make
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold text-lg mb-4">Products</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/products/newborn"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									Newborn Series
								</Link>
							</li>
							<li>
								<Link
									to="/products/standard"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									Standard Series
								</Link>
							</li>
							<li>
								<Link
									to="/products/premium"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									Premium Series
								</Link>
							</li>
							<li>
								<Link
									to="/products/wipes"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									Baby Wipes
								</Link>
							</li>
							<li>
								<Link
									to="/products/coming-soon"
									className="text-gray-600 hover:text-pink-600 transition-colors"
								>
									Coming Soon
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold text-lg mb-4">Contact Us</h3>
						<address className="not-italic text-gray-600 space-y-2">
							<p>Boffo Baby Diapers Ltd.</p>
							<p>Industrial Area, Nairobi</p>
							<p>Kenya</p>
							<p className="pt-2">
								<a
									href="tel:+254700000000"
									className="hover:text-pink-600 transition-colors"
								>
									+254 700 000 000
								</a>
							</p>
							<p>
								<a
									href="mailto:info@boffobaby.co.ke"
									className="hover:text-pink-600 transition-colors"
								>
									info@boffobaby.co.ke
								</a>
							</p>
						</address>
					</div>
				</div>

				<div className="mt-12 pt-8 border-t border-pink-100 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-gray-600">
						&copy; {new Date().getFullYear()} Boffo Baby Diapers
						Ltd. All rights reserved.
					</p>
					<div className="flex gap-6">
						<Link
							to="/privacy"
							className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							to="/terms"
							className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
