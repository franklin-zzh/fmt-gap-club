import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';

const CTA_IMG = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80&auto=format&fit=crop';

export default function CTASection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-8">
        {/* Wrapper box framing text + image together */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] p-8 md:p-12 lg:p-16"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(107, 112, 92, 0.25)',
            boxShadow: '0 8px 40px rgba(108, 112, 92, 0.06)',
          }}
        >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Copy + CTA */}
          <motion.div
            style={{ y: textY, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start gap-6 max-w-xl"
          >
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xs tracking-[0.2em] uppercase font-light"
              style={{ color: '#8E9E8A' }}
            >
              Join FMT Micro-Ecology
            </motion.span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4]" style={{ color: '#1b1b1c' }}>
              加入会员
              <br />
              <span className="italic font-serif" style={{ color: '#6B705C' }}>专属营养方案</span>
            </h2>

            <p className="text-lg leading-relaxed" style={{ color: '#454840' }}>
              完成健康档案，提交个人数据，AI模型为您匹配最精准的营养方案。从今天开始，让科学守护您的健康。
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2"
            >
              <Link
                to="/member/init"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ background: '#1b1b1c' }}
              >
                初始化您的数字化档案 <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Organic blob image */}
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full flex justify-center md:justify-end"
          >
            <TiltCard tiltDegree={5} glareOpacity={0.1} perspective={900}>
              <div
                className="w-[400px] h-[420px] md:w-[450px] md:h-[480px] overflow-hidden shadow-[0_35px_60px_-15px_rgba(88,98,74,0.18)] transition-all duration-700 hover:rounded-[50%_50%_40%_60%_/_50%_40%_60%_50%]"
                style={{
                  borderRadius: '60% 40% 35% 65% / 60% 45% 55% 40%',
                  background: '#E8D5B7',
                }}
              >
                <img
                  src={CTA_IMG}
                  alt="健康营养"
                  className="w-full h-full object-cover"
                />
              </div>
            </TiltCard>
          </motion.div>

        </div>
        </motion.div>
      </div>
    </section>
  );
}
