import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield } from 'lucide-react';

export default function AboutPage() {
	return (
		<main className="flex-1">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-pink-50 to-white py-16 md:py-24">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="space-y-4">
							<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
								Our Story
							</div>
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
								Made in Kenya,{' '}
								<span className="text-pink-600">
									For Kenyan Babies
								</span>
							</h1>
							<p className="text-gray-600 md:text-xl/relaxed">
								Founded in 2020, Boffo Baby Diapers was born
								from a simple idea: Kenyan babies deserve
								high-quality, affordable diapers made right here
								at home.
							</p>
						</div>
						<div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=1200"
								alt="Boffo Baby Diapers factory"
								// fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Our Mission */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="order-2 lg:order-1 relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=1200"
								alt="Happy Kenyan baby"
								// fill
								className="object-cover"
							/>
						</div>
						<div className="order-1 lg:order-2 space-y-4">
							<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
								Our Mission
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Comfort, Quality, and Affordability
							</h2>
							<p className="text-gray-600 md:text-xl/relaxed">
								At Boffo Baby, our mission is simple: to provide
								every Kenyan family with access to high-quality
								baby care products that don't break the bank.
							</p>
							<p className="text-gray-600">
								We believe that premium baby care shouldn't be a
								luxury. By manufacturing locally and focusing on
								what truly matters—comfort, protection, and
								reliability—we're able to offer world-class
								diapers at prices that work for Kenyan families.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Our Values */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Our Values
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							What Drives Us Every Day
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							These core principles guide everything we do at
							Boffo Baby Diapers
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						<div className="bg-white rounded-3xl p-8 shadow-sm">
							<div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
								<Heart className="h-6 w-6 text-pink-600" />
							</div>
							<h3 className="text-xl font-bold mb-2">
								Baby Comfort First
							</h3>
							<p className="text-gray-600">
								We obsess over every detail that affects your
								baby's comfort, from the softness of our
								materials to the perfect fit that prevents leaks
								and allows freedom of movement.
							</p>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-sm">
							<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
								<Shield className="h-6 w-6 text-blue-600" />
							</div>
							<h3 className="text-xl font-bold mb-2">
								Quality Without Compromise
							</h3>
							<p className="text-gray-600">
								We never cut corners. Our rigorous testing
								ensures that every Boffo diaper meets
								international standards for absorption, leak
								protection, and skin safety.
							</p>
						</div>

						<div className="bg-white rounded-3xl p-8 shadow-sm">
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
										d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-2">
								Proudly Kenyan
							</h3>
							<p className="text-gray-600">
								By manufacturing in Kenya, we create local jobs,
								reduce our carbon footprint, and ensure our
								products are designed specifically for Kenyan
								babies and families.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Our Team */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Our Team
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Meet the People Behind Boffo
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							A dedicated team of professionals passionate about
							baby care
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						{[
							{
								name: 'Sarah Mwangi',
								role: 'Founder & CEO',
								image: '/placeholder.svg?height=400&width=400',
							},
							{
								name: 'David Ochieng',
								role: 'Head of Production',
								image: '/placeholder.svg?height=400&width=400',
							},
							{
								name: 'Grace Kimani',
								role: 'Quality Control Manager',
								image: '/placeholder.svg?height=400&width=400',
							},
							{
								name: 'John Kamau',
								role: 'Marketing Director',
								image: '/placeholder.svg?height=400&width=400',
							},
						].map((person, index) => (
							<div key={index} className="text-center">
								<div className="relative h-[250px] w-[250px] mx-auto rounded-full overflow-hidden mb-4">
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
								<p className="text-gray-600">{person.role}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Our Journey */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Our Journey
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							From Idea to Kenya's Favorite Diaper
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							The story of how Boffo Baby Diapers came to be
						</p>
					</div>

					<div className="space-y-12">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Boffo Baby beginnings"
									// fill
									className="object-cover"
								/>
							</div>
							<div className="space-y-4">
								<div className="inline-block rounded-full bg-pink-600 px-3 py-1 text-sm font-medium text-white">
									2020
								</div>
								<h3 className="text-2xl font-bold">
									The Beginning
								</h3>
								<p className="text-gray-600">
									After struggling to find affordable,
									high-quality diapers for her own child, our
									founder Sarah Mwangi identified a gap in the
									Kenyan market. With a background in textile
									engineering, she began researching diaper
									manufacturing and assembled a small team of
									experts.
								</p>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="order-2 lg:order-1 space-y-4">
								<div className="inline-block rounded-full bg-pink-600 px-3 py-1 text-sm font-medium text-white">
									2021
								</div>
								<h3 className="text-2xl font-bold">
									First Production Line
								</h3>
								<p className="text-gray-600">
									With initial funding secured, we established
									our first production line in Nairobi's
									Industrial Area. After months of testing and
									refinement, the first Boffo Baby diapers hit
									store shelves in select Nairobi
									supermarkets.
								</p>
							</div>
							<div className="order-1 lg:order-2 relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Boffo Baby first production line"
									// fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Boffo Baby expansion"
									// fill
									className="object-cover"
								/>
							</div>
							<div className="space-y-4">
								<div className="inline-block rounded-full bg-pink-600 px-3 py-1 text-sm font-medium text-white">
									2022-2023
								</div>
								<h3 className="text-2xl font-bold">
									Growth and Recognition
								</h3>
								<p className="text-gray-600">
									Word spread quickly about our quality and
									affordability. We expanded distribution
									across Kenya and introduced our Premium
									line. In 2023, Boffo was recognized as
									"Kenya's Most Promising Brand" at the East
									African Business Excellence Awards.
								</p>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="order-2 lg:order-1 space-y-4">
								<div className="inline-block rounded-full bg-pink-600 px-3 py-1 text-sm font-medium text-white">
									Today
								</div>
								<h3 className="text-2xl font-bold">
									Looking to the Future
								</h3>
								<p className="text-gray-600">
									Today, Boffo Baby Diapers can be found in
									stores throughout Kenya and is beginning to
									expand into neighboring East African
									countries. We're constantly innovating, with
									plans to launch new baby care products while
									maintaining our commitment to quality,
									affordability, and local manufacturing.
								</p>
							</div>
							<div className="order-1 lg:order-2 relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Boffo Baby today"
									// fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 md:py-24 bg-pink-600">
				<div className="container px-4 md:px-6 text-center">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
						Join the Boffo Family
					</h2>
					<p className="mx-auto max-w-[700px] text-pink-100 md:text-xl/relaxed mb-8">
						Experience the difference that thousands of Kenyan
						families already trust
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-white text-pink-600 hover:bg-pink-50 rounded-full"
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
							className="border-pink-300 text-white hover:bg-pink-500 rounded-full"
							asChild
						>
							<Link to="/contact">Contact Us</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
