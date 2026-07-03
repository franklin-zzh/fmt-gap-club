import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function DataToSolution() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const textParallax = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section id="data-to-solution" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#FFFFFF' }}>
      <motion.div
        style={{ y: textParallax }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6"
      >
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4] text-center mb-16 md:mb-20" style={{ color: '#2C2C2C', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
          从数据到方案 · 闭环精准
        </h3>

        <div className="relative max-w-3xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-[11px] left-[8%] right-[8%]" style={{ height: '0.5px', background: 'rgba(107,112,92,0.15)' }} />

          {/* 5 steps */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { num: '01', label: '采集', title: '数字化建档', sub: '生物样本输入' },
              { num: '02', label: '解码', title: 'AI 模型多维', sub: '深度解析' },
              { num: '03', label: '循证', title: '前沿知识库', sub: '科学匹配' },
              { num: '04', label: '转化', title: '动态算法', sub: '生成独属方案' },
              { num: '05', label: '迭代', title: '持续追踪', sub: '长期伴随优化' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                {/* Dot with pulse ring */}
                <motion.div className="relative mb-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.12, ease: 'backOut' }}
                    className="w-[5px] h-[5px] rounded-full relative z-10"
                    style={{ background: '#4E594C', boxShadow: '0 0 0 3px rgba(78,89,76,0.12)' }}
                  />
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'rgba(78,89,76,0.08)',
                      boxShadow: '0 0 0 2px rgba(78,89,76,0.1)',
                    }}
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      delay: idx * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>

                <div className="text-[10px] tracking-[0.2em] uppercase font-light mb-1.5" style={{ color: '#8E9E8A' }}>
                  {step.num} / {step.label}
                </div>
                <div className="text-xs font-bold leading-tight" style={{ color: '#2C2C2C' }}>
                  {step.title}
                </div>
                <div className="text-[11px] leading-tight mt-0.5" style={{ color: '#8E9E8A' }}>
                  {step.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-xs leading-relaxed mt-14 max-w-xl mx-auto"
          style={{ color: '#8E9E8A' }}
        >
          让每一次微小的数据起伏，都有坚实的科研背书；始于严谨科学，归于生命个体。
        </motion.p>
      </motion.div>
    </section>
  );
}
