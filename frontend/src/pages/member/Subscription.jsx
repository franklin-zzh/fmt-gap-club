import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { subscriptions as subscriptionsApi } from '@/api/entityApi';
import { Check, Crown } from 'lucide-react';

const PLANS = [
  {
    type: 'monthly',
    name: '基础会员',
    price: '¥299',
    period: '/月',
    features: ['健康档案管理', '每月1次数据提交', '基础营养报告', '知识库访问权限'],
    color: '#B2B8A3',
  },
  {
    type: 'quarterly',
    name: '高级会员',
    price: '¥599',
    period: '/月',
    features: ['基础会员全部权益', '每月3次数据提交', '深度AI营养报告', '专属营养师咨询1次', '技术白皮书下载'],
    color: '#D4A373',
    popular: true,
  },
  {
    type: 'yearly',
    name: '尊享会员',
    price: '¥999',
    period: '/月',
    features: ['高级会员全部权益', '无限次数据提交', '季度营养方案复检', '专属营养师全程跟踪', '新品优先体验'],
    color: '#6B705C',
  },
];

export default function Subscription() {
  const { user } = useOutletContext();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    try {
      const sub = await subscriptionsApi.getMine();
      setSubscription(sub);
    } catch (e) {
      // 404 means no subscription yet
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planType) => {
    try {
      const sub = await subscriptionsApi.renew({ plan_type: planType });
      setSubscription(sub);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>Subscription</span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: '#2C2C2C' }}>订阅管理</h1>
        <p className="text-sm mt-2" style={{ color: '#5C5C5C' }}>管理您的会员订阅状态与套餐方案。</p>
      </div>

      {subscription && subscription.status === 'active' && (
        <div className="rounded-[24px] p-8 mb-8" style={{ background: 'linear-gradient(135deg, #B2B8A3, #D4A373)', color: '#fff' }}>
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">当前订阅</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-2xl font-bold mb-1">
                {PLANS.find((p) => p.type === subscription.plan_type)?.name || '会员'}
              </div>
              <div className="text-sm opacity-80">
                有效期至 {subscription.expired_at ? new Date(subscription.expired_at).toLocaleDateString('zh-CN') : '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = subscription?.plan_type === plan.type && subscription?.status === 'active';
          return (
            <div
              key={plan.type}
              className="rounded-[28px] p-8 flex flex-col relative"
              style={{
                background: '#FFFFFF',
                border: plan.popular ? '2px solid #D4A373' : '1px solid #E8D5B7',
                boxShadow: plan.popular ? '0 8px 32px rgba(212,163,115,0.12)' : 'none',
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium text-white" style={{ background: '#D4A373' }}>
                  推荐
                </div>
              )}
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2C2C2C' }}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold" style={{ color: plan.color }}>{plan.price}</span>
                <span className="text-sm" style={{ color: '#5C5C5C' }}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#5C5C5C' }}>
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !isCurrent && handleSubscribe(plan.type)}
                disabled={isCurrent}
                className="w-full py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: isCurrent ? 'rgba(178,184,163,0.15)' : plan.color,
                  color: isCurrent ? '#6B705C' : '#fff',
                  cursor: isCurrent ? 'default' : 'pointer',
                }}
              >
                {isCurrent ? '当前套餐' : '选择此套餐'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
