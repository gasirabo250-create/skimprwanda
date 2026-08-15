import React from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * SKIMP signature mark: an angular speed-line forming an "S" — the same
 * chevron motif used as the favicon. Orange stroke reads as a live signal
 * against black or white.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="9" className="fill-ink dark:fill-white" />
    <path
      d="M11 27L20 12L23 17L18 26H24L29 17"
      stroke="#FF5A1F"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

interface LogoProps {
  size?: number;
  className?: string;
  wordmarkClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '', wordmarkClassName = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <LogoMark size={size} />
    <span className={`font-display font-bold tracking-tight text-lg leading-none ${wordmarkClassName}`}>
      SKIMP<span className="text-accent">.</span>
      <span className="block text-[10px] font-mono font-medium tracking-[0.2em] text-black/50 dark:text-white/50 -mt-0.5">
        RWANDA
      </span>
    </span>
  </div>
);

export default Logo;
