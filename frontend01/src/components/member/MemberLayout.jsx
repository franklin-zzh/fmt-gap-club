import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, User, Upload, FileText, CreditCard, Leaf, LogOut, Menu, Home } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { to: '/member', label: '工作台', icon: LayoutDashboard, end: true },
  { to: '/member/profile', label: '健康档案', icon: User },
  { to: '/member/submissions', label: '数据提交', icon: Upload },
  { to: '/member/reports', label: '营养报告', icon: FileText },
  { to: '/member/subscription', label: '订阅管理', icon: CreditCard },
];

export default function MemberLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFBF7' }}><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen flex" style={{ background: '#FDFBF7' }}>
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ background: '#F5F2EB', borderRight: '1px solid #E8D5B7' }}
      >
        <div className="p-6 flex items-center gap-2.5" style={{ borderBottom: '1px solid #E8D5B7' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#6B705C' }}>
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold" style={{ color: '#2C2C2C' }}>GAP 养好菌小屋</div>
            <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#6B705C' }}>会员中心</div>
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive ? 'text-white' : 'hover:bg-opacity-50'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? '#6B705C' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#2C2C2C',
                })}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid #E8D5B7' }}>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:bg-opacity-50 mb-1"
            style={{ color: '#2C2C2C' }}
          >
            <Home className="w-4 h-4" />
            返回官网
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:bg-opacity-50"
            style={{ color: '#2C2C2C' }}
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-5 py-4" style={{ background: '#FDFBF7', borderBottom: '1px solid #E8D5B7' }}>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" style={{ color: '#2C2C2C' }} />
          </button>
          <span className="text-sm font-bold" style={{ color: '#2C2C2C' }}>会员中心</span>
          <div className="w-5" />
        </header>

        <main className="p-6 md:p-10 max-w-6xl mx-auto">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
