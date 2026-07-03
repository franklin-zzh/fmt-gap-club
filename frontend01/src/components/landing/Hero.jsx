import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroBg from '/src/assets/images/0GAP_club.png';
import bg01 from '/src/assets/images/bg01.png';
import bg02 from '/src/assets/images/bg02.png';
import bg03 from '/src/assets/images/bg03.png';
import bg04 from '/src/assets/images/bg04.png';
import bg05 from '/src/assets/images/bg05.png';

/* ------------------------------------------------------------------ */
/*  Hero slide data — first entry is the hero, followed by 5 steps    */
/* ------------------------------------------------------------------ */
const HERO_SLIDE = {
  isHero: true,
  zhTitle: 'GAP · 养好菌小屋',
  desc: '通过最尖端的FMT技术与微生态分析，我们为您提供量身定制的健康管理方案。从细胞层级感知自然的回馈。',
};

const STEPS = [
  HERO_SLIDE,
  {
    step: '01',
    enLabel: 'biotech',
    zhTitle: '精准检测评估',
    desc: '采用高通量基因测序技术，精准解码肠道菌群结构与功能，提供数据驱动、客观严谨的专业健康评估。',
    imgSrc: bg01,
  },
  {
    step: '02',
    enLabel: 'psychology',
    zhTitle: '个性化养菌方案',
    desc: '依托自研 AI 算法与专属大数据库，深度解析个体微生态特征，智能输出千人千面的精准化菌群养护方案。',
    imgSrc: bg02,
  },
  {
    step: '03',
    enLabel: 'monitoring',
    zhTitle: '全生命周期动态监管',
    desc: '通过会员制体系，实现定期随访与菌群复测，实时监控肠道健康状态，动态迭代、精准优化个性化干预方案。',
    imgSrc: bg03,
  },
  {
    step: '04',
    enLabel: 'family_member',
    zhTitle: '家庭成员参与',
    desc: '以家庭为单位做肠道微生态管理，让全家共同参与、共同受益，全面筑牢家庭成员互相感染与调理的日常肠道健康防线。',
    imgSrc: bg04,
  },
  {
    step: '05',
    enLabel: 'model_training',
    zhTitle: '数据累积 · 数字孪生',
    desc: '建立虚拟「肠道数字孪生」模型，实现对用户长期随访数据、亚健康趋势的前瞻性与预见性精准健康演进管理。',
    imgSrc: bg05,
  },
];

