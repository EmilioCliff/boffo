import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Twitter,
} from 'lucide-react';

export default function ContactPage() {
	return (
		<main className="flex-1">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-pink-50 to-white py-16 md:py-24">
				<div className="container px-4 md:px-6">
					<div className="text-center max-w-[800px] mx-auto">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
							Get in <span className="text-pink-600">Touch</span>{' '}
							With Us
						</h1>
						<p className="mt-4 text-gray-600 md:text-xl/relaxed">
							We'd love to hear from you! Whether you have
							questions about our products, want to become a
							retailer, or just want to say hello.
						</p>
					</div>
				</div>
			</section>

			{/* Contact Information */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="grid gap-8 lg:grid-cols-2">
						<div className="space-y-8">
							<div>
								<h2 className="text-3xl font-bold tracking-tighter mb-6">
									Contact Information
								</h2>
								<p className="text-gray-600 md:text-lg mb-8">
									Our team is here to help you with any
									questions or concerns. Reach out to us
									through any of these channels:
								</p>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
									<Phone className="h-6 w-6 text-pink-600" />
								</div>
								<div>
									<h3 className="text-xl font-bold">Phone</h3>
									<p className="text-gray-600 mt-2">
										Customer Service:{' '}
										<a
											href="tel:+254700000000"
											className="text-pink-600 hover:underline"
										>
											+254 700 000 000
										</a>
										<br />
										Business Inquiries:{' '}
										<a
											href="tel:+254711111111"
											className="text-pink-600 hover:underline"
										>
											+254 711 111 111
										</a>
									</p>
									<p className="text-sm text-gray-500 mt-1">
										Monday-Friday, 8am-5pm EAT
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
									<Mail className="h-6 w-6 text-pink-600" />
								</div>
								<div>
									<h3 className="text-xl font-bold">Email</h3>
									<p className="text-gray-600 mt-2">
										Customer Support:{' '}
										<a
											href="mailto:support@boffobaby.co.ke"
											className="text-pink-600 hover:underline"
										>
											support@boffobaby.co.ke
										</a>
										<br />
										Sales & Distribution:{' '}
										<a
											href="mailto:sales@boffobaby.co.ke"
											className="text-pink-600 hover:underline"
										>
											sales@boffobaby.co.ke
										</a>
										<br />
										Media Inquiries:{' '}
										<a
											href="mailto:media@boffobaby.co.ke"
											className="text-pink-600 hover:underline"
										>
											media@boffobaby.co.ke
										</a>
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
									<MapPin className="h-6 w-6 text-pink-600" />
								</div>
								<div>
									<h3 className="text-xl font-bold">
										Location
									</h3>
									<p className="text-gray-600 mt-2">
										Boffo Baby Diapers Ltd.
										<br />
										Industrial Area, Enterprise Road
										<br />
										Nairobi, Kenya
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
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
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-xl font-bold">
										Social Media
									</h3>
									<p className="text-gray-600 mt-2">
										Connect with us on social media for the
										latest updates, promotions, and baby
										care tips.
									</p>
									<div className="flex gap-4 mt-4">
										<Link
											to="https://facebook.com"
											className="text-gray-600 hover:text-pink-600 transition-colors"
										>
											<Facebook className="h-6 w-6" />
											<span className="sr-only">
												Facebook
											</span>
										</Link>
										<Link
											to="https://instagram.com"
											className="text-gray-600 hover:text-pink-600 transition-colors"
										>
											<Instagram className="h-6 w-6" />
											<span className="sr-only">
												Instagram
											</span>
										</Link>
										<Link
											to="https://twitter.com"
											className="text-gray-600 hover:text-pink-600 transition-colors"
										>
											<Twitter className="h-6 w-6" />
											<span className="sr-only">
												Twitter
											</span>
										</Link>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-pink-50 rounded-3xl p-8">
							<h2 className="text-2xl font-bold mb-6">
								Send Us a Message
							</h2>
							<form className="space-y-6">
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium mb-2"
										>
											Your Name
										</label>
										<Input
											id="name"
											placeholder="John Doe"
											required
										/>
									</div>
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium mb-2"
										>
											Email Address
										</label>
										<Input
											id="email"
											type="email"
											placeholder="john@example.com"
											required
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="phone"
										className="block text-sm font-medium mb-2"
									>
										Phone Number
									</label>
									<Input
										id="phone"
										placeholder="+254 700 000 000"
									/>
								</div>

								<div>
									<label
										htmlFor="subject"
										className="block text-sm font-medium mb-2"
									>
										Subject
									</label>
									<select
										id="subject"
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										required
									>
										<option value="">Please select</option>
										<option value="product">
											Product Inquiry
										</option>
										<option value="retailer">
											Become a Retailer
										</option>
										<option value="distributor">
											Become a Distributor
										</option>
										<option value="feedback">
											Product Feedback
										</option>
										<option value="support">
											Customer Support
										</option>
										<option value="other">Other</option>
									</select>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium mb-2"
									>
										Your Message
									</label>
									<textarea
										id="message"
										rows={5}
										className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="How can we help you?"
										required
									></textarea>
								</div>

								<Button
									type="submit"
									className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full"
								>
									Send Message
								</Button>
							</form>
						</div>
					</div>
				</div>
			</section>

			{/* Map Section */}
			<section className="py-16 md:py-24 bg-pink-50">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Visit Our Facility
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							We offer tours of our manufacturing facility for
							retailers, healthcare professionals, and interested
							partners
						</p>
					</div>

					<div className="relative h-[400px] rounded-3xl overflow-hidden">
						<img
							src="/placeholder.svg?height=800&width=1600&text=Map+Location"
							alt="Map location of Boffo Baby Diapers"
							// fill
							className="object-cover"
						/>
					</div>

					<div className="mt-8 text-center">
						<Button
							className="bg-pink-600 hover:bg-pink-700 text-white rounded-full"
							asChild
						>
							<Link to="/contact">Schedule a Tour</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-16 md:py-24 bg-white">
				<div className="container px-4 md:px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Frequently Asked Questions
						</h2>
						<p className="mt-4 mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed">
							Find quick answers to common questions
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:gap-12">
						<div className="space-y-6">
							<div className="bg-pink-50 rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									Where can I buy Boffo Baby Diapers?
								</h3>
								<p className="text-gray-600">
									Boffo Baby Diapers are available in major
									supermarkets, baby shops, and pharmacies
									across Kenya. Check our Retailers page for a
									store locator.
								</p>
							</div>

							<div className="bg-pink-50 rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									How do I know which size is right for my
									baby?
								</h3>
								<p className="text-gray-600">
									Our sizing is based on your baby's weight.
									Check our size guide on the Products page or
									use our Size Calculator tool for
									personalized recommendations.
								</p>
							</div>

							<div className="bg-pink-50 rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									Are Boffo diapers safe for newborns?
								</h3>
								<p className="text-gray-600">
									Yes! Our Newborn Series is specially
									designed for delicate newborn skin with
									hypoallergenic materials and an umbilical
									cord cutout for comfort.
								</p>
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-pink-50 rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									How can I become a Boffo retailer?
								</h3>
								<p className="text-gray-600">
									We're always looking for retail partners!
									Please contact our sales team at
									sales@boffobaby.co.ke or fill out the form
									on our Retailers page.
								</p>
							</div>

							<div className="bg-pink-50 rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									Do you offer samples?
								</h3>
								<p className="text-gray-600">
									Yes, we offer sample packs for new parents.
									Contact our customer service team or fill
									out the sample request form on our website.
								</p>
							</div>

							<div className="bg-pink-50 rounded-2xl p-6">
								<h3 className="text-xl font-bold mb-2">
									What makes Boffo different from other diaper
									brands?
								</h3>
								<p className="text-gray-600">
									Boffo combines international quality
									standards with local manufacturing to create
									diapers specifically designed for Kenyan
									babies at affordable prices.
								</p>
							</div>
						</div>
					</div>

					<div className="mt-12 text-center">
						<p className="text-gray-600 mb-4">
							Don't see your question here? Contact our customer
							support team.
						</p>
						<Button
							className="bg-pink-600 hover:bg-pink-700 text-white rounded-full"
							asChild
						>
							<Link to="mailto:support@boffobaby.co.ke">
								Email Customer Support
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
