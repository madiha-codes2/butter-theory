import { useState } from 'react';

export function ButterTheoryLogo({ compact = false, inverted = false }) {
  const ink = inverted ? '#F5E9C9' : '#593B30';
  const blockBg = '#F2C94C';
  const starAccent = '#C83F35';

  return (
    <span className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
      <svg
        width={compact ? 28 : 34}
        height={compact ? 28 : 34}
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="3"
          y="7"
          width="26"
          height="22"
          rx="2"
          fill={blockBg}
          stroke={ink}
          strokeWidth="2.2"
        />
        <path d="M22 7L29 14H22V7Z" fill="#E8AFC0" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        <path
          d="M14 13.5L15.6 17.4L19.5 19L15.6 20.6L14 24.5L12.4 20.6L8.5 19L12.4 17.4L14 13.5Z"
          fill={starAccent}
        />
        <circle cx="30" cy="6" r="2.2" fill="#3556A5" />
      </svg>

      <span
        className="font-display font-bold tracking-[-0.03em] leading-none"
        style={{
          color: ink,
          fontSize: compact ? '1.125rem' : '1.375rem',
        }}
      >
        BUTTER THEORY
      </span>
    </span>
  );
}

export function ButterTheoryMonogram({ size = 56 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-label="Butter Theory Monogram"
      className="shrink-0"
    >
      <circle cx="32" cy="32" r="29" fill="#F2C94C" stroke="#593B30" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="23" stroke="#593B30" strokeWidth="1.2" strokeDasharray="3 3" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fill="#593B30"
        style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 700,
          fontSize: '23px',
          letterSpacing: '-0.04em',
        }}
      >
        BT
      </text>
      <path d="M32 4L33.4 8.2L37.6 9.6L33.4 11L32 15.2L30.6 11L26.4 9.6L30.6 8.2L32 4Z" fill="#C83F35" />
    </svg>
  );
}

export function BakeryStamp({
  labelTop = 'CULTURED BUTTER',
  labelBottom = 'SMALL BATCH',
  bg = '#F2C94C',
  ink = '#593B30',
  size = 104,
  spin = false,
  className = '',
}) {
  const uid = `${labelTop}-${labelBottom}`.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={`select-none shrink-0 ${spin ? 'bt-spin-slow' : ''} ${className}`}
    >
      <circle cx="60" cy="60" r="56" fill={bg} stroke={ink} strokeWidth="2.5" />
      <circle cx="60" cy="60" r="46" stroke={ink} strokeWidth="1.25" strokeDasharray="4 3" />
      <defs>
        <path id={`btTop_${uid}`} d="M 20,60 A 40,40 0 1,1 100,60" />
        <path id={`btBot_${uid}`} d="M 100,62 A 40,40 0 1,1 20,62" />
      </defs>
      <text fill={ink} fontSize="9.5" fontWeight="700" letterSpacing="2">
        <textPath href={`#btTop_${uid}`} startOffset="50%" textAnchor="middle">
          {labelTop}
        </textPath>
      </text>
      <text fill={ink} fontSize="9.5" fontWeight="700" letterSpacing="2">
        <textPath href={`#btBot_${uid}`} startOffset="50%" textAnchor="middle">
          {labelBottom}
        </textPath>
      </text>
      <path
        d="M60 40L63.8 52.2L76 56L63.8 59.8L60 72L56.2 59.8L44 56L56.2 52.2L60 40Z"
        fill="#C83F35"
      />
    </svg>
  );
}

export function HandStar({ size = 24, color = '#C83F35', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" className={className}>
      <path
        d="M14 2L16.8 10.6L25.5 13.5L16.8 16.4L14 25L11.2 16.4L2.5 13.5L11.2 10.6L14 2Z"
        fill={color}
      />
    </svg>
  );
}

export function HandSparkle({ size = 34, color = '#F2C94C', stroke = '#593B30', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <path
        d="M20 3L23.5 16.5L37 20L23.5 23.5L20 37L16.5 23.5L3 20L16.5 16.5L20 3Z"
        fill={color}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandSquiggle({ className = '', color = '#593B30' }) {
  return (
    <svg width="110" height="14" viewBox="0 0 110 14" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2 8C12 2 22 12 32 7C42 2 52 12 62 7C72 2 82 12 92 7C99 3.5 104 6 108 8"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HandScribbleUnderline({ className = '', color = '#F2C94C' }) {
  return (
    <svg viewBox="0 0 240 22" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 15C52 5 118 4 234 10C186 12 114 14 24 19"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandArrow({ className = '', color = '#593B30' }) {
  return (
    <svg width="64" height="36" viewBox="0 0 64 36" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 28C18 10 38 8 56 16"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M47 9L58 16.5L46.5 22.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrganicScallopEdge({ color = '#F5E9C9', className = '' }) {
  return (
    <svg
      viewBox="0 0 1200 32"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={`w-full h-5 block ${className}`}
    >
      <path
        d="M0 32V16C25 16 25 0 50 0C75 0 75 16 100 16C125 16 125 0 150 0C175 0 175 16 200 16C225 16 225 0 250 0C275 0 275 16 300 16C325 16 325 0 350 0C375 0 375 16 400 16C425 16 425 0 450 0C475 0 475 16 500 16C525 16 525 0 550 0C575 0 575 16 600 16C625 16 625 0 650 0C675 0 675 16 700 16C725 16 725 0 750 0C775 0 775 16 800 16C825 16 825 0 850 0C875 0 875 16 900 16C925 16 925 0 950 0C975 0 975 16 1000 16C1025 16 1025 0 1050 0C1075 0 1075 16 1100 16C1125 16 1125 0 1150 0C1175 0 1175 16 1200 16V32H0Z"
        fill={color}
      />
    </svg>
  );
}

export function ProductImage({ src, alt, className = '', aspectClass = 'aspect-[4/3]' }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`${aspectClass} flex flex-col items-center justify-center bg-[#FAF3DF] border border-[#593B30]/20 p-4 text-center ${className}`}
      >
        <HandStar size={28} color="#C83F35" />
        <span className="mt-2 font-display text-sm font-semibold text-[#593B30]">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} overflow-hidden bg-[#FAF3DF] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
}
