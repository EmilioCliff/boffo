import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
	ArrowRight,
	CheckCircle,
	Factory,
	Shield,
	Sparkles,
} from 'lucide-react';

export default function ManufacturingPage() {
	return (
		<main className="flex-1">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-pink-50 to-white py-16 md:py-24">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="space-y-4">
							<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
								Our Manufacturing Process
							</div>
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
								Made in Kenya with{' '}
								<span className="text-pink-600">
									Love and Care
								</span>
							</h1>
							<p className="text-gray-600 md:text-xl/relaxed">
								Take a peek behind the scenes at our
								state-of-the-art facility where we craft the
								perfect diapers for your little ones.
							</p>
						</div>
						<div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=1200"
								alt="Boffo manufacturing facility"
								// fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Our Facility */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Our Facility
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							State-of-the-Art Production
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Our Nairobi facility combines modern technology with
							strict quality control
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						<div className="relative h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=1200"
								alt="Boffo manufacturing equipment"
								// fill
								className="object-cover"
							/>
						</div>
						<div className="space-y-6">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
									<Factory className="h-6 w-6 text-pink-600" />
								</div>
								<div>
									<h3 className="text-xl font-bold mb-2">
										Modern Equipment
									</h3>
									<p className="text-gray-600">
										Our facility features the latest diaper
										manufacturing technology, imported from
										Germany and customized for our specific
										needs. This equipment allows us to
										produce up to 500,000 diapers daily with
										precision and consistency.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
									<Shield className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<h3 className="text-xl font-bold mb-2">
										Quality Control Lab
									</h3>
									<p className="text-gray-600">
										Our on-site laboratory conducts
										continuous testing throughout the
										production process. Every batch
										undergoes rigorous evaluation for
										absorption capacity, leak protection,
										and material safety before being
										approved for packaging.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
									<Sparkles className="h-6 w-6 text-green-600" />
								</div>
								<div>
									<h3 className="text-xl font-bold mb-2">
										Clean Room Environment
									</h3>
									<p className="text-gray-600">
										Our production area maintains strict
										cleanliness standards with HEPA-filtered
										air, regular sanitization, and proper
										staff protocols to ensure every diaper
										meets our hygiene requirements.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Manufacturing Process */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							The Process
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							From Raw Materials to Perfect Diapers
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Every Boffo diaper goes through a meticulous 6-step
							manufacturing process
						</p>
					</div>

					<div className="space-y-12">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Raw materials for diapers"
									// fill
									className="object-cover"
								/>
							</div>
							<div className="space-y-4">
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
									1
								</div>
								<h3 className="text-2xl font-bold">
									Raw Material Selection
								</h3>
								<p className="text-gray-600">
									We source the highest quality materials,
									including super-absorbent polymers, soft
									non-woven fabrics, elastic bands, and
									adhesive tapes. Each material undergoes
									testing before entering our production line.
								</p>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Hypoallergenic materials safe for
											sensitive skin
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Super-absorbent polymer core for
											maximum dryness
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Breathable outer layer to prevent
											heat and moisture buildup
										</span>
									</li>
								</ul>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="order-2 lg:order-1 space-y-4">
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
									2
								</div>
								<h3 className="text-2xl font-bold">
									Core Formation
								</h3>
								<p className="text-gray-600">
									The absorbent core is the heart of our
									diapers. We create a precise mixture of
									fluff pulp and super-absorbent polymers,
									distributed evenly to ensure maximum
									absorption throughout the diaper.
								</p>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Zoned absorption for targeted
											protection where needed most
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Quick-dry surface to keep moisture
											away from baby's skin
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Uniform distribution for consistent
											performance
										</span>
									</li>
								</ul>
							</div>
							<div className="order-1 lg:order-2 relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Diaper core formation"
									// fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Diaper assembly process"
									// fill
									className="object-cover"
								/>
							</div>
							<div className="space-y-4">
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
									3
								</div>
								<h3 className="text-2xl font-bold">
									Layer Assembly
								</h3>
								<p className="text-gray-600">
									Our automated assembly line brings together
									multiple layers: the soft inner lining,
									absorbent core, leak-proof barriers, and
									breathable outer cover. These layers are
									precisely aligned and bonded together.
								</p>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Soft inner layer that's gentle on
											baby's skin
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Waterproof but breathable outer
											layer
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Double leak guards along the legs
										</span>
									</li>
								</ul>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="order-2 lg:order-1 space-y-4">
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
									4
								</div>
								<h3 className="text-2xl font-bold">
									Shaping and Cutting
								</h3>
								<p className="text-gray-600">
									Each diaper is precisely cut to its specific
									size and shape. Our cutting machines create
									the ergonomic contours that ensure a
									comfortable fit around baby's legs and
									waist.
								</p>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Anatomically correct shape for
											different age groups
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Special umbilical cord cutout for
											newborn sizes
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Precision cutting for consistent
											quality
										</span>
									</li>
								</ul>
							</div>
							<div className="order-1 lg:order-2 relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Diaper cutting process"
									// fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Diaper quality testing"
									// fill
									className="object-cover"
								/>
							</div>
							<div className="space-y-4">
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
									5
								</div>
								<h3 className="text-2xl font-bold">
									Quality Testing
								</h3>
								<p className="text-gray-600">
									Every batch undergoes rigorous testing for
									absorption capacity, leak protection, and
									material safety. Our quality control team
									conducts both automated and manual
									inspections.
								</p>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Absorption rate and capacity testing
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Leak simulation under pressure and
											movement
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Material safety and allergen testing
										</span>
									</li>
								</ul>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="order-2 lg:order-1 space-y-4">
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
									6
								</div>
								<h3 className="text-2xl font-bold">
									Packaging and Distribution
								</h3>
								<p className="text-gray-600">
									Approved diapers are counted, compressed,
									and sealed in moisture-proof packaging to
									maintain freshness. Our logistics team
									ensures timely delivery to retailers across
									Kenya.
								</p>
								<ul className="space-y-2">
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Hygienic packaging process in clean
											room environment
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Moisture-proof packaging to maintain
											product integrity
										</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
										<span>
											Efficient distribution network
											across Kenya
										</span>
									</li>
								</ul>
							</div>
							<div className="order-1 lg:order-2 relative h-[300px] rounded-3xl overflow-hidden">
								<img
									src="/placeholder.svg?height=600&width=800"
									alt="Diaper packaging process"
									// fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Quality Testing */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 mb-4">
							Quality Assurance
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Rigorous Testing Standards
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Every Boffo diaper undergoes extensive testing to
							ensure it meets our high standards
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
										d="M19 14l-7 7m0 0l-7-7m7 7V3"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-4">
								Absorption Test
							</h3>
							<p className="text-gray-600 mb-4">
								We measure how quickly and how much liquid our
								diapers can absorb. Our diapers can hold up to
								30 times their weight in liquid while keeping
								the surface dry.
							</p>
							<div className="relative h-[200px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=400&width=600"
									alt="Absorption test demonstration"
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
										d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-4">
								Leakage Test
							</h3>
							<p className="text-gray-600 mb-4">
								We simulate real-world movement conditions to
								ensure our diapers stay secure during active
								play. Our triple-barrier system prevents leaks
								from all sides.
							</p>
							<div className="relative h-[200px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=400&width=600"
									alt="Leakage test demonstration"
									// fill
									className="object-cover"
								/>
							</div>
						</div>

						<div className="bg-green-50 rounded-3xl p-8">
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
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-4">
								Skin Safety Test
							</h3>
							<p className="text-gray-600 mb-4">
								All materials undergo dermatological testing to
								ensure they're hypoallergenic and safe for
								sensitive skin. We test for pH balance and
								potential irritants.
							</p>
							<div className="relative h-[200px] rounded-xl overflow-hidden">
								<img
									src="/placeholder.svg?height=400&width=600"
									alt="Skin safety test demonstration"
									// fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Sustainability */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
						<div className="space-y-4">
							<div className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
								Sustainability
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
								Our Commitment to the Environment
							</h2>
							<p className="text-gray-600 md:text-lg">
								While creating the best diapers for your baby,
								we're also mindful of our environmental impact.
								We're constantly working to make our
								manufacturing process more sustainable.
							</p>
							<ul className="space-y-4">
								<li className="flex items-start gap-4">
									<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
										<svg
											className="h-4 w-4 text-green-600"
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
									<div>
										<h3 className="font-bold">
											Reduced Carbon Footprint
										</h3>
										<p className="text-gray-600">
											By manufacturing locally, we reduce
											the carbon emissions associated with
											importing diapers from overseas.
										</p>
									</div>
								</li>
								<li className="flex items-start gap-4">
									<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
										<svg
											className="h-4 w-4 text-green-600"
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
									<div>
										<h3 className="font-bold">
											Water Conservation
										</h3>
										<p className="text-gray-600">
											Our facility implements water
											recycling systems that reduce our
											freshwater consumption by up to 40%.
										</p>
									</div>
								</li>
								<li className="flex items-start gap-4">
									<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
										<svg
											className="h-4 w-4 text-green-600"
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
									<div>
										<h3 className="font-bold">
											Waste Reduction
										</h3>
										<p className="text-gray-600">
											We've implemented processes to
											minimize manufacturing waste, with a
											goal of zero waste to landfill by
											2025.
										</p>
									</div>
								</li>
								<li className="flex items-start gap-4">
									<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
										<svg
											className="h-4 w-4 text-green-600"
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
									<div>
										<h3 className="font-bold">
											Research & Development
										</h3>
										<p className="text-gray-600">
											We're investing in research to
											develop more eco-friendly materials
											and biodegradable components for
											future products.
										</p>
									</div>
								</li>
							</ul>
						</div>
						<div className="relative h-[400px] rounded-3xl overflow-hidden">
							<img
								src="/placeholder.svg?height=800&width=800"
								alt="Sustainable manufacturing practices"
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
						Want to See Our Facility in Action?
					</h2>
					<p className="mx-auto max-w-[700px] text-pink-100 md:text-xl/relaxed mb-8">
						We offer tours for retailers, healthcare professionals,
						and interested partners
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-white text-pink-600 hover:bg-pink-50 rounded-full"
							asChild
						>
							<Link to="/contact">
								Schedule a Tour{' '}
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
