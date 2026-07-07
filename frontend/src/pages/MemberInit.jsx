import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  { num: '01', label: '数字化建档', status: 'active' },
  { num: '02', label: 'AI模型多维解析', status: 'pending' },
  { num: '03', label: '前沿知识库匹配', status: 'pending' },
  { num: '04', label: '动态算法生成', status: 'pending' },
  { num: '05', label: '持续追踪优化', status: 'pending' },
];

const HEALTH_TAGS = ['肠道微生态', '睡眠调理', '免疫守护', '控糖代谢', '运动恢复', '情绪管理', '抗衰老', '心血管'];

export default function MemberInit() {
  const [step, setStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleNext = () => {
    if (step === 0) {
      // Basic validation
      if (selectedTags.length === 0 || !name.trim() || !contact.trim()) return;
      setStep(1);
    }
  };

  const progressSteps = STEPS.map((s, i) => ({
    ...s,
    status: i < step ? 'done' : i === step ? 'active' : 'pending',
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col" style={{ background: '#FDFBF7' }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-40" style={{ background: 'rgba(253,251,247,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E8D5B7' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#6B705C' }}>
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: '#2C2C2C' }}>GAP 养好菌小屋</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#6B705C' }}>
              登录
            </Link>
            <Link to="/register" className="text-sm font-medium flex items-center gap-1.5 px-4 py-2 rounded-full text-white transition-all hover:opacity-90" style={{ background: '#6B705C' }}>
              <HelpCircle className="w-3.5 h-3.5" /> 咨询专家
            </Link>
          </div>
        </div>
      </div>

      {/* Main content: left progress + right form */}
      <div className="flex-1 flex">
        {/* Left: Tech Engine Status (1/3) */}
        <div className="hidden md:flex flex-col w-1/3 p-10 shrink-0" style={{ borderRight: '1px solid #E8D5B7', background: '#F5F2EB' }}>
          <div className="text-[10px] tracking-[0.25em] uppercase font-light mb-10" style={{ color: '#8E9E8A' }}>
            MY BIO-ENGINE STATUS
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-xs mx-auto">
            {progressSteps.map((s, i) => (
              <div key={i} className="flex items-start gap-4 relative pb-8 last:pb-0">
                {/* Connector line */}
                {i < progressSteps.length - 1 && (
                  <div className="absolute left-[7px] top-4 w-[1.5px] h-full" style={{ background: s.status === 'done' ? '#4E594C' : 'rgba(78,89,76,0.15)' }} />
                )}
                {/* Dot */}
                <div
                  className="relative z-10 mt-1 shrink-0 w-[15px] h-[15px] rounded-full flex items-center justify-center transition-all duration-500"
                  style={{
                    background: s.status === 'active' ? '#4E594C' : s.status === 'done' ? '#4E594C' : 'transparent',
                    border: s.status === 'pending' ? '1.5px solid rgba(78,89,76,0.3)' : 'none',
                    boxShadow: s.status === 'active' ? '0 0 0 4px rgba(78,89,76,0.12)' : 'none',
                  }}
                >
                  {s.status === 'done' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                {/* Label */}
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: s.status === 'pending' ? '#B2B8A3' : '#4E594C' }}>
                    {s.num}
                  </div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: s.status === 'pending' ? '#B2B8A3' : '#2C2C2C' }}>
                    {s.label}
                  </div>
                  {s.status === 'active' && (
                    <div className="text-[10px] mt-1 font-medium" style={{ color: '#4E594C' }}>进行中...</div>
                  )}
                  {s.status === 'done' && (
                    <div className="text-[10px] mt-1" style={{ color: '#8E9E8A' }}>已完成 ✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Activation Area (2/3) */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-lg"
              >
                <div className="text-[10px] tracking-[0.25em] uppercase font-light mb-2" style={{ color: '#8E9E8A' }}>
                  STEP 01 / 数字化建档
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#2C2C2C' }}>
                  请选择您最关注的<br />身体机能状态
                </h1>

                {/* Health tags */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {HEALTH_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-5 py-3 rounded-full text-sm font-medium transition-all duration-300"
                        style={{
                          background: isSelected ? '#4E594C' : 'rgba(78,89,76,0.06)',
                          color: isSelected ? '#fff' : '#2C2C2C',
                          border: `1px solid ${isSelected ? '#4E594C' : '#E8D5B7'}`,
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                {/* Form fields - bottom border only */}
                <div className="space-y-6 mb-10">
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: '#6B705C' }}>
                      姓名/尊称
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="请输入您的姓名"
                      className="w-full pb-2 pt-1 text-base bg-transparent outline-none transition-colors duration-300"
                      style={{
                        color: '#2C2C2C',
                        borderBottom: '1.5px solid #E8D5B7',
                        borderBottomColor: name ? '#4E594C' : '#E8D5B7',
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: '#6B705C' }}>
                      联系方式（用于接收AI报告）
                    </label>
                    <input
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="手机号或邮箱"
                      className="w-full pb-2 pt-1 text-base bg-transparent outline-none transition-colors duration-300"
                      style={{
                        color: '#2C2C2C',
                        borderBottom: '1.5px solid #E8D5B7',
                        borderBottomColor: contact ? '#4E594C' : '#E8D5B7',
                      }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium text-white transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: '#4E594C' }}
                  disabled={selectedTags.length === 0 || !name.trim() || !contact.trim()}
                >
                  下一步：进入 AI 模型多维解析 <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-lg text-center"
              >
                <div className="text-[10px] tracking-[0.25em] uppercase font-light mb-2" style={{ color: '#8E9E8A' }}>
                  STEP 02 / 激活专享方案
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                  您的专属营养方案已生成
                </h1>
                <p className="text-sm leading-relaxed mb-8" style={{ color: '#5C5C5C' }}>
                  基于您选择的健康关注点，AI 模型已完成初步分析。
                  <br />创建账号即可查看完整报告与个性化营养方案。
                </p>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium text-white transition-all hover:opacity-90"
                  style={{ background: '#4E594C' }}
                >
                  创建账号，解锁专属方案 <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="mt-6">
                  <Link to="/login" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#6B705C' }}>
                    已有账号？立即登录
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
