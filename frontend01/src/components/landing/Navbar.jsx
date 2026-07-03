import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, LogOut, ChevronDown,
  LayoutDashboard, Users, Package, BookOpen,
  Upload, FileText, CreditCard,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { subscriptions as subscriptionsApi } from '@/api/entityApi';
import LogoIcon from '@/components/landing/LogoIcon';

const SCROLL_KEY = 'fmt_home_scroll';

const MEMBER_NAV = [
  { to: '/member', label: '工作台', icon: LayoutDashboard, end: true },
  { to: '/member/profile', label: '健康档案', icon: FileText },
  { to: '/member/submissions', label: '数据提交', icon: Upload },
  { to: '/member/reports', label: '营养报告', icon: FileText },
  { to: '/member/subscription', label: '订阅管理', icon: CreditCard },
];

const ADMIN_NAV = [
  { to: '/admin', label: '数据看板', icon: LayoutDashboard, end: true },
  { to: '/admin/members', label: '会员管理', icon: Users },
  { to: '/admin/products', label: '产品管理', icon: Package },
  { to: '/admin/knowledge', label: '知识库管理', icon: BookOpen },
];

/** Map subscription plan_type → display level label */
function getMemberLevel(subscription) {
  if (!subscription || subscription.status !== 'active') return '初级会员';
  switch (subscription.plan_type) {
    case 'monthly':  return '初级会员';
    case 'quarterly': return '中级会员';
    case 'yearly':   return '高级会员';
    default:         return '初级会员';
  }
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const dropdownRef = useRef(null);

  /* ── scroll effect ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── IntersectionObserver for active section tracking ── */
  useEffect(() => {
    const sections = document.querySelectorAll('#products, #technology');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first section that is currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveSection(visible.length > 0 ? visible[0].target.id : null);
      },
      { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── fetch subscription to determine member level ── */
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      subscriptionsApi.getMine()
        .then(setSubscription)
        .catch(() => setSubscription(null));
    }
  }, [isAuthenticated, user]);

  /* ── close dropdown on outside click ── */
  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  }, []);
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen, handleClickOutside]);

  /* ── helpers ── */
  const navigate = useNavigate();

  const handleSectionNav = (sectionId) => {
    navigate('/', { state: { scrollTo: sectionId } });
  };

  const navLinks = [
    { label: '技术', sectionId: 'technology' },
    { label: '产品', sectionId: 'products' },
    { label: '知识库', href: '/knowledge-base', isRoute: true },
  ];

  const isAdmin = user?.role === 'admin';
  const displayName = user?.name || user?.email || '用户';
  const memberLevel = isAdmin ? '管理员' : getMemberLevel(subscription);
  const avatarLetter = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  const navItems = isAdmin ? ADMIN_NAV : MEMBER_NAV;

  // ── fully transparent background ──
  const bgOpacity = 0;

  /* ── check if an anchor nav link matches the current active section ── */
  const isActiveLink = (href) => href.startsWith('#') && activeSection === href.slice(1);

  const handleLogout = () => {
    sessionStorage.setItem(SCROLL_KEY, window.scrollY);
    setDropdownOpen(false);
    logout();
  };

  /* ── render ── */
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700"
      style={{
        background: 'rgba(244, 244, 244, 0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(107, 112, 92, 0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-[70px]">
          {/* ── Logo (horizontal split: icon + brand name) ── */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <LogoIcon
              className="w-[38px] h-[38px] md:w-[44px] md:h-[44px] transition-colors duration-500"
              style={{ color: scrolled ? 'var(--brand-green-light)' : 'var(--brand-green)' }}
            />
            <div className="flex flex-col items-center leading-tight">
              <span
                className="text-base md:text-lg font-semibold tracking-tight transition-colors duration-500"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: scrolled ? 'var(--brand-charcoal)' : 'var(--brand-green)',
                }}
              >
                GAP
              </span>
              <span
                className="text-[10px] md:text-xs font-medium tracking-[0.08em] transition-colors duration-500"
                style={{
                  color: scrolled ? 'var(--brand-charcoal)' : 'var(--brand-green)',
                  opacity: scrolled ? 0.8 : 0.65,
                }}
              >
                养好菌小屋
              </span>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              if (link.isRoute) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm font-medium transition-all duration-200 hover:opacity-60"
                    style={{ color: '#2C2C2C' }}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <button
                  key={link.sectionId}
                  onClick={() => handleSectionNav(link.sectionId)}
                  className="text-sm font-medium transition-all duration-200 hover:opacity-60"
                  style={{ color: '#2C2C2C', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center" ref={dropdownRef}>
            {isAuthenticated && user ? (
              <div className="relative">
                {/* ── User trigger button (embedded style) ── */}
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 transition-all duration-200 hover:opacity-70"
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: isAdmin ? '#D4A373' : '#6B705C' }}
                  >
                    {avatarLetter}
                  </div>

                  {/* Name + level */}
                  <div className="flex flex-col items-start leading-tight min-w-0">
                    <span className="text-sm font-semibold truncate max-w-[100px]" style={{ color: '#2C2C2C' }}>
                      {displayName}
                    </span>
                    <span className="text-[10px] tracking-wide" style={{ color: isAdmin ? '#D4A373' : '#8A8A8A' }}>
                      {memberLevel}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    style={{ color: '#8A8A8A' }}
                  />
                </button>

                {/* ── Dropdown menu (glassmorphism) ── */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-3 w-52 rounded-2xl overflow-hidden shadow-lg"
                    style={{
                      background: 'rgba(253, 251, 247, 0.3)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(107, 112, 92, 0.25)',
                    }}
                  >
                    {/* Nav items */}
                    <div className="p-2 flex flex-col gap-0.5">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                            style={{ color: '#2C2C2C' }}
                          >
                            <Icon className="w-4 h-4" style={{ color: '#6B705C' }} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Separator */}
                    <div style={{ height: '1px', background: 'rgba(107, 112, 92, 0.15)', margin: '0 12px' }} />

                    {/* Logout — red */}
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ color: '#DC2626' }}
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium transition-all duration-200 hover:brightness-125"
                  style={{ color: '#6B705C' }}
                >
                  登录
                </Link>
                <span style={{ color: '#D4C8B0', fontSize: '14px', fontWeight: 200 }}>|</span>
                <Link
                  to="/member/init"
                  className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{ background: '#6B705C', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}
                >
                  加入会员
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button className="md:hidden p-2 -mr-2" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: '#2C2C2C' }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{
            background: 'rgba(244, 244, 244, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(107, 112, 92, 0.25)',
          }}
        >
          {/* Public nav links */}
          {navLinks.map((link) => {
            if (link.isRoute) {
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium"
                  style={{ color: '#2C2C2C' }}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <button
                key={link.sectionId}
                onClick={() => { setMobileOpen(false); handleSectionNav(link.sectionId); }}
                className="text-sm font-medium text-left"
                style={{ color: '#2C2C2C', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {link.label}
              </button>
            );
          })}

          {isAuthenticated && user ? (
            <>
              {/* User card */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(245, 242, 235, 0.6)', border: '1px solid rgba(107, 112, 92, 0.15)' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: isAdmin ? '#D4A373' : '#6B705C' }}
                >
                  {avatarLetter}
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-sm font-semibold truncate" style={{ color: '#2C2C2C' }}>{displayName}</span>
                  <span className="text-[11px]" style={{ color: isAdmin ? '#D4A373' : '#8A8A8A' }}>{memberLevel}</span>
                </div>
              </div>

              {/* Mobile nav items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                    style={{ color: '#2C2C2C' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#6B705C' }} />
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile logout — red */}
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl text-sm font-medium transition-all"
                style={{ color: '#DC2626', background: 'rgba(220, 38, 38, 0.06)' }}
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium transition-all duration-200 hover:brightness-125"
                style={{ color: '#6B705C' }}
              >
                登录
              </Link>
              <Link
                to="/member/init"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white"
                style={{ background: '#6B705C', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}
              >
                加入会员
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}