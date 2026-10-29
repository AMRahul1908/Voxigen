import React, { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Link } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

type FloatingNavItem = {
  name: string;
  link: string;
  icon?: React.ReactNode;
  active?: boolean;
};

type FloatingNavProps = {
  navItems: FloatingNavItem[];
  brand?: { name: string; link: string };
  cta?: { name: string; link: string };
  className?: string;
};

export const FloatingNav: React.FC<FloatingNavProps> = ({ navItems, brand, cta, className }) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, 'change', current => {
    const previous = scrollY.getPrevious() ?? current;
    if (current < 100 || current < previous) setVisible(true);
    else if (current > previous) setVisible(false);
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        aria-label="Main navigation"
        initial={{ opacity: 0, y: -24 }}
        animate={{ y: visible ? 0 : -24, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={cn('fixed inset-x-2 top-3 z-[5000] mx-auto w-[96vw] max-w-[1600px] sm:inset-x-4 sm:top-5', className)}
      >
        <div className="flex min-h-16 w-full items-center justify-between gap-2 rounded-full border border-cosmic-gold/30 bg-cosmic-navy/95 px-2.5 py-2 shadow-[0_12px_45px_rgba(0,0,0,.4)] backdrop-blur-xl sm:min-h-[76px] sm:gap-4 sm:px-5 sm:py-3">
          {brand && (
            <Link to={brand.link} aria-label={`${brand.name} home`} className="flex shrink-0 items-center gap-2.5 rounded-full px-1.5 py-2 text-cosmic-ivory transition-colors hover:bg-cosmic-purple/40 sm:gap-3 sm:px-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cosmic-gold/50 bg-gradient-to-br from-cosmic-purple to-cosmic-indigo text-cosmic-gold shadow-gold sm:h-11 sm:w-11">
                <svg viewBox="0 0 100 100" className="h-5 w-5 fill-none stroke-current stroke-[7] sm:h-6 sm:w-6" aria-hidden="true"><polygon points="50,10 90,50 50,90 10,50" /><circle cx="50" cy="50" r="16" className="fill-current" /></svg>
              </span>
              <span className="hidden font-display text-sm font-bold tracking-wider sm:inline">{brand.name}</span>
            </Link>
          )}

          <div className="h-6 w-px shrink-0 bg-cosmic-gold/20" />

          <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map(item => (
              <Link
                key={item.link}
                to={item.link}
                aria-current={item.active ? 'page' : undefined}
                title={item.name}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-3 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:py-3.5 sm:text-sm',
                  item.active
                    ? 'bg-cosmic-purple/50 text-cosmic-gold'
                    : 'text-cosmic-lavender/80 hover:bg-cosmic-purple/30 hover:text-cosmic-ivory',
                )}
              >
                {item.icon && <span className="flex h-4 w-4 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>}
                <span className="hidden whitespace-nowrap lg:inline">{item.name}</span>
              </Link>
            ))}
          </div>

          {cta && <>
            <div className="h-6 w-px shrink-0 bg-cosmic-gold/20" />
            <Link to={cta.link} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cosmic-gold/40 px-3 py-3 text-xs font-semibold text-cosmic-gold transition-colors hover:bg-cosmic-gold hover:text-cosmic-navy sm:gap-2 sm:px-5 sm:py-3.5 sm:text-sm">
              <CircleUserRound className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{cta.name}</span>
            </Link>
          </>}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};
