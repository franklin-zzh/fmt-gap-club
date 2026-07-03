import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import techBg from '/src/assets/images/tech01.png';

const TECH_ITEMS = [
  { label: '全基因组测序分析技术', text: '采用前沿测序技术深度解码肠道菌群，提供数据驱动、客观严谨的临床级评估。', color: '#4E594C', blobShape: '48% 52% 61% 39% / 42% 39% 61% 58%', link: '/technology', linkText: '了解全基因组测序流程' },
  { label: '万级微生态专属大数据库', text: '汇聚跨时空、多中心的长期真实世界数据，为匹配模型提供坚实的数据底座。', color: '#856253', blobShape: '58% 42% 40% 60% / 55% 45% 55% 45%', link: '/technology', linkText: '了解与数据库安全架构' },
  { label: '前沿医学科研文献证据库', text: '实时动态整合全球顶尖营养学与生物医药期刊，构建系统化知识图谱，覆盖从基础营养学到微生态学的完整知识体系。', color: '#A88E74', blobShape: '42% 58% 52% 48% / 60% 40% 60% 40%', link: '/knowledge-base', linkText: '进入核心知识库 查阅全部期刊文献' },
  { label: 'AI 智能化动态匹配模型', text: '基于自研多靶点匹配算法和会员个人健康数据，深度解析个体微生态特征，智能输出千人千面养护方案。', color: '#636E67', blobShape: '51% 49% 41% 59% / 41% 59% 41% 59%', link: '/ai-model', linkText: '深入了解 AI 个性化匹配算法内核' },
];

export default function TechSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [clickedIdx, setClickedIdx] = useState(null);
  const sectionRef = useRef(null);

  // Scroll parallax: image and text move at different speeds
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imgParallax = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textParallax = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const handleClick = (idx) => {
    setClickedIdx(idx);
    setTimeout(() => setClickedIdx(null), 600);
  };

  return (
    <section id="technology" ref={sectionRef} className="relative py-20 md:py-24 overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Decorative blur circles */}
      <div className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #B2B8A3, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-20 -right-32 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #D4A373, transparent 70%)', filter: 'blur(70px)' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          {/* Left: 背景图片容器 */}
          <motion.div
            style={{ y: imgParallax }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-2"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src={techBg}
                alt="自然背景"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.2) 100%)',
              }} />
            </div>
          </motion.div>

          {/* Right: Title + Interactive items */}
          <motion.div
            style={{ y: textParallax }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-3"
          >
            <div style={{ maxWidth: '580px' }}>
        <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>
              Tech Core
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4] mt-6 mb-8" style={{ color: '#2C2C2C', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
              核心技术支撑
            </h2>
            <p className="font-sans text-[15px] font-normal leading-relaxed tracking-wide antialiased mb-10" style={{ color: '#3D423C' }}>
              我们汇聚全球前沿微生态科研成果，构建知识库中心和大数据平台。通过AI微生态匹配模型和个性化算法，为您定制科学、精准、可持续的营养解决方案。
            </p>

            <div className="space-y-12">
              {TECH_ITEMS.map((item, idx) => {
                const isHovered = hoveredIdx === idx;
                const isClicked = clickedIdx === idx;
                const isAnyHovered = hoveredIdx !== null;
                const isDimmed = isAnyHovered && !isHovered;

                return (
                  <div key={idx} className="relative">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="group cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onClick={() => handleClick(idx)}
                      whileHover={{ x: 6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                    >
                      <div className="flex items-start gap-4" style={{ transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)', opacity: isDimmed ? 0.6 : 1 }}>
                        {/* Organic pebble dot */}
                        <div className="relative mt-1 shrink-0">
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              backgroundColor: item.color,
                              borderRadius: item.blobShape,
                              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              transform: isHovered ? 'scale(1.35) rotate(15deg)' : 'scale(1)',
                              boxShadow: isHovered ? `0 8px 24px ${item.color}44` : 'none',
                            }}
                          />
                        </div>

                        {/* Label + revealed description */}
                        <div className="flex-1">
                          <div className="text-sm font-bold transition-colors duration-300 flex items-center gap-2" style={{ color: isHovered ? '#8B5E3C' : '#2C2C2C' }}>
                            {item.label}
                            <motion.div
                              animate={{ x: isHovered ? 4 : 0 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <ArrowRight className="w-3.5 h-3.5" style={{ opacity: isHovered ? 1 : 0.25 }} />
                            </motion.div>
                          </div>

                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="text-xs leading-relaxed mt-1.5" style={{ color: '#8E9E8A' }}>
                                  {item.text}
                                </div>
                                <div className="mt-2">
                                  <Link
                                    to={item.link}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium transition-all hover:opacity-70"
                                    style={{ color: '#6B705C' }}
                                  >
                                    {item.linkText} <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>

                    {/* Click ripple */}
                    <AnimatePresence>
                      {isClicked && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1.2 }}
                          exit={{ opacity: 0, scale: 1.4 }}
                          transition={{ duration: 0.6 }}
                          className="absolute -inset-3 pointer-events-none rounded-2xl"
                          style={{ background: `radial-gradient(circle at 50% 50%, ${item.color}1A, ${item.color}0D 60%, transparent 80%)` }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
