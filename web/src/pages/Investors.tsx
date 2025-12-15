import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
	ArrowRight,
	BarChart3,
	CheckCircle,
	Globe,
	TrendingUp,
} from 'lucide-react';

export default function InvestorsPage() {
	return (
		<main className="flex-1">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-pink-50 to-white py-16 md:py-24">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="space-y-4">
							<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
								For Investors
							</div>
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
								Invest in{' '}
								<span className="text-pink-600">
									Kenya's Growing
								</span>{' '}
								Baby Care Market
							</h1>
							<p className="text-gray-600 md:text-xl/relaxed">
								Join us in our mission to provide high-quality,
								affordable diapers to families across East
								Africa while generating attractive returns for
								our investors.
							</p>
						</div>
						<div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=1200"
								alt="Boffo Baby Diapers manufacturing facility"
								// fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Market Opportunity */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Market Opportunity
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							A Growing Market with Huge Potential
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Kenya's diaper market is experiencing rapid growth,
							creating an exceptional investment opportunity
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="bg-pink-50 rounded-3xl p-8">
							<div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
								<BarChart3 className="h-6 w-6 text-pink-600" />
							</div>
							<h3 className="text-xl font-bold mb-4">
								8.5% Annual Growth
							</h3>
							<p className="text-gray-600 mb-4">
								Kenya's diaper market is growing at 8.5%
								annually, outpacing many other consumer goods
								categories and creating significant opportunity
								for established local manufacturers.
							</p>
							<div className="relative h-[150px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=300&width=400&text=Market+Growth+Chart"
									alt="Market growth chart"
									// fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="bg-blue-50 rounded-3xl p-8">
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
							<h3 className="text-xl font-bold mb-4">
								1.2 Million Babies Annually
							</h3>
							<p className="text-gray-600 mb-4">
								With approximately 1.2 million babies born in
								Kenya each year, there is a consistent and
								growing demand for high-quality, affordable
								diapers.
							</p>
							<div className="relative h-[150px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=300&width=400&text=Population+Demographics"
									alt="Population demographics"
									// fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="bg-green-50 rounded-3xl p-8">
							<div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
								<TrendingUp className="h-6 w-6 text-green-600" />
							</div>
							<h3 className="text-xl font-bold mb-4">
								Growing Middle Class
							</h3>
							<p className="text-gray-600 mb-4">
								Kenya's expanding middle class has increasing
								disposable income and is willing to spend more
								on quality baby care products, driving market
								growth.
							</p>
							<div className="relative h-[150px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=300&width=400&text=Income+Trends"
									alt="Income trends"
									// fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Our Growth Story */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Our Growth Story
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							From Startup to Market Leader
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Boffo Baby Diapers has experienced remarkable growth
							since our founding in 2020
						</p>
					</div>

					<div className="relative">
						<div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-pink-200 hidden md:block"></div>
						<div className="space-y-12">
							<div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center relative">
								<div className="md:text-right space-y-4">
									<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold md:ml-auto">
										2020
									</div>
									<h3 className="text-2xl font-bold">
										Launch & Initial Growth
									</h3>
									<p className="text-gray-600">
										Founded with an initial investment of
										$500,000, we launched our first
										production line with a capacity of
										100,000 diapers per day, serving the
										Nairobi market.
									</p>
									<ul className="space-y-2">
										<li className="flex items-start gap-2 md:flex-row-reverse md:text-right">
											<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<span>
												First year revenue: $1.2 million
											</span>
										</li>
										<li className="flex items-start gap-2 md:flex-row-reverse md:text-right">
											<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<span>
												Distribution in 200+ retail
												locations
											</span>
										</li>
									</ul>
								</div>
								<div className="relative h-[250px] rounded-3xl overflow-hidden md:order-first">
									<img
										src="/placeholder.svg?height=500&width=800"
										alt="Boffo Baby launch"
										// fill
										className="object-cover"
									/>
								</div>
								<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pink-100 rounded-full border-4 border-white flex items-center justify-center hidden md:flex">
									<div className="w-6 h-6 bg-pink-600 rounded-full"></div>
								</div>
							</div>

							<div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center relative">
								<div className="space-y-4">
									<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
										2021
									</div>
									<h3 className="text-2xl font-bold">
										Expansion & Product Development
									</h3>
									<p className="text-gray-600">
										Secured an additional $1.5 million in
										funding to expand production capacity
										and develop our Premium line of diapers.
										Expanded distribution to major cities
										across Kenya.
									</p>
									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<span>
												Revenue growth: 120%
												year-over-year
											</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<span>
												Distribution expanded to 500+
												retail locations
											</span>
										</li>
									</ul>
								</div>
								<div className="relative h-[250px] rounded-3xl overflow-hidden">
									<img
										src="/placeholder.svg?height=500&width=800"
										alt="Boffo Baby expansion"
										// fill
										className="object-cover"
									/>
								</div>
								<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pink-100 rounded-full border-4 border-white flex items-center justify-center hidden md:flex">
									<div className="w-6 h-6 bg-pink-600 rounded-full"></div>
								</div>
							</div>

							<div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center relative">
								<div className="md:text-right space-y-4">
									<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold md:ml-auto">
										2022
									</div>
									<h3 className="text-2xl font-bold">
										Market Leadership & Recognition
									</h3>
									<p className="text-gray-600">
										Achieved market leadership in the
										mid-price segment. Launched our baby
										wipes product line and received "Kenya's
										Most Promising Brand" award.
									</p>
									<ul className="space-y-2">
										<li className="flex items-start gap-2 md:flex-row-reverse md:text-right">
											<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<span>Revenue: $5.8 million</span>
										</li>
										<li className="flex items-start gap-2 md:flex-row-reverse md:text-right">
											<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<span>
												Market share: 18% of Kenyan
												diaper market
											</span>
										</li>
									</ul>
								</div>
								<div className="relative h-[250px] rounded-3xl overflow-hidden md:order-first">
									<img
										src="/placeholder.svg?height=500&width=800"
										alt="Boffo Baby award"
										// fill
										className="object-cover"
									/>
								</div>
								<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pink-100 rounded-full border-4 border-white flex items-center justify-center hidden md:flex">
									<div className="w-6 h-6 bg-pink-600 rounded-full"></div>
								</div>
							</div>

							<div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center relative">
								<div className="space-y-4">
									<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
										2023
									</div>
									<h3 className="text-2xl font-bold">
										Regional Expansion
									</h3>
									<p className="text-gray-600">
										Began exports to Uganda and Tanzania.
										Expanded production capacity to 500,000
										diapers per day. Launched e-commerce
										platform for direct-to-consumer sales.
									</p>
									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<span>Revenue: $9.2 million</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
											<span>
												Distribution in 1,200+ retail
												locations across East Africa
											</span>
										</li>
									</ul>
								</div>
								<div className="relative h-[250px] rounded-3xl overflow-hidden">
									<img
										src="/placeholder.svg?height=500&width=800"
										alt="Boffo Baby regional expansion"
										// fill
										className="object-cover"
									/>
								</div>
								<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pink-100 rounded-full border-4 border-white flex items-center justify-center hidden md:flex">
									<div className="w-6 h-6 bg-pink-600 rounded-full"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Investment Opportunity */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="space-y-4">
							<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
								Investment Opportunity
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Why Invest in Boffo Baby Diapers?
							</h2>
							<p className="text-gray-600 md:text-lg">
								We're seeking strategic investors to fuel our
								next phase of growth as we expand across East
								Africa and develop new product lines.
							</p>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="bg-pink-50 rounded-2xl p-4">
									<div className="flex items-center gap-2 mb-2">
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
												d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
											/>
										</svg>
										<h3 className="font-bold">
											Strong Financial Performance
										</h3>
									</div>
									<p className="text-sm text-gray-600">
										Consistent revenue growth and
										profitability since our second year of
										operations.
									</p>
								</div>
								<div className="bg-blue-50 rounded-2xl p-4">
									<div className="flex items-center gap-2 mb-2">
										<Globe className="h-5 w-5 text-blue-600" />
										<h3 className="font-bold">
											Expanding Market
										</h3>
									</div>
									<p className="text-sm text-gray-600">
										The East African diaper market is
										projected to grow at 8-10% annually for
										the next decade.
									</p>
								</div>
								<div className="bg-green-50 rounded-2xl p-4">
									<div className="flex items-center gap-2 mb-2">
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
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										</svg>
										<h3 className="font-bold">
											Established Brand
										</h3>
									</div>
									<p className="text-sm text-gray-600">
										Strong brand recognition and customer
										loyalty in the Kenyan market.
									</p>
								</div>
								<div className="bg-purple-50 rounded-2xl p-4">
									<div className="flex items-center gap-2 mb-2">
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
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
										<h3 className="font-bold">
											Operational Excellence
										</h3>
									</div>
									<p className="text-sm text-gray-600">
										Modern manufacturing facility with room
										for expansion and efficient operations.
									</p>
								</div>
							</div>
						</div>
						<div className="relative h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=800"
								alt="Boffo Baby investment opportunity"
								// fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Future Plans */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Future Plans
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Our Vision for the Future
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							With your investment, we plan to accelerate our
							growth and expansion
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="bg-white rounded-3xl p-8 shadow-sm">
							<div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
								<Globe className="h-6 w-6 text-pink-600" />
							</div>
							<h3 className="text-xl font-bold mb-4">
								Pan-African Expansion
							</h3>
							<p className="text-gray-600 mb-4">
								We plan to expand our distribution network to 10
								countries across East and Central Africa by
								2026, establishing Boffo as a leading regional
								brand.
							</p>
							<div className="relative h-[150px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=300&width=400&text=African+Map"
									alt="African expansion map"
									// fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-sm">
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
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-4">
								Product Line Expansion
							</h3>
							<p className="text-gray-600 mb-4">
								We're developing a comprehensive baby care line
								including baby lotion, powder, and bath products
								to complement our core diaper business.
							</p>
							<div className="relative h-[150px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=300&width=400&text=Product+Range"
									alt="Product range"
									// fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-sm">
							<div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
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
										d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-4">
								Sustainable Manufacturing
							</h3>
							<p className="text-gray-600 mb-4">
								We're investing in eco-friendly materials and
								manufacturing processes, with a goal to launch
								our first biodegradable diaper line by 2025.
							</p>
							<div className="relative h-[150px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=300&width=400&text=Eco+Friendly"
									alt="Eco-friendly manufacturing"
									// fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Financial Highlights */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Financial Highlights
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Strong Growth & Performance
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Our financial track record demonstrates consistent
							growth and profitability
						</p>
					</div>

					<div className="relative h-[400px] rounded-3xl overflow-hidden mb-8">
						<img
							src="/placeholder.svg?height=800&width=1600&text=Financial+Performance+Chart"
							alt="Financial performance chart"
							// fill
							className="object-cover"
						/>
					</div>

					<div className="grid gap-8 md:grid-cols-4">
						<div className="bg-pink-50 rounded-3xl p-6 text-center">
							<h3 className="text-3xl font-bold text-pink-600 mb-2">
								$9.2M
							</h3>
							<p className="text-gray-600">2023 Revenue</p>
						</div>
						<div className="bg-blue-50 rounded-3xl p-6 text-center">
							<h3 className="text-3xl font-bold text-blue-600 mb-2">
								58%
							</h3>
							<p className="text-gray-600">
								Year-over-Year Growth
							</p>
						</div>
						<div className="bg-green-50 rounded-3xl p-6 text-center">
							<h3 className="text-3xl font-bold text-green-600 mb-2">
								22%
							</h3>
							<p className="text-gray-600">Profit Margin</p>
						</div>
						<div className="bg-purple-50 rounded-3xl p-6 text-center">
							<h3 className="text-3xl font-bold text-purple-600 mb-2">
								18%
							</h3>
							<p className="text-gray-600">
								Market Share in Kenya
							</p>
						</div>
					</div>

					<div className="mt-8 text-center">
						<p className="text-gray-600 mb-4">
							For detailed financial information and our
							investment prospectus, please contact our investor
							relations team.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 md:py-24 bg-pink-600">
				<div className="container px-4 md:px-6 text-center">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
						Ready to Explore Investment Opportunities?
					</h2>
					<p className="mx-auto max-w-[700px] text-pink-100 md:text-xl/relaxed mb-8">
						Join us in our mission to provide high-quality,
						affordable diapers to families across East Africa
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-white text-pink-600 hover:bg-pink-50 rounded-full"
							asChild
						>
							<Link to="/contact">
								Request Investor Prospectus{' '}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-pink-300 text-white hover:bg-pink-500 rounded-full"
							asChild
						>
							<Link to="/contact">Schedule a Meeting</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Leadership Team
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Meet Our Executive Team
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Experienced professionals with a passion for
							innovation and growth
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-4">
						{[
							{
								name: 'Sarah Mwangi',
								role: 'Founder & CEO',
								bio: 'Former textile engineer with 15 years of experience in consumer goods manufacturing',
								image: '/placeholder.svg?height=400&width=400',
							},
							{
								name: 'David Ochieng',
								role: 'Chief Operations Officer',
								bio: '20+ years in manufacturing operations across East Africa',
								image: '/placeholder.svg?height=400&width=400',
							},
							{
								name: 'Grace Kimani',
								role: 'Chief Financial Officer',
								bio: 'Former investment banker with expertise in growth financing',
								image: '/placeholder.svg?height=400&width=400',
							},
							{
								name: 'John Kamau',
								role: 'Chief Marketing Officer',
								bio: 'Consumer goods marketing expert with regional experience',
								image: '/placeholder.svg?height=400&width=400',
							},
						].map((person, index) => (
							<div
								key={index}
								className="bg-pink-50 rounded-3xl p-6 text-center"
							>
								<div className="relative h-[200px] w-[200px] mx-auto rounded-full overflow-hidden mb-4">
									<img
										src={person.image || '/placeholder.svg'}
										alt={person.name}
										// fill
										className="object-cover"
									/>
								</div>
								<h3 className="text-xl font-bold">
									{person.name}
								</h3>
								<p className="text-pink-600 font-medium mb-2">
									{person.role}
								</p>
								<p className="text-gray-600 text-sm">
									{person.bio}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Investor FAQ
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Common Questions
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Answers to frequently asked questions from potential
							investors
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:gap-12">
						<div className="space-y-6">
							<div className="bg-white rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									What investment opportunities are currently
									available?
								</h3>
								<p className="text-gray-600">
									We're currently raising Series B funding to
									support our regional expansion and product
									line development. Minimum investment is
									$250,000 with both equity and convertible
									note options available.
								</p>
							</div>

							<div className="bg-white rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									What is your expected return on investment?
								</h3>
								<p className="text-gray-600">
									Based on our growth projections and industry
									comparables, we anticipate providing
									investors with returns of 20-25% annually
									over a 5-year horizon.
								</p>
							</div>

							<div className="bg-white rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									Do you have plans for an exit strategy?
								</h3>
								<p className="text-gray-600">
									We're building Boffo with a long-term
									vision, but potential exit strategies
									include acquisition by a multinational
									consumer goods company or an IPO on the
									Nairobi Securities Exchange within 5-7
									years.
								</p>
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-white rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									What are the main risks associated with
									investing?
								</h3>
								<p className="text-gray-600">
									Key risks include regional economic
									fluctuations, currency volatility,
									competitive pressures from multinational
									brands, and regulatory changes. Our
									prospectus provides a detailed risk
									assessment and mitigation strategies.
								</p>
							</div>

							<div className="bg-white rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									How is the investment structured?
								</h3>
								<p className="text-gray-600">
									We offer both equity shares and convertible
									notes. Investors receive quarterly financial
									reports, annual in-person briefings, and
									board representation for investments above
									certain thresholds.
								</p>
							</div>

							<div className="bg-white rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									What makes Boffo different from competitors?
								</h3>
								<p className="text-gray-600">
									Our competitive advantage lies in our local
									manufacturing (reducing costs and import
									dependencies), deep understanding of East
									African consumer needs, and our ability to
									rapidly innovate and adapt to market
									changes.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
