import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
	const { isAuthenticated, decoded } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	// Redirect based on user role
	if (decoded?.role === 'admin') {
		return <Navigate to="/admin" replace />;
	}

	return <Navigate to="/reseller" replace />;
};

export default Index;
