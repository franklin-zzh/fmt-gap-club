import { useRef, useState, useCallback } from 'react';

/**
 * A wrapper that applies a 3D tilt transform to its children
 * based on mouse position. Adds a subtle glare overlay.
 */
export default function TiltCard({
  children,
  className = '',
  tiltDegree = 8,
  glareOpacity = 0.12,
  perspective = 800,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [style3d, setStyle3d] = useState({});
  const [glareStyle, setGlareStyle] = useState({});

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -tiltDegree;
    const rotateY = ((x - centerX) / centerX) * tiltDegree;

    setStyle3d({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.08s ease-out',
    });

    // Glare follows cursor
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
    });
  }, [tiltDegree, glareOpacity, perspective]);

  const handleMouseLeave = useCallback(() => {
    setStyle3d({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    });
    setGlareStyle({});
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, perspective: `${perspective}px` }}
      {...props}
    >
      <div style={{ ...style3d, transformStyle: 'preserve-3d' }}>
        {children}
        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
          style={{ ...glareStyle, borderRadius: 'inherit' }}
        />
      </div>
    </div>
  );
}
