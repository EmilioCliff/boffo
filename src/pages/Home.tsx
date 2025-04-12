import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Star } from 'lucide-react';

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden bg-gradient-to-b from-pink-50 to-white">
					<div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center gap-8 py-10 md:py-16">
						<div className="flex-1 space-y-4 text-center lg:text-left">
							<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
								Kenya&apos;s Favorite Baby Diapers
							</div>
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
								Keeping Your{' '}
								<span className="text-pink-600">
									Little Ones
								</span>{' '}
								Dry & Happy
							</h1>
							<p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto lg:mx-0">
								Boffo Baby Diapers combines the softest
								materials with superior absorption to give your
								baby the comfort they deserve.
							</p>
							<div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
								<Button
									size="lg"
									className="bg-pink-600 hover:bg-pink-700 text-white rounded-full"
									asChild
								>
									<Link to="/products">
										Explore Our Products{' '}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-pink-200 text-pink-700 hover:bg-pink-50 rounded-full"
									asChild
								>
									<Link to="/about">Learn Our Story</Link>
								</Button>
							</div>
						</div>
						<div className="flex-1 relative">
							<div className="relative h-[400px] w-full lg:h-[500px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=1000&width=1000"
									alt="Happy baby wearing Boffo diaper"
									// fill
									className="object-cover"
									// priority
								/>
							</div>
							<div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 w-40">
								<div className="flex items-center gap-1 text-amber-500">
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
								</div>
								<p className="text-sm font-medium mt-1">
									Trusted by 10,000+ Kenyan moms
								</p>
							</div>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-24 bg-[url('/placeholder.svg?height=100&width=2000')] bg-repeat-x bg-bottom opacity-10" />
				</section>

				{/* Featured Products */}
				<section className="py-12 md:py-16 bg-white">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center text-center mb-10">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
								Our{' '}
								<span className="text-pink-600">
									Bestselling
								</span>{' '}
								Products
							</h2>
							<p className="mt-4 max-w-[600px] text-gray-600 md:text-xl/relaxed">
								Designed with love for your baby&apos;s comfort
								and your peace of mind
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="group relative overflow-hidden rounded-3xl bg-pink-50 p-6 transition-all hover:shadow-lg">
								<div className="absolute z-10 top-4 right-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
									BESTSELLER
								</div>
								<div className="mb-6 h-[200px] w-full relative">
									<img
										src="/placeholder.svg?height=400&width=400"
										width={200}
										height={200}
										alt="Boffo Newborn Diapers"
										// fill
										className="object-contain mx-auto transition-transform group-hover:scale-105"
									/>
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Boffo Newborn
								</h3>
								<p className="mt-2 text-gray-600">
									Extra gentle for your newborn&apos;s
									delicate skin
								</p>
								<div className="mt-4 flex items-center gap-2">
									<div className="text-sm font-medium bg-white px-3 py-1 rounded-full">
										0-3 kg
									</div>
									<div className="text-sm font-medium bg-white px-3 py-1 rounded-full">
										Super Soft
									</div>
								</div>
								<Link
									to="/products/newborn"
									className="mt-6 inline-flex items-center text-pink-600 font-medium"
								>
									Learn more{' '}
									<ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</div>

							<div className="group relative overflow-hidden rounded-3xl bg-blue-50 p-6 transition-all hover:shadow-lg">
								<div className="mb-6 h-[200px] w-full relative">
									<img
										src="/placeholder.svg?height=400&width=400"
										width={200}
										height={200}
										alt="Boffo Standard Diapers"
										// fill
										className="object-contain mx-auto transition-transform group-hover:scale-105"
									/>
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Boffo Standard
								</h3>
								<p className="mt-2 text-gray-600">
									All-day comfort and protection for active
									babies
								</p>
								<div className="mt-4 flex items-center gap-2">
									<div className="text-sm font-medium bg-white px-3 py-1 rounded-full">
										3-15 kg
									</div>
									<div className="text-sm font-medium bg-white px-3 py-1 rounded-full">
										16hr Protection
									</div>
								</div>
								<Link
									to="/products/standard"
									className="mt-6 inline-flex items-center text-blue-600 font-medium"
								>
									Learn more{' '}
									<ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</div>

							<div className="group relative overflow-hidden rounded-3xl bg-purple-50 p-6 transition-all hover:shadow-lg">
								<div className="mb-6 h-[200px] w-full relative">
									<img
										src="/placeholder.svg?height=400&width=400"
										width={200}
										height={200}
										alt="Boffo Premium Diapers"
										// fill
										className="object-contain mx-auto transition-transform group-hover:scale-105"
									/>
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Boffo Premium
								</h3>
								<p className="mt-2 text-gray-600">
									Overnight protection for uninterrupted sleep
								</p>
								<div className="mt-4 flex items-center gap-2">
									<div className="text-sm font-medium bg-white px-3 py-1 rounded-full">
										5-20 kg
									</div>
									<div className="text-sm font-medium bg-white px-3 py-1 rounded-full">
										24hr Protection
									</div>
								</div>
								<Link
									to="/products/premium"
									className="mt-6 inline-flex items-center text-purple-600 font-medium"
								>
									Learn more{' '}
									<ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</div>
						</div>

						<div className="mt-12 text-center">
							<Button
								className="bg-pink-600 hover:bg-pink-700 text-white rounded-full"
								size="lg"
								asChild
							>
								<Link to="/products">
									View All Products{' '}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Why Choose Boffo */}
				<section className="py-12 md:py-16 bg-gradient-to-b from-white to-pink-50">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center text-center mb-10">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
								Why Kenyan Parents{' '}
								<span className="text-pink-600">
									Love Boffo
								</span>
							</h2>
							<p className="mt-4 max-w-[600px] text-gray-600 md:text-xl/relaxed">
								Made in Kenya with love, for Kenyan babies
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
								<div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
									<Shield className="h-6 w-6 text-pink-600" />
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Superior Absorption
								</h3>
								<p className="mt-2 text-gray-600">
									Our unique core technology locks away
									moisture to keep your baby dry for hours.
								</p>
							</div>

							<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
								<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
									<Heart className="h-6 w-6 text-blue-600" />
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Gentle on Skin
								</h3>
								<p className="mt-2 text-gray-600">
									Hypoallergenic materials and breathable
									design prevent rashes and irritation.
								</p>
							</div>

							<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
								<div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
									<svg
										className="h-6 w-6 text-green-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Leak Protection
								</h3>
								<p className="mt-2 text-gray-600">
									Double leak guards and elastic waistband
									ensure no mess escapes.
								</p>
							</div>

							<div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
								<div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
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
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Affordable Quality
								</h3>
								<p className="mt-2 text-gray-600">
									Premium quality at prices that won't break
									the bank for Kenyan families.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Testimonials */}
				<section className="py-12 md:py-16 bg-pink-50">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center text-center mb-10">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
								What{' '}
								<span className="text-pink-600">
									Parents Say
								</span>{' '}
								About Us
							</h2>
							<p className="mt-4 max-w-[600px] text-gray-600 md:text-xl/relaxed">
								Join thousands of happy Kenyan families who
								trust Boffo
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="bg-white rounded-3xl p-6 shadow-sm">
								<div className="flex items-center gap-1 text-amber-500 mb-4">
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
								</div>
								<p className="text-gray-600 italic">
									"As a first-time mom, I was overwhelmed with
									choices. Boffo diapers have been a
									lifesaver! No leaks, no rashes, and my baby
									sleeps through the night."
								</p>
								<div className="mt-6 flex items-center gap-3">
									<div className="h-12 w-12 rounded-full overflow-hidden relative">
										<img
											src="/placeholder.svg?height=100&width=100"
											alt="Sarah from Nairobi"
											// fill
											className="object-cover"
										/>
									</div>
									<div>
										<h4 className="font-bold">Sarah M.</h4>
										<p className="text-sm text-gray-500">
											Nairobi, Kenya
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-3xl p-6 shadow-sm">
								<div className="flex items-center gap-1 text-amber-500 mb-4">
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
								</div>
								<p className="text-gray-600 italic">
									"I've tried many brands, but Boffo gives the
									best value for money. The quality matches
									international brands at half the price. My
									twins are always comfortable!"
								</p>
								<div className="mt-6 flex items-center gap-3">
									<div className="h-12 w-12 rounded-full overflow-hidden relative">
										<img
											src="/placeholder.svg?height=100&width=100"
											alt="John from Mombasa"
											// fill
											className="object-cover"
										/>
									</div>
									<div>
										<h4 className="font-bold">John K.</h4>
										<p className="text-sm text-gray-500">
											Mombasa, Kenya
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-3xl p-6 shadow-sm">
								<div className="flex items-center gap-1 text-amber-500 mb-4">
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
								</div>
								<p className="text-gray-600 italic">
									"As a pediatric nurse, I'm very particular
									about what I recommend. Boffo diapers are
									the only local brand I trust for my patients
									and my own daughter."
								</p>
								<div className="mt-6 flex items-center gap-3">
									<div className="h-12 w-12 rounded-full overflow-hidden relative">
										<img
											src="/placeholder.svg?height=100&width=100"
											alt="Grace from Kisumu"
											// fill
											className="object-cover"
										/>
									</div>
									<div>
										<h4 className="font-bold">Grace O.</h4>
										<p className="text-sm text-gray-500">
											Kisumu, Kenya
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Instagram Gallery */}
				<section className="py-12 md:py-16 bg-white">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center text-center mb-10">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
								<span className="text-pink-600">
									#BoffoBaby
								</span>{' '}
								Moments
							</h2>
							<p className="mt-4 max-w-[600px] text-gray-600 md:text-xl/relaxed">
								Share your little one's Boffo moments with us on
								Instagram
							</p>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
								<div
									key={item}
									className="aspect-square rounded-2xl overflow-hidden relative group"
								>
									<img
										src={`/placeholder.svg?height=400&width=400&text=Baby+${item}`}
										alt={`Instagram post ${item}`}
										// fill
										className="object-cover transition-transform group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/20 transition-colors flex items-center justify-center">
										<svg
											className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
										</svg>
									</div>
								</div>
							))}
						</div>

						<div className="mt-8 text-center">
							<Link
								to="https://instagram.com"
								className="inline-flex items-center text-pink-600 font-medium"
							>
								Follow us on Instagram{' '}
								<ArrowRight className="ml-1 h-4 w-4" />
							</Link>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-12 md:py-16 bg-pink-600">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col lg:flex-row items-center gap-8">
							<div className="flex-1 text-center lg:text-left">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
									Ready to Experience the Boffo Difference?
								</h2>
								<p className="mt-4 text-pink-100 md:text-xl/relaxed max-w-[600px] mx-auto lg:mx-0">
									Join thousands of Kenyan parents who trust
									Boffo for their baby's comfort and health.
								</p>
								<div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
									<Button
										size="lg"
										className="bg-white text-pink-600 hover:bg-pink-50 rounded-full"
										asChild
									>
										<Link to="/products">
											Shop Now{' '}
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
									<Button
										size="lg"
										variant="outline"
										className="border-pink-300 text-white hover:bg-pink-500 rounded-full"
										asChild
									>
										<Link to="/retailers">
											Find in Stores
										</Link>
									</Button>
								</div>
							</div>
							<div className="flex-1 relative h-[300px] w-full lg:h-[400px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=800&width=800"
									alt="Happy baby with parents"
									// fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
