import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { products as productsApi } from '@/api/entityApi';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ProductGallery from '@/components/landing/ProductGallery';
import TechSection from '@/components/landing/TechSection';
import DataToSolution from '@/components/landing/DataToSolution';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import MouseGlow from '@/components/landing/MouseGlow';

const SCROLL_KEY = 'fmt_home_scroll';

export default function Home() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const restored = useRef(false);

  useEffect(() => {
    loadData();
  }, []);

  // Restore scroll position OR navigate to section
  useEffect(() => {
    const state = location.state;
    if (state?.scrollTo) {
      // Navigated from Navbar section link — scroll to that section
      restored.current = true;
      requestAnimationFrame(() => {
        const el = document.getElementById(state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }

    if (!restored.current) {
      const saved = sessionStorage.getItem(SCROLL_KEY);
      if (saved) {
        const y = parseInt(saved, 10);
        if (y > 0) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: 'instant' });
          });
        }
        sessionStorage.removeItem(SCROLL_KEY);
      }
      restored.current = true;
    }
  }, [location.state]);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, window.scrollY);
    };
    // Use a passive scroll listener to save position continuously
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      // Save final position on unmount (when navigating away)
      sessionStorage.setItem(SCROLL_KEY, window.scrollY);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const loadData = async () => {
    try {
      const prods = await productsApi.list().catch(() => []);
      setProducts(prods);
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#FFFFFF' }}>
      <MouseGlow size={500} color1="#B2B8A3" color2="#D4A373" opacity={0.08} blur={120} />
      <Navbar />
      <Hero />
      <TechSection />
      <DataToSolution />
      <ProductGallery products={products} loading={loading} />
      <CTASection />
      <Footer />
    </div>
  );
}
