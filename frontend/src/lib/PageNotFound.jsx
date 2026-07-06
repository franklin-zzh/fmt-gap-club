import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Home } from 'lucide-react';

export default function PageNotFound() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/member', { replace: true });
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFBF7' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: '#6B705C' }}>404</h1>
        <p className="text-lg mb-8" style={{ color: '#5C5C5C' }}>Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: '#6B705C' }}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
