import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import MemberInit from './pages/MemberInit';
import MemberLayout from './components/member/MemberLayout';
import AdminLayout from './components/admin/AdminLayout';
import MemberDashboard from './pages/member/Dashboard';
import MemberProfile from './pages/member/Profile';
import MemberSubmissions from './pages/member/Submissions';
import MemberReports from './pages/member/Reports';
import MemberSubscription from './pages/member/Subscription';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminKnowledge from './pages/admin/AdminKnowledge';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeInOut' },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div {...pageTransition}><Home /></motion.div>} />
        <Route path="/login" element={<motion.div {...pageTransition}><Login /></motion.div>} />
        <Route path="/register" element={<motion.div {...pageTransition}><Register /></motion.div>} />
        <Route path="/knowledge-base" element={<motion.div {...pageTransition}><KnowledgeBasePage /></motion.div>} />
        <Route path="/member/init" element={<motion.div {...pageTransition}><MemberInit /></motion.div>} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/member" element={<motion.div {...pageTransition}><MemberLayout /></motion.div>}>
            <Route index element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="submissions" element={<MemberSubmissions />} />
            <Route path="reports" element={<MemberReports />} />
            <Route path="subscription" element={<MemberSubscription />} />
          </Route>
          <Route path="/admin" element={<motion.div {...pageTransition}><AdminLayout /></motion.div>}>
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="knowledge" element={<AdminKnowledge />} />
          </Route>
        </Route>
        <Route path="*" element={<motion.div {...pageTransition}><PageNotFound /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AnimatedRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
