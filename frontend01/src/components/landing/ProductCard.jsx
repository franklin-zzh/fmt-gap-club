import { motion } from 'framer-motion';
import { Sprout, Heart, Zap, Baby, Shield, Brain, Dumbbell, Leaf, Moon, Activity, X } from 'lucide-react';
import { useState } from 'react';
import TiltCard from './TiltCard';

const CATEGORY_CONFIG = {
  growth: { icon: Sprout, gradient: 'linear-gradient(135deg, #B2B8A3, #C7C8B6)', color: '#6B705C' },
  vitality: { icon: Zap, gradient: 'linear-gradient(135deg, #D4A373, #E8D5B7)', color: '#B28451' },
  balance: { icon: Heart, gradient: 'linear-gradient(135deg, #B2B8A3, #E8D5B7)', color: '#8B7E74' },
  energy: { icon: Activity, gradient: 'linear-gradient(135deg, #6B705C, #B2B8A3)', color: '#4A4F3C' },
  maternal: { icon: Baby, gradient: 'linear-gradient(135deg, #D4A373, #B2B8A3)', color: '#B28451' },
  senior: { icon: Shield, gradient: 'linear-gradient(135deg, #6B705C, #D4A373)', color: '#5C5C5C' },
  recovery: { icon: Dumbbell, gradient: 'linear-gradient(135deg, #B2B8A3, #6B705C)', color: '#6B705C' },
  gut: { icon: Leaf, gradient: 'linear-gradient(135deg, #C7C8B6, #B2B8A3)', color: '#6B8B5C' },
  immune: { icon: Brain, gradient: 'linear-gradient(135deg, #D4A373, #6B705C)', color: '#8B6B4C' },
  sleep: { icon: Moon, gradient: 'linear-gradient(135deg, #E8D5B7, #D4A373)', color: '#7B6B5C' },
};

export default function ProductCard({ product, index, onShowDetail }) {
  const config = CATEGORY_CONFIG[product.category] || CATEGORY_CONFIG.balance;
  const Icon = config.icon;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.4, delay: (index % 5) * 0.06 }}
        onClick={() => onShowDetail?.(product)}
        className="group cursor-pointer"
      >
        <TiltCard tiltDegree={6} glareOpacity={0.08} perspective={600}>
        <div
          className="rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8D5B7',
            boxShadow: '0 2px 12px rgba(108, 112, 92, 0.04)',
          }}
        >
        {/* Product image area — shows image or gradient+icon fallback */}
        <div className="relative h-32 sm:h-36 flex items-center justify-center overflow-hidden" style={{ background: config.gradient }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(6px)' }}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Minimal text */}
        <div className="p-3.5 sm:p-4">
          <h3 className="text-sm font-bold leading-tight mb-1" style={{ color: '#2C2C2C' }}>
            {product.name}
          </h3>
          <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: '#5C5C5C' }}>
            {product.description}
          </p>
        </div>

        {/* Hover indicator */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 0 2px ${config.color}` }} />
      </div>
        </TiltCard>
      </motion.div>
    </>
  );
}

export function ProductDetailModal({ product, onClose }) {
  if (!product) return null;
  const config = CATEGORY_CONFIG[product.category] || CATEGORY_CONFIG.balance;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#FDFBF7' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header icon bar */}
        <div className="h-24 flex items-center justify-center" style={{ background: config.gradient }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>{product.name}</h2>
            {product.subtitle && (
              <span className="text-xs tracking-[0.15em] uppercase font-light" style={{ color: '#6B705C' }}>{product.subtitle}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed" style={{ color: '#5C5C5C' }}>{product.description}</p>

          {product.target_audience && (
            <div className="rounded-xl p-4" style={{ background: '#F5F2EB' }}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: '#6B705C' }}>适用人群</div>
              <div className="text-sm" style={{ color: '#2C2C2C' }}>{product.target_audience}</div>
            </div>
          )}

          {product.bio_markers && product.bio_markers.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: '#6B705C' }}>关键成分</div>
              <div className="flex flex-wrap gap-2">
                {product.bio_markers.map((m, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full" style={{ background: config.gradient, color: '#fff' }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
