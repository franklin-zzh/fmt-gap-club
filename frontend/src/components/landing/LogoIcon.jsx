/**
 * LogoIcon — Core brand icon: a stylised "probiotics + tech leaf".
 *
 * Designed as a clean, monochromatic SVG (currentColor-aware) so it adapts
 * to any background via its parent's `color` property.
 *
 * Usage:  <LogoIcon className="w-10 h-10" style={{ color: '#6B705C' }} />
 */

export default function LogoIcon({ className = 'w-10 h-10', style = {} }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Outer ring — microbiome / probiotics circle */}
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />

      {/* Leaf silhouette — nature / health */}
      <path
        d="M24 10 C18 14 14 22 14 28 C14 34 18 38 24 38 C30 38 34 34 34 28 C34 22 30 14 24 10Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M24 14 C20 18 17 24 17 28 C17 32 20 35 24 35 C28 35 31 32 31 28 C31 24 28 18 24 14Z"
        fill="currentColor"
        opacity="0.25"
      />

      {/* Leaf vein — centre spine */}
      <path
        d="M24 14 L24 34"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M19 20 C22 20 24 21 24 24"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M18 26 C21 26 24 27 24 28"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Microbiome dots — probiotics (clockwise) */}
      <circle cx="24" cy="6" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="38" cy="14" r="1.4" fill="currentColor" opacity="0.45" />
      <circle cx="42" cy="24" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="38" cy="34" r="1.4" fill="currentColor" opacity="0.45" />
      <circle cx="24" cy="42" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="10" cy="34" r="1.4" fill="currentColor" opacity="0.45" />
      <circle cx="6" cy="24" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="10" cy="14" r="1.4" fill="currentColor" opacity="0.45" />

      {/* Tech accent — two tiny orbital arcs */}
      <path
        d="M6 24 L10 19"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M42 24 L38 29"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
