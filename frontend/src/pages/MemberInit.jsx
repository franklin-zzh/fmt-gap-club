import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, HelpCircle, UploadCloud, X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import AiAnalysisVisualizer from '@/components/member/AiAnalysisVisualizer';

const STEPS = [
  { num: '01', label: '数字化建档', status: 'active' },
  { num: '02', label: 'AI模型多维解析', status: 'pending' },
  { num: '03', label: '前沿知识库匹配', status: 'pending' },
  { num: '04', label: '动态算法生成', status: 'pending' },
  { num: '05', label: '持续追踪优化', status: 'pending' },
];

const HEALTH_TAGS = ['肠道微生态', '睡眠调理', '免疫守护', '控糖代谢', '运动恢复', '情绪管理', '抗衰老', '心血管'];

/* ── Upload Zone sub-component ── */
function UploadZone({ label, file, onFileSelect, onFileRemove }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (f) onFileSelect(f);
  };

  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-all"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => !file && fileRef.current?.click()}
      style={{
        background: dragOver ? 'rgba(78,89,76,0.08)' : '#F5F2EB',
        border: `1.5px dashed ${dragOver ? '#4E594C' : file ? '#6B705C' : '#E8D5B7'}`,
        minHeight: 100,
      }}
    >
      <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />

      {file ? (
        /* File selected — show name + remove */
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#6B705C' }}>
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#2C2C2C' }}>{file.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8E9E8A' }}>
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onFileRemove(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: 'rgba(78,89,76,0.1)' }}
          >
            <X className="w-3.5 h-3.5" style={{ color: '#4E594C' }} />
          </button>
        </div>
      ) : (
        /* Empty state — upload prompt */
        <div className="flex flex-col items-center text-center py-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: 'rgba(78,89,76,0.1)' }}>
            <UploadCloud className="w-5 h-5" style={{ color: '#6B705C' }} />
          </div>
          <p className="text-xs font-medium" style={{ color: '#6B705C' }}>{label}</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#B2B8A3' }}>点击或拖拽上传</p>
        </div>
      )}
    </div>
  );
}

export default function MemberInit() {
  const [step, setStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthday, setBirthday] = useState('');
  const [physicalExamFile, setPhysicalExamFile] = useState(null);
  const [testReportFile, setTestReportFile] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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

  // Simulate AI analysis progress
  useEffect(() => {
    if (step !== 1) return;

    setAnalysisProgress(0);
    const duration = 4800; // total analysis animation duration in ms
    const interval = 60;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setAnalysisProgress(prev => {
        const next = prev + increment + Math.random() * 0.5;
        if (next >= 100) {
          clearInterval(timer);
          // Small pause at 100% before showing result
          setTimeout(() => setStep(2), 400);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [step]);

  const progressSteps = STEPS.map((s, i) => {
    let status;
    if (step === 0) {
      status = i === 0 ? 'active' : 'pending';
    } else if (step === 1) {
      status = i === 0 ? 'done' : i === 1 ? 'active' : 'pending';
    } else {
      // step === 2: result / 动态算法生成 active, earlier steps done
      status = i < 3 ? 'done' : i === 3 ? 'active' : 'pending';
    }
    return { ...s, status };
  });

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
                <div className="space-y-6 mb-6">
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
                      联系方式（用于专属AI报告生成）
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

                  {/* Personal info row: gender + age */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-medium mb-2 block" style={{ color: '#6B705C' }}>
                        性别
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full pb-2 pt-1 text-base bg-transparent outline-none transition-colors duration-300 appearance-none"
                        style={{
                          color: gender ? '#2C2C2C' : '#9CA3AF',
                          borderBottom: '1.5px solid #E8D5B7',
                          borderBottomColor: gender ? '#4E594C' : '#E8D5B7',
                        }}
                      >
                        <option value="" disabled>请选择</option>
                        <option value="男">男</option>
                        <option value="女">女</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-2 block" style={{ color: '#6B705C' }}>
                        年龄
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="请输入年龄"
                        min="1"
                        max="150"
                        className="w-full pb-2 pt-1 text-base bg-transparent outline-none transition-colors duration-300"
                        style={{
                          color: '#2C2C2C',
                          borderBottom: '1.5px solid #E8D5B7',
                          borderBottomColor: age ? '#4E594C' : '#E8D5B7',
                        }}
                      />
                    </div>
                  </div>

                  {/* Personal info row: height + weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-2 block" style={{ color: '#6B705C' }}>
                        身高（cm）
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="请填写身高"
                        min="50"
                        max="250"
                        className="w-full pb-2 pt-1 text-base bg-transparent outline-none transition-colors duration-300"
                        style={{
                          color: '#2C2C2C',
                          borderBottom: '1.5px solid #E8D5B7',
                          borderBottomColor: height ? '#4E594C' : '#E8D5B7',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-2 block" style={{ color: '#6B705C' }}>
                        体重（kg）
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="请填写体重"
                        min="10"
                        max="400"
                        className="w-full pb-2 pt-1 text-base bg-transparent outline-none transition-colors duration-300"
                        style={{
                          color: '#2C2C2C',
                          borderBottom: '1.5px solid #E8D5B7',
                          borderBottomColor: weight ? '#4E594C' : '#E8D5B7',
                        }}
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: '#6B705C' }}>
                      出生日期
                    </label>
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full pb-2 pt-1 text-base bg-transparent outline-none transition-colors duration-300"
                      style={{
                        color: birthday ? '#2C2C2C' : '#9CA3AF',
                        borderBottom: '1.5px solid #E8D5B7',
                        borderBottomColor: birthday ? '#4E594C' : '#E8D5B7',
                      }}
                    />
                  </div>
                </div>

                {/* File upload section */}
                <div className="mb-6">
                  <p className="text-xs font-medium mb-3" style={{ color: '#6B705C' }}>
                    上传健康数据（可选）
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Physical exam report */}
                    <UploadZone
                      label="体检报告"
                      file={physicalExamFile}
                      onFileSelect={(f) => setPhysicalExamFile(f)}
                      onFileRemove={() => setPhysicalExamFile(null)}
                    />
                    {/* Test report */}
                    <UploadZone
                      label="检测报告"
                      file={testReportFile}
                      onFileSelect={(f) => setTestReportFile(f)}
                      onFileRemove={() => setTestReportFile(null)}
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
                  STEP 02 / AI 模型多维解析
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
                  AI 正在分析您的健康数据
                </h1>
                <p className="text-sm leading-relaxed mb-8" style={{ color: '#5C5C5C' }}>
                  结合您的基础信息与关注点，模型正在生成个性化营养方案
                </p>

                <AiAnalysisVisualizer progress={analysisProgress} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-lg text-center"
              >
                <div className="text-[10px] tracking-[0.25em] uppercase font-light mb-2" style={{ color: '#8E9E8A' }}>
                  STEP 04 / 动态算法生成
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
