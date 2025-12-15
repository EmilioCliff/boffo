import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
			<h1 className="text-6xl font-bold text-pink-600 mb-4">404</h1>
			<p className="text-2xl font-semibold text-gray-800 mb-2">
				Page Not Found
			</p>
			<p className="text-gray-600 mb-6 text-center max-w-md">
				Oops! The page you're looking for doesn't exist or has been
				moved.
			</p>
			<Link
				to="/"
				className="inline-block px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
			>
				Go Home
			</Link>
		</div>
	);
}
