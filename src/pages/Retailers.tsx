import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, MapPin, Store } from 'lucide-react';

export default function RetailersPage() {
	return (
		<main className="flex-1">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-pink-50 to-white py-16 md:py-24">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="space-y-4">
							<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
								For Retailers
							</div>
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
								Partner With{' '}
								<span className="text-pink-600">
									Boffo Baby
								</span>
							</h1>
							<p className="text-gray-600 md:text-xl/relaxed">
								Join our growing network of retail partners and
								offer your customers high-quality, locally-made
								diapers.
							</p>
						</div>
						<div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=1200"
								alt="Boffo Baby Diapers retail display"
								// fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Retailer Benefits
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Why Partner With Boffo?
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Discover the advantages of adding Boffo Baby Diapers
							to your product lineup
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="bg-pink-50 rounded-3xl p-8">
							<div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
								<svg
									className="h-6 w-6 text-pink-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-4">
								Competitive Margins
							</h3>
							<p className="text-gray-600 mb-4">
								Our pricing structure ensures healthy margins
								for retailers while maintaining affordability
								for consumers.
							</p>
							<ul className="space-y-2">
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
									<span>
										20-30% profit margins on all products
									</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
									<span>
										Volume-based discounts available
									</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
									<span>
										Special promotions for retail partners
									</span>
								</li>
							</ul>
						</div>

						<div className="bg-blue-50 rounded-3xl p-8">
							<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
								<Store className="h-6 w-6 text-blue-600" />
							</div>
							<h3 className="text-xl font-bold mb-4">
								Reliable Supply Chain
							</h3>
							<p className="text-gray-600 mb-4">
								Local manufacturing means consistent stock
								availability without import delays or currency
								fluctuations.
							</p>
							<ul className="space-y-2">
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span>
										Fast delivery within 24-48 hours in
										Nairobi
									</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span>
										3-5 day delivery to other major cities
									</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span>
										No import-related stock shortages
									</span>
								</li>
							</ul>
						</div>

						<div className="bg-purple-50 rounded-3xl p-8">
							<div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
								<svg
									className="h-6 w-6 text-purple-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-4">
								Marketing Support
							</h3>
							<p className="text-gray-600 mb-4">
								We provide point-of-sale materials, promotional
								support, and staff training to boost sales.
							</p>
							<ul className="space-y-2">
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
									<span>
										Free POS displays and promotional
										materials
									</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
									<span>
										Staff training on product features and
										benefits
									</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
									<span>
										Co-marketing opportunities and in-store
										events
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* Partnership Programs */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Partnership Programs
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Choose the Right Partnership for Your Business
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							We offer flexible partnership options to suit
							businesses of all sizes
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="bg-white rounded-3xl p-8 shadow-sm">
							<div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
								<svg
									className="h-6 w-6 text-pink-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-2">
								Standard Retail Program
							</h3>
							<p className="text-gray-600 mb-6">
								For general retailers looking to stock our
								complete product range with standard terms.
							</p>
							<ul className="space-y-3 mb-8">
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
									<span>30-day payment terms</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
									<span>Minimum order: 50 packs</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
									<span>Basic marketing materials</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
									<span>Standard margin structure</span>
								</li>
							</ul>
							<Button
								className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full"
								asChild
							>
								<Link to="/contact">Apply Now</Link>
							</Button>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-sm relative">
							<div className="absolute top-4 right-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
								POPULAR
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
								<svg
									className="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-2">
								Premium Partner Program
							</h3>
							<p className="text-gray-600 mb-6">
								For dedicated retailers with higher volumes and
								exclusive promotional opportunities.
							</p>
							<ul className="space-y-3 mb-8">
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span>45-day payment terms</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span>Volume discounts</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span>Exclusive promotions and events</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span>Enhanced margins</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span>Dedicated account manager</span>
								</li>
							</ul>
							<Button
								className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
								asChild
							>
								<Link to="/contact">Apply Now</Link>
							</Button>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-sm">
							<div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
								<svg
									className="h-6 w-6 text-purple-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-2">
								Distributor Program
							</h3>
							<p className="text-gray-600 mb-6">
								For businesses looking to distribute our
								products to multiple retailers in specific
								regions.
							</p>
							<ul className="space-y-3 mb-8">
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
									<span>Exclusive regional rights</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
									<span>60-day payment terms</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
									<span>Maximum margins</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
									<span>Marketing budget allocation</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
									<span>Dedicated account manager</span>
								</li>
							</ul>
							<Button
								className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full"
								asChild
							>
								<Link to="/contact">Apply Now</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Retailer Testimonials
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							What Our Retail Partners Say
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Hear from businesses that have partnered with Boffo
							Baby Diapers
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						<div className="bg-pink-50 rounded-3xl p-8">
							<p className="text-gray-600 italic mb-6">
								"Since we started carrying Boffo Baby Diapers,
								our baby care section sales have increased by
								35%. Customers love the quality and
								affordability, and we appreciate the reliable
								supply and excellent margins."
							</p>
							<div className="flex items-center gap-4">
								<div className="h-16 w-16 rounded-full overflow-hidden relative">
									<img
										src="/placeholder.svg?height=100&width=100"
										alt="James from SuperMart"
										// fill
										className="object-cover"
									/>
								</div>
								<div>
									<h4 className="font-bold">James Kariuki</h4>
									<p className="text-sm text-gray-500">
										Purchasing Manager, SuperMart
									</p>
									<p className="text-sm text-gray-500">
										Nairobi, Kenya
									</p>
								</div>
							</div>
						</div>

						<div className="bg-blue-50 rounded-3xl p-8">
							<p className="text-gray-600 italic mb-6">
								"As a small pharmacy chain, we appreciate
								Boffo's flexible ordering system and quick
								delivery. Their marketing support has helped us
								educate customers about the benefits of their
								products, resulting in high repeat purchases."
							</p>
							<div className="flex items-center gap-4">
								<div className="h-16 w-16 rounded-full overflow-hidden relative">
									<img
										src="/placeholder.svg?height=100&width=100"
										alt="Mary from HealthPlus Pharmacy"
										// fill
										className="object-cover"
									/>
								</div>
								<div>
									<h4 className="font-bold">Mary Odhiambo</h4>
									<p className="text-sm text-gray-500">
										Owner, HealthPlus Pharmacy
									</p>
									<p className="text-sm text-gray-500">
										Kisumu, Kenya
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How to Become a Retailer */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Join Our Network
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							How to Become a Boffo Retailer
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							A simple process to start offering Boffo Baby
							Diapers to your customers
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-4">
						<div className="bg-white rounded-3xl p-6 text-center relative">
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
								1
							</div>
							<div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="h-8 w-8 text-pink-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-bold mb-2">
								Submit Application
							</h3>
							<p className="text-gray-600 text-sm">
								Fill out our retailer application form with your
								business details and preferred partnership
								program.
							</p>
						</div>

						<div className="bg-white rounded-3xl p-6 text-center relative">
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
								2
							</div>
							<div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="h-8 w-8 text-pink-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-bold mb-2">
								Consultation
							</h3>
							<p className="text-gray-600 text-sm">
								Our retail partnership team will contact you to
								discuss your needs and customize a partnership
								plan.
							</p>
						</div>

						<div className="bg-white rounded-3xl p-6 text-center relative">
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
								3
							</div>
							<div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="h-8 w-8 text-pink-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-bold mb-2">
								Agreement
							</h3>
							<p className="text-gray-600 text-sm">
								Once terms are agreed upon, we'll finalize the
								partnership agreement and set up your account.
							</p>
						</div>

						<div className="bg-white rounded-3xl p-6 text-center relative">
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
								4
							</div>
							<div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="h-8 w-8 text-pink-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-bold mb-2">Launch</h3>
							<p className="text-gray-600 text-sm">
								We'll deliver your first order along with
								marketing materials and provide staff training
								if needed.
							</p>
						</div>
					</div>

					<div className="mt-12 text-center">
						<Button
							className="bg-pink-600 hover:bg-pink-700 text-white rounded-full"
							size="lg"
							asChild
						>
							<Link to="/contact">
								Apply to Become a Retailer{' '}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Store Locator */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Find Our Products
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Where to Buy Boffo Baby Diapers
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Boffo Baby Diapers are available at these major
							retailers across Kenya
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						<div className="space-y-6">
							<div className="bg-pink-50 rounded-3xl p-6">
								<h3 className="text-xl font-bold mb-4">
									Major Supermarkets
								</h3>
								<ul className="space-y-4">
									{[
										{
											name: 'Naivas Supermarket',
											locations:
												'All branches nationwide',
										},
										{
											name: 'Carrefour',
											locations: 'Nairobi, Mombasa',
										},
										{
											name: 'Quickmart',
											locations:
												'All branches nationwide',
										},
										{
											name: 'Chandarana Foodplus',
											locations:
												'Nairobi, Mombasa, Kisumu',
										},
									].map((store, index) => (
										<li
											key={index}
											className="flex items-start gap-3"
										>
											<Store className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<div>
												<p className="font-medium">
													{store.name}
												</p>
												<p className="text-sm text-gray-600">
													{store.locations}
												</p>
											</div>
										</li>
									))}
								</ul>
							</div>

							<div className="bg-blue-50 rounded-3xl p-6">
								<h3 className="text-xl font-bold mb-4">
									Pharmacy Chains
								</h3>
								<ul className="space-y-4">
									{[
										{
											name: 'Goodlife Pharmacy',
											locations:
												'All branches nationwide',
										},
										{
											name: 'Haltons Pharmacy',
											locations:
												'Nairobi, Mombasa, Kisumu',
										},
										{
											name: 'HealthPlus Pharmacy',
											locations: 'Major cities',
										},
										{
											name: 'Medimart Pharmacy',
											locations:
												'Nairobi, Nakuru, Eldoret',
										},
									].map((store, index) => (
										<li
											key={index}
											className="flex items-start gap-3"
										>
											<Store className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
											<div>
												<p className="font-medium">
													{store.name}
												</p>
												<p className="text-sm text-gray-600">
													{store.locations}
												</p>
											</div>
										</li>
									))}
								</ul>
							</div>

							<div className="bg-green-50 rounded-3xl p-6">
								<h3 className="text-xl font-bold mb-4">
									Baby Specialty Stores
								</h3>
								<ul className="space-y-4">
									{[
										{
											name: 'Baby Shop Kenya',
											locations: 'Nairobi, Mombasa',
										},
										{
											name: 'Little Angels',
											locations: 'Nairobi, Kisumu',
										},
										{
											name: 'Mothercare',
											locations:
												'Nairobi (Junction, Garden City)',
										},
										{
											name: 'Babies Nest',
											locations: 'Nairobi, Nakuru',
										},
									].map((store, index) => (
										<li
											key={index}
											className="flex items-start gap-3"
										>
											<Store className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
											<div>
												<p className="font-medium">
													{store.name}
												</p>
												<p className="text-sm text-gray-600">
													{store.locations}
												</p>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="space-y-6">
							<div className="relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800&text=Store+Locator+Map"
									alt="Store locator map"
									// fill
									className="object-cover"
								/>
							</div>

							<div className="bg-pink-50 rounded-3xl p-6">
								<h3 className="text-xl font-bold mb-4">
									Find a Store Near You
								</h3>
								<p className="text-gray-600 mb-4">
									Use our store locator to find the nearest
									retailer carrying Boffo Baby Diapers.
								</p>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label
											htmlFor="city"
											className="block text-sm font-medium mb-2"
										>
											City
										</label>
										<select
											id="city"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										>
											<option value="">
												Select a city
											</option>
											<option value="nairobi">
												Nairobi
											</option>
											<option value="mombasa">
												Mombasa
											</option>
											<option value="kisumu">
												Kisumu
											</option>
											<option value="nakuru">
												Nakuru
											</option>
											<option value="eldoret">
												Eldoret
											</option>
										</select>
									</div>
									<div>
										<label
											htmlFor="store-type"
											className="block text-sm font-medium mb-2"
										>
											Store Type
										</label>
										<select
											id="store-type"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										>
											<option value="">
												All store types
											</option>
											<option value="supermarket">
												Supermarket
											</option>
											<option value="pharmacy">
												Pharmacy
											</option>
											<option value="baby-store">
												Baby Specialty Store
											</option>
										</select>
									</div>
								</div>
								<Button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full">
									Find Stores
								</Button>
							</div>

							<div className="bg-purple-50 rounded-3xl p-6">
								<h3 className="text-xl font-bold mb-4">
									Online Shopping
								</h3>
								<p className="text-gray-600 mb-4">
									You can also purchase Boffo Baby Diapers
									online through these platforms:
								</p>
								<ul className="space-y-4">
									{[
										{
											name: 'Jumia Kenya',
											url: 'https://jumia.co.ke',
										},
										{
											name: 'Kilimall',
											url: 'https://kilimall.co.ke',
										},
										{
											name: 'Boffo Official Online Store',
											url: '/shop',
										},
										{
											name: 'Copia Kenya',
											url: 'https://copia.co.ke',
										},
									].map((store, index) => (
										<li
											key={index}
											className="flex items-start gap-3"
										>
											<svg
												className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
												/>
											</svg>
											<div>
												<Link
													to={store.url}
													className="font-medium text-purple-600 hover:underline"
												>
													{store.name}
												</Link>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Retailer Support */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="space-y-4">
							<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
								Retailer Support
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								We're Here to Help You Succeed
							</h2>
							<p className="text-gray-600 md:text-lg">
								Our dedicated retailer support team is available
								to assist you with any questions or needs you
								may have.
							</p>
							<div className="space-y-4 mt-6">
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
										<svg
											className="h-5 w-5 text-pink-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="font-bold">
											Retailer Hotline
										</h3>
										<p className="text-gray-600">
											<a
												href="tel:+254722000000"
												className="text-pink-600 hover:underline"
											>
												+254 722 000 000
											</a>
										</p>
										<p className="text-sm text-gray-500">
											Monday-Friday, 8am-6pm
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
										<svg
											className="h-5 w-5 text-pink-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="font-bold">
											Email Support
										</h3>
										<p className="text-gray-600">
											<a
												href="mailto:retailers@boffobaby.co.ke"
												className="text-pink-600 hover:underline"
											>
												retailers@boffobaby.co.ke
											</a>
										</p>
										<p className="text-sm text-gray-500">
											Response within 24 hours
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
										<MapPin className="h-5 w-5 text-pink-600" />
									</div>
									<div>
										<h3 className="font-bold">
											Retailer Support Office
										</h3>
										<p className="text-gray-600">
											Boffo Baby Diapers Ltd.
											<br />
											Industrial Area, Enterprise Road
											<br />
											Nairobi, Kenya
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="relative h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=800"
								alt="Retailer support team"
								// fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 md:py-24 bg-pink-600">
				<div className="container px-4 md:px-6 text-center">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
						Ready to Partner With Boffo Baby?
					</h2>
					<p className="mx-auto max-w-[700px] text-pink-100 md:text-xl/relaxed mb-8">
						Join our growing network of successful retailers across
						Kenya
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-white text-pink-600 hover:bg-pink-50 rounded-full"
							asChild
						>
							<Link to="/contact">
								Apply Now{' '}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-pink-300 text-white hover:bg-pink-500 rounded-full"
							asChild
						>
							<Link to="/contact">Contact Retailer Support</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
