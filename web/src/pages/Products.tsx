import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export default function ProductsPage() {
	return (
		<main className="flex-1">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-pink-50 to-white py-16 md:py-24">
				<div className="container px-4 md:px-6">
					<div className="text-center max-w-[800px] mx-auto">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
							Products Made with{' '}
							<span className="text-pink-600">Love</span>
						</h1>
						<p className="mt-4 text-gray-600 md:text-xl/relaxed">
							Discover our range of baby diapers designed for
							comfort, protection, and happy babies
						</p>
					</div>
				</div>
			</section>

			{/* Product Categories */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="grid gap-12">
						{/* Newborn Series */}
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="relative h-[400px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=800&width=800"
									alt="Boffo Newborn Series"
									// fill
									className="object-cover"
								/>
								<div className="absolute top-4 right-4 bg-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full">
									BESTSELLER
								</div>
							</div>
							<div className="space-y-4">
								<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
									Newborn Series
								</div>
								<h2 className="text-3xl font-bold tracking-tighter">
									Extra Gentle for Delicate Skin
								</h2>
								<div className="flex items-center gap-1 text-amber-500">
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<span className="text-gray-600 ml-2">
										(243 reviews)
									</span>
								</div>
								<p className="text-gray-600 md:text-lg">
									Our Newborn Series is specially designed for
									your baby's first days. With an umbilical
									cord cutout, extra-soft materials, and
									gentle elastic, these diapers provide the
									perfect start for your little one.
								</p>
								<ul className="space-y-2">
									<li className="flex items-center gap-2">
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
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>
											Available in sizes 0-1 (up to 6kg)
										</span>
									</li>
									<li className="flex items-center gap-2">
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
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>
											Umbilical cord cutout for newborns
										</span>
									</li>
									<li className="flex items-center gap-2">
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
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>Wetness indicator</span>
									</li>
									<li className="flex items-center gap-2">
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
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>12-hour protection</span>
									</li>
								</ul>
								<div className="pt-4">
									<Button
										className="bg-pink-600 hover:bg-pink-700 text-white rounded-full"
										asChild
									>
										<Link to="/products/newborn">
											Learn More{' '}
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Standard Series */}
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="order-1 lg:order-2 relative h-[400px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=800&width=800"
									alt="Boffo Standard Series"
									// fill
									className="object-cover"
								/>
							</div>
							<div className="order-2 lg:order-1 space-y-4">
								<div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
									Standard Series
								</div>
								<h2 className="text-3xl font-bold tracking-tighter">
									All-Day Comfort for Active Babies
								</h2>
								<div className="flex items-center gap-1 text-amber-500">
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<span className="text-gray-600 ml-2">
										(387 reviews)
									</span>
								</div>
								<p className="text-gray-600 md:text-lg">
									Our most popular line, the Standard Series
									provides the perfect balance of comfort,
									protection, and value. Designed for everyday
									use with enhanced absorption and leak
									guards.
								</p>
								<ul className="space-y-2">
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-blue-600"
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
										<span>
											Available in sizes 2-5 (3-25kg)
										</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-blue-600"
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
										<span>Breathable outer layer</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-blue-600"
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
										<span>Double leak guards</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-blue-600"
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
										<span>16-hour protection</span>
									</li>
								</ul>
								<div className="pt-4">
									<Button
										className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
										asChild
									>
										<Link to="/products/standard">
											Learn More{' '}
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Premium Series */}
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="relative h-[400px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=800&width=800"
									alt="Boffo Premium Series"
									// fill
									className="object-cover"
								/>
								<div className="absolute top-4 right-4 bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
									NEW
								</div>
							</div>
							<div className="space-y-4">
								<div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
									Premium Series
								</div>
								<h2 className="text-3xl font-bold tracking-tighter">
									Ultimate Overnight Protection
								</h2>
								<div className="flex items-center gap-1 text-amber-500">
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<span className="text-gray-600 ml-2">
										(156 reviews)
									</span>
								</div>
								<p className="text-gray-600 md:text-lg">
									Our Premium Series offers maximum absorption
									for overnight use or heavy wetters. With our
									most advanced core technology and extra leak
									protection, these diapers ensure
									uninterrupted sleep.
								</p>
								<ul className="space-y-2">
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-purple-600"
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
										<span>
											Available in sizes 3-6 (5-30kg)
										</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-purple-600"
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
										<span>
											Ultra-absorbent core with quick-dry
											technology
										</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-purple-600"
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
										<span>
											Triple leak protection system
										</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-purple-600"
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
										<span>24-hour protection</span>
									</li>
								</ul>
								<div className="pt-4">
									<Button
										className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
										asChild
									>
										<Link to="/products/premium">
											Learn More{' '}
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Baby Wipes */}
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="order-1 lg:order-2 relative h-[400px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=800&width=800"
									alt="Boffo Baby Wipes"
									// fill
									className="object-cover"
								/>
								<div className="absolute top-4 right-4 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
									ECO-FRIENDLY
								</div>
							</div>
							<div className="order-2 lg:order-1 space-y-4">
								<div className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
									Baby Wipes
								</div>
								<h2 className="text-3xl font-bold tracking-tighter">
									Gentle Cleansing for Sensitive Skin
								</h2>
								<div className="flex items-center gap-1 text-amber-500">
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<Star className="fill-amber-500 h-5 w-5" />
									<span className="text-gray-600 ml-2">
										(92 reviews)
									</span>
								</div>
								<p className="text-gray-600 md:text-lg">
									Complete your baby care routine with our
									gentle, alcohol-free wipes. Made with 99%
									purified water and aloe vera, they cleanse
									and soothe your baby's delicate skin.
								</p>
								<ul className="space-y-2">
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-green-600"
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
										<span>
											Available in packs of 80 and 160
											wipes
										</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-green-600"
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
										<span>
											99% purified water with aloe vera
										</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-green-600"
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
										<span>
											Alcohol-free and hypoallergenic
										</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											className="h-5 w-5 text-green-600"
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
										<span>Biodegradable materials</span>
									</li>
								</ul>
								<div className="pt-4">
									<Button
										className="bg-green-600 hover:bg-green-700 text-white rounded-full"
										asChild
									>
										<Link to="/products/wipes">
											Learn More{' '}
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Size Guide */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Size Guide
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Find the perfect fit for your little one
						</p>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
							<thead className="bg-pink-100">
								<tr>
									<th className="px-6 py-4 text-left text-sm font-bold text-pink-800">
										Size
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-pink-800">
										Weight Range
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-pink-800">
										Age (Approx.)
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-pink-800">
										Available In
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								<tr>
									<td className="px-6 py-4 text-sm">
										Newborn (Size 0)
									</td>
									<td className="px-6 py-4 text-sm">
										Up to 3kg
									</td>
									<td className="px-6 py-4 text-sm">
										Premature - 1 month
									</td>
									<td className="px-6 py-4 text-sm">
										Newborn Series
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 text-sm">
										Size 1
									</td>
									<td className="px-6 py-4 text-sm">2-5kg</td>
									<td className="px-6 py-4 text-sm">
										0-3 months
									</td>
									<td className="px-6 py-4 text-sm">
										Newborn Series
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 text-sm">
										Size 2
									</td>
									<td className="px-6 py-4 text-sm">3-8kg</td>
									<td className="px-6 py-4 text-sm">
										2-6 months
									</td>
									<td className="px-6 py-4 text-sm">
										Standard Series
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 text-sm">
										Size 3
									</td>
									<td className="px-6 py-4 text-sm">
										5-10kg
									</td>
									<td className="px-6 py-4 text-sm">
										3-12 months
									</td>
									<td className="px-6 py-4 text-sm">
										Standard, Premium Series
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 text-sm">
										Size 4
									</td>
									<td className="px-6 py-4 text-sm">
										8-16kg
									</td>
									<td className="px-6 py-4 text-sm">
										9-24 months
									</td>
									<td className="px-6 py-4 text-sm">
										Standard, Premium Series
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 text-sm">
										Size 5
									</td>
									<td className="px-6 py-4 text-sm">
										12-22kg
									</td>
									<td className="px-6 py-4 text-sm">
										18-36 months
									</td>
									<td className="px-6 py-4 text-sm">
										Standard, Premium Series
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 text-sm">
										Size 6
									</td>
									<td className="px-6 py-4 text-sm">
										16-30kg
									</td>
									<td className="px-6 py-4 text-sm">
										3+ years
									</td>
									<td className="px-6 py-4 text-sm">
										Premium Series
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="mt-8 text-center">
						<p className="text-gray-600">
							Not sure which size to choose? Our size calculator
							can help you find the perfect fit.
						</p>
						<Button
							className="mt-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full"
							asChild
						>
							<Link to="/size-calculator">Size Calculator</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							What Parents Say About Our Products
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Real reviews from real Kenyan families
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="bg-pink-50 rounded-3xl p-6">
							<div className="flex items-center gap-1 text-amber-500 mb-4">
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
							</div>
							<p className="text-gray-600 italic">
								"The Newborn Series was perfect for my premature
								baby. So soft and the umbilical cutout was a
								lifesaver. We've now moved to the Standard
								Series and love them just as much!"
							</p>
							<div className="mt-6 flex items-center gap-3">
								<div className="h-12 w-12 rounded-full overflow-hidden relative">
									<img
										src="/placeholder.svg?height=100&width=100"
										alt="Jane from Nairobi"
										// fill
										className="object-cover"
									/>
								</div>
								<div>
									<h4 className="font-bold">Jane W.</h4>
									<p className="text-sm text-gray-500">
										Nairobi, Kenya
									</p>
								</div>
							</div>
						</div>

						<div className="bg-blue-50 rounded-3xl p-6">
							<div className="flex items-center gap-1 text-amber-500 mb-4">
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
							</div>
							<p className="text-gray-600 italic">
								"As a father of twins, I appreciate the value
								Boffo provides. The Standard Series keeps both
								my babies dry all day, and I don't have to break
								the bank buying imported brands."
							</p>
							<div className="mt-6 flex items-center gap-3">
								<div className="h-12 w-12 rounded-full overflow-hidden relative">
									<img
										src="/placeholder.svg?height=100&width=100"
										alt="Michael from Kisumu"
										// fill
										className="object-cover"
									/>
								</div>
								<div>
									<h4 className="font-bold">Michael O.</h4>
									<p className="text-sm text-gray-500">
										Kisumu, Kenya
									</p>
								</div>
							</div>
						</div>

						<div className="bg-purple-50 rounded-3xl p-6">
							<div className="flex items-center gap-1 text-amber-500 mb-4">
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
								<Star className="fill-amber-500 h-5 w-5" />
							</div>
							<p className="text-gray-600 italic">
								"The Premium Series is a game-changer for
								nighttime! My heavy wetter used to wake up
								soaked, but now we all sleep through the night.
								Worth every shilling!"
							</p>
							<div className="mt-6 flex items-center gap-3">
								<div className="h-12 w-12 rounded-full overflow-hidden relative">
									<img
										src="/placeholder.svg?height=100&width=100"
										alt="Esther from Mombasa"
										// fill
										className="object-cover"
									/>
								</div>
								<div>
									<h4 className="font-bold">Esther K.</h4>
									<p className="text-sm text-gray-500">
										Mombasa, Kenya
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 md:py-24 bg-pink-600">
				<div className="container px-4 md:px-6 text-center">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
						Ready to Try Boffo?
					</h2>
					<p className="mx-auto max-w-[700px] text-pink-100 md:text-xl/relaxed mb-8">
						Join thousands of Kenyan families who trust Boffo for
						their baby's comfort
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-white text-pink-600 hover:bg-pink-50 rounded-full"
							asChild
						>
							<Link to="/retailers">
								Find in Stores{' '}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-pink-300 text-white hover:bg-pink-500 rounded-full"
							asChild
						>
							<Link to="/contact">Request Samples</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
