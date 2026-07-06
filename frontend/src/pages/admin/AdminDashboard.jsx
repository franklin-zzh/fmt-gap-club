import { useState, useEffect } from 'react';
import { products as productsApi, articles as articlesApi, users as usersApi, submissions as submissionsApi, dashboard as dashboardApi } from '@/api/entityApi';
import { Users, FileText, Package, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, articles: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userList, prodList, artList, subList] = await Promise.all([
        usersApi.list().catch(() => []),
        productsApi.list().catch(() => []),
        articlesApi.list().catch(() => []),
        submissionsApi.list().catch(() => []),
      ]);
      setStats({
        users: userList.length,
        products: prodList.length,
        articles: artList.length,
        submissions: subList.length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { month: '1月', visitors: 320, signups: 45 },
    { month: '2月', visitors: 410, signups: 62 },
    { month: '3月', visitors: 580, signups: 89 },
    { month: '4月', visitors: 720, signups: 124 },
    { month: '5月', visitors: 890, signups: 156 },
    { month: '6月', visitors: 1120, signups: 198 },
  ];

  const statCards = [
    { label: '注册会员', value: stats.users, icon: Users, color: '#6B705C' },
    { label: '产品数量', value: stats.products, icon: Package, color: '#B2B8A3' },
    { label: '知识库文章', value: stats.articles, icon: FileText, color: '#D4A373' },
    { label: '数据提交', value: stats.submissions, icon: TrendingUp, color: '#6B705C' },
  ];

  return (
    <div>
      <div className="mb-10">
        <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Admin Dashboard</span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>数据看板</h1>
        <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>监控会员转化数据与平台运营状况。</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-[20px] p-6" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: stat.color }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#2C2C2C' }}>{loading ? '—' : stat.value}</div>
              <div className="text-xs" style={{ color: '#6B705C' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-[24px] p-8 md:col-span-2" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: '#2C2C2C' }}>访客与注册转化趋势</h2>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5" style={{ color: '#5C5C5C' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#B2B8A3' }} /> 访客
              </span>
              <span className="flex items-center gap-1.5" style={{ color: '#5C5C5C' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4A373' }} /> 注册
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B705C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B705C' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#FDFBF7', border: '1px solid #E8D5B7', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="visitors" fill="#B2B8A3" radius={[6, 6, 0, 0]} />
              <Bar dataKey="signups" fill="#D4A373" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[24px] p-8" style={{ background: 'linear-gradient(135deg, #B2B8A3, #D4A373)', color: '#fff' }}>
          <h2 className="text-lg font-bold mb-2">转化率</h2>
          <div className="text-5xl font-bold mb-2">17.7%</div>
          <div className="flex items-center gap-1 text-sm opacity-80 mb-6">
            <ArrowUpRight className="w-4 h-4" />
            较上月提升 2.3%
          </div>
          <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="text-sm opacity-80 mb-1">本月新增注册</div>
            <div className="text-2xl font-bold">198 人</div>
          </div>
        </div>
      </div>
    </div>
  );
}