/* ------------------------------------------------------------------ */
/*  Hero — full-viewport slide carousel                                */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const isScrolling = useRef(false);
  const totalSlides = STEPS.length;

  const goToSlide = useCallback(
    (index) => {
      if (index < 0 || index >= totalSlides || isScrolling.current) return;
      isScrolling.current = true;
      setCurrentSlide(index);
      setTimeout(() => {
        isScrolling.current = false;
      }, 1200);
    },
    [totalSlides],
  );

  // Auto-advance every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 60000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  // Touch support
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY.current - touchEndY > 50) goToSlide((currentSlide + 1) % totalSlides);
      if (touchEndY - touchStartY.current > 50) goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    },
    [currentSlide, goToSlide],
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: '#FFFFFF' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle organic texture — visible behind hero slide */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #6B705C 1px, transparent 1px), radial-gradient(circle at 75% 75%, #6B705C 1px, transparent 1px)',
          backgroundSize: '60px 60px, 80px 80px',
        }}
      />

      {/* Ambient glow — visible behind hero slide */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #8B9A7B, transparent 70%)', filter: 'blur(120px)' }}
        />
      </div>

      {/* ---- Slides — full-viewport background ---- */}
      {STEPS.map((step, i) => {
        const isHero = step.isHero;
        return (
        <div
          key={i}
          className={`section-mask absolute inset-0 ${i === currentSlide ? 'active' : 'section-hidden'}`}
          style={{ zIndex: totalSlides - i }}
        >
          {/* Background: hero slide uses ambient texture; step slides use photo */}
          {isHero ? (
            <div
              className="parallax-bg absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
          ) : (
            <div
              className="parallax-bg absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${step.imgSrc})` }}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/30 to-white/80" />

          {/* Text content — vertically centered at 50% height */}
          <div className="absolute inset-0 flex flex-col px-6 md:px-16">
            <div className="w-full md:w-3/5 max-w-2xl text-center md:text-left md:ml-[12.5%] flex flex-col flex-1">
              {isHero ? (
                /* ---- Hero slide content - centered in page ---- */
                <div className="absolute inset-0 flex justify-center items-center">
                  <div
                    className="inline-block p-6 md:p-8 rounded-2xl max-w-lg text-left"
                    style={{
                      background: 'rgba(255, 255, 255, 0.3)',
                      border: '0.5px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                  <span
                    className="inline-block text-xs tracking-[0.2em] uppercase font-light mb-5"
                    style={{ color: '#6B705C' }}
                  >
                    PRECISION MICROBIOTA SCIENCE
                  </span>
                  <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4]"
                    style={{
                      color: '#2C2C2C',
                      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
                    }}
                  >
                    {step.zhTitle}
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed mt-6 mb-10 max-w-sm" style={{ color: '#454840' }}>
                    {step.desc}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => goToSlide(1)}
                      className="px-8 py-3.5 rounded-full text-base font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                      style={{ background: '#2C2C2C' }}
                    >
                      立即开始探索
                    </button>
                    <button
                      onClick={() => {
                        navigate('/', { state: { scrollTo: 'technology' } });
                      }}
                      className="px-8 py-3.5 rounded-full text-base font-medium transition-all duration-300 hover:opacity-80"
                      style={{
                        color: '#2C2C2C',
                        border: '0.5px solid rgba(44, 44, 44, 0.35)',
                        background: 'transparent',
                      }}
                    >
                      了解核心技术
                    </button>
                  </div>
                </div>
                </div>
              ) : (
                /* ---- Step slides content - pushed to bottom ---- */
                <div className="mt-auto pb-6 md:pb-8">
                  <span
                    className="inline-block text-xs tracking-[0.2em] uppercase font-light mb-3"
                    style={{ color: '#6B705C' }}
                  >
                    STEP {step.step} · {step.enLabel}
                  </span>
                  <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4]"
                    style={{
                      color: '#2C2C2C',
                      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
                    }}
                  >
                    {step.zhTitle}
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed mt-5 max-w-sm" style={{ color: '#454840' }}>
                    {step.desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })}

      {/* ---- Navigation arrows ---- */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + totalSlides) % totalSlides)}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255, 255, 255, 0.4)',
          color: '#2C2C2C',
        }}
        aria-label="上一页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % totalSlides)}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255, 255, 255, 0.4)',
          color: '#2C2C2C',
        }}
        aria-label="下一页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* ---- Dot pagination ---- */}
      <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center gap-3">
        {STEPS.map((_, i) => (
          <button
            key={i}
            className={`pagination-dot ${i === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
            aria-label={`转到第 ${i + 1} 页`}
          />
        ))}
      </div>

      {/* ---- Animations ---- */}
      <style>{`
        .section-mask {
          clip-path: inset(0 0 0 0);
          transition: clip-path 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .section-hidden {
          clip-path: inset(0 0 0 100%);
        }
        .parallax-bg {
          transform: scale(1.1);
          transition: transform 2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .active .parallax-bg {
          transform: scale(1);
        }
        .pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #454840;
          opacity: 0.3;
          transition: all 0.4s ease;
          cursor: pointer;
          border: none;
          padding: 0;
        }
        .pagination-dot.active {
          opacity: 1;
          width: 32px;
          height: 8px;
          border-radius: 12px;
          background: #58624a;
        }
      `}</style>
    </section>
  );
}
