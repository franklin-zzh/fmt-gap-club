import { useEffect, useRef } from 'react';

/**
 * A subtle gradient glow that follows the cursor across the page.
 * Adds a sense of depth and interaction — the page "breathes" with the mouse.
 */
export default function MouseGlow({
  size = 500,
  color1 = '#B2B8A3',
  color2 = '#D4A373',
  opacity = 0.12,
  blur = 100,
}) {
  const glowRef = useRef(null);
  const posRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const handleMouse = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateGlow);
      }
    };

    const handleTouch = (e) => {
      const touch = e.touches?.[0];
      if (touch) {
        posRef.current = { x: touch.clientX, y: touch.clientY };
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(updateGlow);
        }
      }
    };

    const updateGlow = () => {
      if (glow) {
        const { x, y } = posRef.current;
        glow.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      }
      rafRef.current = null;
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [size]);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-0"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color1} 0%, ${color2} 40%, transparent 70%)`,
        opacity,
        filter: `blur(${blur}px)`,
        transition: 'opacity 0.3s ease',
        willChange: 'transform',
        top: 0,
        left: 0,
      }}
    />
  );
}
