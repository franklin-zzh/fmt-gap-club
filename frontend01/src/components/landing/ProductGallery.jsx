import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ProductCard, { ProductDetailModal } from './ProductCard';
import { ArrowRight } from 'lucide-react';

const DEFAULT_PRODUCTS = [
  { name: '儿童成长包', subtitle: 'Growth', description: '专为3-12岁儿童设计，支持骨骼发育与免疫系统建设。', target_audience: '3-12岁儿童', bio_markers: ['钙吸收', '维生素D', '锌', '益生菌'], category: 'growth', order: 1 },
  { name: '青少年活力包', subtitle: 'Vitality', description: '针对青春期快速发育需求，支持体能、脑力与情绪平衡。', target_audience: '13-18岁青少年', bio_markers: ['蛋白质', 'Omega-3', 'B族维生素', '铁'], category: 'vitality', order: 2 },
  { name: '女性平衡包', subtitle: 'Balance', description: '调节女性内分泌平衡，支持肌肤、骨骼与心血管健康。', target_audience: '成年女性', bio_markers: ['铁', '叶酸', '胶原蛋白', '植物雌激素'], category: 'balance', order: 3 },
  { name: '男性能量包', subtitle: 'Energy', description: '提升男性体能与代谢效率，支持心血管健康与压力管理。', target_audience: '成年男性', bio_markers: ['锌', '镁', '精氨酸', 'B族维生素'], category: 'energy', order: 4 },
  { name: '孕产营养包', subtitle: 'Maternal', description: '覆盖备孕、孕期、产后全阶段，精准支持胎儿发育与母体恢复。', target_audience: '备孕及孕产期女性', bio_markers: ['叶酸', 'DHA', '铁', '钙', '维生素D'], category: 'maternal', order: 5 },
  { name: '银发健康包', subtitle: 'Senior', description: '针对50+人群，强化骨骼密度、认知功能与心血管保护。', target_audience: '50岁以上中老年', bio_markers: ['钙', '维生素D', '辅酶Q10', 'Omega-3'], category: 'senior', order: 6 },
  { name: '运动恢复包', subtitle: 'Recovery', description: '加速运动后肌肉修复与能量补充，优化体能表现与恢复效率。', target_audience: '运动健身人群', bio_markers: ['BCAA', '肌酸', '电解质', '抗氧化剂'], category: 'recovery', order: 7 },
  { name: '肠道微生态包', subtitle: 'Gut', description: '重建肠道菌群平衡，改善消化吸收，增强免疫屏障功能。', target_audience: '消化功能不佳人群', bio_markers: ['益生菌', '益生元', '膳食纤维', '谷氨酰胺'], category: 'gut', order: 8 },
  { name: '免疫守护包', subtitle: 'Immune', description: '系统性增强免疫防线，提升机体抗病能力，适合易感体质人群。', target_audience: '免疫力低下人群', bio_markers: ['维生素C', '维生素D', '锌', '硒', 'β-葡聚糖'], category: 'immune', order: 9 },
  { name: '安神助眠包', subtitle: 'Sleep', description: '调节神经递质平衡，改善睡眠质量，缓解焦虑与压力。', target_audience: '睡眠障碍及高压人群', bio_markers: ['褪黑素', '镁', 'GABA', '茶氨酸'], category: 'sleep', order: 10 },
];

export default function ProductGallery({ products, loading }) {
  const [detailProduct, setDetailProduct] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const scrollRef = useRef(null);
  const isInView = useInView(scrollRef, { once: true, amount: 0.25 });

  if (isInView && !hasEntered) {
    setHasEntered(true);
  }

  const catalog = Array.isArray(products) && products.length > 0
    ? products.map(p => ({
        ...p,
        target_audience: p.target_audience || p.target_group || '',
        bio_markers: p.bio_markers || p.tags || [],
        category: p.category || 'growth',
        order: p.order ?? p.order_index ?? 0,
      }))
    : DEFAULT_PRODUCTS;

  // Sort by order
  const sorted = [...catalog].sort((a, b) => a.order - b.order);

  return (
    <section id="products" className="relative py-20 md:py-28 overflow-hidden" style={{ background: '#F5F5F7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-right mb-12"
        >
          <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#6B705C' }}>
            Nutrition Gallery
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4] mt-5 mb-6" style={{ color: '#2C2C2C', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
            十款营养包 · 全人群覆盖
          </h2>
          <p className="text-lg max-w-2xl ml-auto mr-0 leading-relaxed" style={{ color: '#5C5C5C' }}>
            精选匹配你的健康需求
          </p>
        </motion.div>
      </div>

      {/* Scrolling product strip — full viewport width */}
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0, y: 24 }}
        animate={hasEntered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex gap-4"
          style={{
            animation: hasEntered && !isPaused
              ? 'scrollLeft 70s linear infinite'
              : 'none',
            width: 'max-content',
          }}
        >
          {/* Duplicate the list for seamless loop */}
          {[...sorted, ...sorted].map((product, idx) => (
            <div
              key={`${product.id || product.name}-${idx}`}
              className="flex-shrink-0"
              style={{ width: '300px' }}
            >
              <ProductCard
                product={product}
                index={idx % sorted.length}
                onShowDetail={setDetailProduct}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Keyframes for scroll-left animation injected via style tag */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Global CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <button
          onClick={() => setDetailProduct(sorted[0])}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-all hover:opacity-80"
          style={{ background: 'rgba(107,112,92,0.08)', color: '#6B705C' }}
        >
          探索全人群精准定制矩阵 <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </section>
  );
}
