import { Link } from 'react-router-dom';
import LogoIcon from './LogoIcon';

export default function Footer() {
  const linkColumns = [
    { title: '产品', links: ['儿童成长包', '女性平衡包', '肠道微生态包', '免疫守护包'] },
    { title: '技术', links: ['知识库', 'AI模型', '个性化算法', '科研文献'] },
    { title: '关于', links: ['品牌故事', '技术白皮书', '案例研究', '联系我们'] },
  ];

  return (
    <footer className="relative overflow-hidden pt-20 pb-8" style={{ background: '#f4f4f4' }}>
      <div
        className="absolute -bottom-20 -right-20 text-[200px] font-bold opacity-[0.08] leading-none select-none pointer-events-none"
        style={{ color: '#2C2C2C' }}
      >
        GAP
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#6B705C' }}>
                <LogoIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <div className="text-sm font-bold" style={{ color: '#2C2C2C' }}>GAP</div>
                <div className="text-[10px] tracking-[0.08em]" style={{ color: '#6B705C' }}>养好菌小屋</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#2C2C2C', opacity: 0.7 }}>
              以自研知识库与AI个性化匹配模型，为每一位会员定制专属营养方案。精准营养，科学驱动。
            </p>
          </div>

          {linkColumns.map((col, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-bold mb-5" style={{ color: '#2C2C2C' }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm transition-opacity hover:opacity-100" style={{ color: '#2C2C2C', opacity: 0.65 }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(107, 112, 92, 0.2)' }}>
          <p className="text-xs" style={{ color: '#2C2C2C', opacity: 0.5 }}>
            © 2026 GAP 养好菌小屋. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs transition-opacity hover:opacity-100" style={{ color: '#2C2C2C', opacity: 0.5 }}>隐私政策</a>
            <a href="#" className="text-xs transition-opacity hover:opacity-100" style={{ color: '#2C2C2C', opacity: 0.5 }}>服务条款</a>
            <Link to="/login" className="text-xs transition-opacity hover:opacity-100" style={{ color: '#2C2C2C', opacity: 0.5 }}>会员登录</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}