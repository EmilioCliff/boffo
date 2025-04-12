import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './pages/AppLayout';
import Home from './pages/Home';
import ContactPage from './pages/Contact';
import InvestorsPage from './pages/Investors';
import RetailersPage from './pages/Retailers';
import ManufacturingPage from './pages/Manufacturing';
import ProductsPage from './pages/Products';
import AboutPage from './pages/About';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route path="" element={<Home />} />
					<Route path="about" element={<AboutPage />} />
					<Route path="products" element={<ProductsPage />} />
					<Route
						path="manufacturing"
						element={<ManufacturingPage />}
					/>
					<Route path="retailers" element={<RetailersPage />} />
					<Route path="investors" element={<InvestorsPage />} />
					<Route path="contact" element={<ContactPage />} />
				</Route>
				<Route path="*" element={<p>Not found</p>} />
			</Routes>
		</Router>
	);
}

export default App;
