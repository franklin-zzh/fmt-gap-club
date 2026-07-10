import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Dna, Database, Sparkles, Activity } from 'lucide-react';

const ANALYSIS_LOGS = [
  { icon: Database, text: '正在读取用户基础健康信息...' },
  { icon: Dna, text: '正在解析肠道菌群与代谢特征...' },
  { icon: Brain, text: 'AI 模型正在匹配前沿营养知识库...' },
  { icon: Activity, text: '正在计算个性化营养干预方案...' },
  { icon: Sparkles, text: '正在生成专属推荐报告...' },
];

const floatingParticles = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  size: 4 + Math.random() * 6,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 4,
}));

export default function AiAnalysisVisualizer({ progress = 0 }) {
  const currentLogIndex = Math.min(
    ANALYSIS_LOGS.length - 1,
    Math.floor((progress / 100) * ANALYSIS_LOGS.length)
  );

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Animated visualization area */}
      <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed"
          style={{ borderColor: 'rgba(107,112,92,0.25)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Second ring */}
        <motion.div
          className="absolute inset-3 rounded-full border"
          style={{ borderColor: 'rgba(107,112,92,0.18)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />

        {/* Pulsing glow rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 140 + i * 50,
              height: 140 + i * 50,
              border: '1px solid rgba(107,112,92,0.12)',
              background: `radial-gradient(circle, rgba(168,184,152,${0.08 - i * 0.025}) 0%, transparent 70%)`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6 - i * 0.15, 0.2 - i * 0.05, 0.6 - i * 0.15],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.6,
            }}
          />
        ))}

        {/* Floating data particles */}
        {floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.id % 3 === 0 ? '#D4A373' : p.id % 3 === 1 ? '#6B705C' : '#A8B898',
              boxShadow: `0 0 ${p.size * 1.5}px ${p.id % 3 === 0 ? 'rgba(212,163,115,0.5)' : p.id % 3 === 1 ? 'rgba(107,112,92,0.5)' : 'rgba(168,184,152,0.5)'}`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, p.id % 2 === 0 ? 12 : -12, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}

        {/* Central brain orb */}
        <motion.div
          className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #A8B898, #6B705C)',
            boxShadow: '0 0 40px rgba(107,112,92,0.35), inset 0 0 20px rgba(255,255,255,0.2)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 40px rgba(107,112,92,0.35), inset 0 0 20px rgba(255,255,255,0.2)',
              '0 0 60px rgba(107,112,92,0.5), inset 0 0 25px rgba(255,255,255,0.3)',
              '0 0 40px rgba(107,112,92,0.35), inset 0 0 20px rgba(255,255,255,0.2)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>

        {/* DNA strands on sides */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1].map((side) => (
            <motion.svg
              key={side}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: side === 0 ? '6%' : 'auto', right: side === 0 ? 'auto' : '6%' }}
              width="28"
              height="140"
              viewBox="0 0 28 140"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: side * 0.5 }}
            >
              {Array.from({ length: 6 }).map((_, i) => {
                const y = i * 22 + 10;
                const offset = side === 0 ? Math.sin(i * 0.8) * 6 : Math.cos(i * 0.8) * 6;
                return (
                  <g key={i}>
                    <motion.circle
                      cx={8 + offset}
                      cy={y}
                      r="3"
                      fill="#6B705C"
                      animate={{ cy: [y, y + 4, y] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                    />
                    <motion.circle
                      cx={20 - offset}
                      cy={y}
                      r="3"
                      fill="#A8B898"
                      animate={{ cy: [y, y - 4, y] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                    />
                    <motion.line
                      x1={8 + offset}
                      y1={y}
                      x2={20 - offset}
                      y2={y}
                      stroke="rgba(107,112,92,0.25)"
                      strokeWidth="1"
                      animate={{ y1: [y, y + 4, y], y2: [y, y - 4, y] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                    />
                  </g>
                );
              })}
            </motion.svg>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: '#6B705C' }}>
            AI Analysis Progress
          </span>
          <span className="text-xs font-bold" style={{ color: '#4E594C' }}>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(107,112,92,0.12)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6B705C, #A8B898)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Rotating analysis log */}
      <div className="h-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {ANALYSIS_LOGS.map((log, idx) => {
            if (idx !== currentLogIndex) return null;
            const Icon = log.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-sm"
                style={{ color: '#4E594C' }}
              >
                <Icon className="w-4 h-4" />
                <span>{log.text}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
