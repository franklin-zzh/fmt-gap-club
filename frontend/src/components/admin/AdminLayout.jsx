import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, BookOpen, Leaf, LogOut, Menu, Home } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: '数据看板', icon: LayoutDashboard, end: true },
  { to: '/admin/members', label: '会员管理', icon: Users },
  { to: '/admin/products', label: '产品管理', icon: Package },
  { to: '/admin/knowledge', label: '知识库管理', icon: BookOpen },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

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
        style={{ background: '#2C2C2C' }}
      >
        <div className="p-6 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#D4A373' }}>
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white">GAP 养好菌小屋</div>
            <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#D4A373' }}>运营后台</div>
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
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                style={({ isActive }) => ({
                  background: isActive ? '#D4A373' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                })}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <Home className="w-4 h-4" />
            返回官网
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-5 py-4" style={{ background: '#FDFBF7', borderBottom: '1px solid #E8D5B7' }}>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" style={{ color: '#2C2C2C' }} />
          </button>
          <span className="text-sm font-bold" style={{ color: '#2C2C2C' }}>运营后台</span>
          <div className="w-5" />
        </header>

        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
