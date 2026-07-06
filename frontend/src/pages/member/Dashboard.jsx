import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Upload, FileText, CreditCard, ArrowRight, Activity } from 'lucide-react';
import { profiles as profilesApi, submissions as submissionsApi, subscriptions as subscriptionsApi } from '@/api/entityApi';

export default function Dashboard() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [prof, subs, subscr] = await Promise.all([
        profilesApi.get().catch(() => null),
        submissionsApi.list().catch(() => []),
        subscriptionsApi.getMine().catch(() => null),
      ]);
      setProfile(prof);
      setSubmissionsList(Array.isArray(subs) ? subs : []);
      setSubscription(subscr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate profile completeness based on backend fields
  const filledFields = profile
    ? Object.entries(profile).filter(([k, v]) =>
        v && !['id', 'user_id', 'updated_at'].includes(k) &&
        (Array.isArray(v) ? v.length > 0 : true)
      ).length
    : 0;
  const totalFields = 7; // gender, age, height, weight, health_goals, lifestyle_tags, allergies
  const arcPercent = profile ? Math.min(100, Math.round((filledFields / totalFields) * 100)) : 0;

  const stats = [
    { label: '数据提交', value: submissionsList.length, icon: Upload, color: '#B2B8A3', action: '/member/submissions' },
    { label: '营养报告', value: submissionsList.filter(s => s.status === 'completed').length, icon: FileText, color: '#D4A373', action: '/member/reports' },
    { label: '订阅状态', value: subscription?.status === 'active' ? '有效' : '未开通', icon: CreditCard, color: '#6B705C', action: '/member/subscription' },
  ];

  return (
    <div>
      <div className="mb-10">
        <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Member Dashboard</span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>
          欢迎回来
        </h1>
        <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>在这里管理您的健康档案、数据提交与专属营养方案。</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-[28px] p-8 md:col-span-1 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #B2B8A3, #D4A373)', color: '#fff' }}>
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52 * arcPercent / 100} ${2 * Math.PI * 52}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{arcPercent}%</span>
              <span className="text-[10px] tracking-widest uppercase opacity-80">完整度</span>
            </div>
          </div>
          <div className="text-sm font-medium">健康活力指数</div>
          <div className="text-xs opacity-80 mt-1">完善档案以提升匹配精度</div>
        </div>

        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-[28px] p-8 cursor-pointer transition-all hover:-translate-y-1" onClick={() => navigate(stat.action)} style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: stat.color }}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#2C2C2C' }}>{typeof stat.value === 'number' ? stat.value : stat.value}</div>
              <div className="text-sm" style={{ color: '#6B705C' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[28px] p-8" style={{ background: '#F5F2EB', border: '1px solid #E8D5B7' }}>
        <div className="flex items-center gap-3 mb-5">
          <Activity className="w-5 h-5" style={{ color: '#6B705C' }} />
          <h2 className="text-lg font-bold" style={{ color: '#2C2C2C' }}>快速操作</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/member/profile')} className="flex items-center justify-between p-5 rounded-2xl transition-all hover:-translate-y-0.5" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
            <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>完善健康档案</span>
            <ArrowRight className="w-4 h-4" style={{ color: '#6B705C' }} />
          </button>
          <button onClick={() => navigate('/member/submissions')} className="flex items-center justify-between p-5 rounded-2xl transition-all hover:-translate-y-0.5" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
            <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>提交健康数据</span>
            <ArrowRight className="w-4 h-4" style={{ color: '#6B705C' }} />
          </button>
          <button onClick={() => navigate('/member/reports')} className="flex items-center justify-between p-5 rounded-2xl transition-all hover:-translate-y-0.5" style={{ background: '#FFFFFF', border: '1px solid #E8D5B7' }}>
            <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>查看营养报告</span>
            <ArrowRight className="w-4 h-4" style={{ color: '#6B705C' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
