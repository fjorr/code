'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icons';
import { localeLabels, locales, stripLocalePrefix, type AppLocale } from '@/i18n/config';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { FjorrWordmark } from '@/components/brand/FjorrMarks';
import ColorSchemeToggle from '@/components/ColorSchemeToggle';
import AccountNavLink from '@/components/AccountNavLink';
import NavbarBureauxCue from '@/components/NavbarBureauxCue';
import { useColorScheme } from '@/components/ColorSchemeProvider';
import { isColorSchemeLockedPath } from '@/lib/color-scheme';

interface NavbarProps {
  variant?: 'light' | 'dark';
}

const EXPLORE_LINKS = [
  { href: '/', labelKey: 'films' as const },
  { href: '/bounties', labelKey: 'bounties' as const },
  { href: '/nominate', labelKey: 'nominate' as const },
  { href: '/cabinet', labelKey: 'cabinet' as const },
  { href: '/about', labelKey: 'about' as const },
  { href: '/principles', labelKey: 'principles' as const },
  { href: '/manual', labelKey: 'manual' as const },
];

type PanelMode = 'closed' | 'nav' | 'lang';

const TAGLINE_SCROLL_PX = 40;

function Navbar({ variant = 'light' }: NavbarProps) {
  const t = useTranslations('Nav');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname() || '';
  const { isLocked } = useColorScheme();
  const showAppearance = !isColorSchemeLockedPath(pathname) && !isLocked;
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [panel, setPanel] = useState<PanelMode>('closed');
  const [scrolledPast, setScrolledPast] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isOpen = panel !== 'closed';
  const showCloseIcon = panel === 'nav';
  const textColor = variant === 'light' ? 'text-white' : 'text-black';
  const subTextColor = variant === 'light' ? 'text-white/80' : 'text-black/80';
  const iconColor = variant === 'light' ? 'text-white/55' : 'text-black/45';
  const mutedLabel = variant === 'light' ? 'text-white/50' : 'text-black/50';
  // Compact on scroll; expand again when a menu is open so the panel isn’t cramped.
  const showTagline = !scrolledPast || isOpen;

  const openGlassStyle = isOpen
    ? {
        backgroundColor:
          variant === 'light'
            ? 'color-mix(in srgb, var(--page-bg-color, #1F1F1F) 78%, transparent)'
            : 'color-mix(in srgb, var(--page-bg-color, #EDE8DF) 82%, transparent)',
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
        transform: 'translateZ(0)',
      }
    : undefined;
  const openGlassClass =
    variant === 'light'
      ? 'border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
      : 'border-black/5 menu-surface';
  const glassAnimClass =
    variant === 'light' ? 'animate-nav-glass' : 'animate-nav-glass-light';

  const closePanel = () => setPanel('closed');

  const toggleNav = () => {
    setPanel((current) => (current === 'nav' ? 'closed' : 'nav'));
  };

  const toggleLang = () => {
    setPanel((current) => (current === 'lang' ? 'closed' : 'lang'));
  };

  const setLocale = (next: AppLocale) => {
    if (next === locale) {
      setPanel('closed');
      return;
    }
    setPanel('closed');
    // Prefer the real URL, then strip any locale prefix. Hook pathname can
    // still include a prefix if client locale briefly disagrees with the URL
    // (which produced paths like /es/de).
    const raw =
      typeof window !== 'undefined' ? window.location.pathname : pathname;
    const href = stripLocalePrefix(raw || '/') || '/';
    router.replace(href, { locale: next });
  };

  // Slogan on every page load / route; hide only after scroll.
  useEffect(() => {
    setScrolledPast(false);
    const onScroll = () => {
      setScrolledPast(window.scrollY > TAGLINE_SCROLL_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    const handleHide = () => {
      setIsTheaterOpen(true);
      setPanel('closed');
    };
    const handleShow = () => setIsTheaterOpen(false);

    window.addEventListener('fjorr_hide_main_navbar', handleHide);
    window.addEventListener('fjorr_show_main_navbar', handleShow);
    return () => {
      window.removeEventListener('fjorr_hide_main_navbar', handleHide);
      window.removeEventListener('fjorr_show_main_navbar', handleShow);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setPanel('closed');
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel('closed');
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  if (isTheaterOpen) return null;

  /** Scales down on narrow viewports — never ellipsize; the bar grows to fit. */
  const taglineClass =
    'font-sans font-medium tracking-normal whitespace-nowrap text-[clamp(10px,0.2rem+1.8vw,13px)] hidden min-[400px]:inline';

  return (
    <header className="sticky top-0 z-50 w-full h-[56px] pt-[12px] px-4 flex justify-center pointer-events-none overflow-visible">
      <div
        ref={panelRef}
        className="relative h-[44px] pointer-events-auto w-full max-w-[calc(100vw-2rem)] sm:w-max"
      >
        <div
          className="flex h-[44px] w-full pl-3 pr-4 sm:pl-5 sm:pr-[30px] items-center gap-3 sm:gap-5 opacity-0 pointer-events-none select-none sm:w-max"
          aria-hidden
        >
          <div className="w-[33px] shrink-0" />
          {showTagline ? (
            <span className={`${taglineClass} shrink-0`}>
              {t('tagline')}
            </span>
          ) : null}
          <div className="w-[10.5rem] shrink-0" />
        </div>

        <div
          style={openGlassStyle}
          className={`
            absolute left-0 right-0 flex flex-col border
            transition-[top,padding,border-radius,background-color,border-color,backdrop-filter] duration-300 ease-out
            ${isOpen
              ? `${openGlassClass} -top-3 pt-3 rounded-b-[10px] rounded-t-none overflow-visible`
              : `top-0 rounded-[10px] overflow-visible ${glassAnimClass} ${
                  scrolledPast ? 'nav-glass-scrolled' : 'nav-glass-top'
                }`}
          `}
        >
          <div className="flex h-[44px] w-full pl-3 pr-4 sm:pl-5 sm:pr-5 items-center gap-3 sm:gap-4">
            <Link
              href="/"
              onClick={closePanel}
              className={`flex items-center cursor-pointer shrink-0 ${textColor}`}
            >
              <FjorrWordmark className="h-[20px] w-[33px]" />
            </Link>

            <div
              className={`shrink-0 overflow-hidden transition-[opacity,max-width] duration-300 ease-out ${
                showTagline
                  ? 'opacity-100 max-w-[40rem]'
                  : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              <Link
                href="/about"
                onClick={closePanel}
                tabIndex={showTagline ? undefined : -1}
                aria-hidden={!showTagline}
                className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
              >
                <span className={`${taglineClass} select-none ${subTextColor}`}>
                  {t('tagline')}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-4 shrink-0 ml-auto">
              <button
                type="button"
                aria-label={showCloseIcon ? t('closeMenu') : t('openMenu')}
                aria-expanded={showCloseIcon}
                onClick={toggleNav}
                className={`relative w-[18px] h-[18px] cursor-pointer shrink-0 transition-opacity hover:opacity-80 ${iconColor}`}
              >
                <NavbarBureauxCue />
                <span
                  className={`absolute left-1/2 top-1/2 block w-[14px] h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-out origin-center
                    ${showCloseIcon ? '-translate-x-1/2 -translate-y-1/2 rotate-45' : '-translate-x-1/2 -translate-y-[3.5px]'}`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 block w-[14px] h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-out origin-center
                    ${showCloseIcon ? '-translate-x-1/2 -translate-y-1/2 -rotate-45' : '-translate-x-1/2 translate-y-[3.5px]'}`}
                />
              </button>

              <button
                type="button"
                aria-label={t('language')}
                aria-expanded={panel === 'lang'}
                onClick={toggleLang}
                className={`flex items-center gap-1.5 shrink-0 transition-opacity hover:opacity-80 ${iconColor}`}
              >
                <Icon name="globe" className="w-[18px] h-[18px]" />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.05em] leading-none">
                  {locale}
                </span>
              </button>
            </div>
          </div>

          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden min-h-0">
              {panel === 'lang' ? (
                <div className="px-[30px] pb-11 pt-4 flex flex-col gap-3">
                  <p
                    className={`font-sans text-[15px] font-semibold tracking-tight ${textColor}`}
                  >
                    {t('languagesHeadline')}
                  </p>
                  <nav className="flex flex-col gap-1.5" aria-label={t('languages')}>
                    {locales.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setLocale(code)}
                        className={`text-left font-sans text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70 ${
                          locale === code
                            ? variant === 'light'
                              ? 'text-white/35 cursor-default'
                              : 'text-black/35 cursor-default'
                            : textColor
                        }`}
                      >
                        {localeLabels[code]}
                      </button>
                    ))}
                  </nav>
                </div>
              ) : (
                <div className="px-[30px] pb-11 pt-4 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <nav className="flex flex-col gap-1.5">
                      {EXPLORE_LINKS.map((item) => {
                        const isActive =
                          item.href === '/'
                            ? pathname === '/'
                            : pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const activeMuted =
                          variant === 'light' ? 'text-white/35' : 'text-black/35';
                        const label = t(item.labelKey);

                        if (isActive) {
                          return (
                            <span
                              key={item.href}
                              aria-current="page"
                              className={`font-sans text-[15px] font-semibold tracking-tight cursor-default select-none ${activeMuted}`}
                            >
                              {label}
                            </span>
                          );
                        }

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closePanel}
                            className={`font-sans text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70 ${textColor}`}
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <div
                    className={`pt-5 border-t ${
                      variant === 'light' ? 'border-white/10' : 'border-black/8'
                    }`}
                  >
                    <AccountNavLink
                      onNavigate={closePanel}
                      className={`font-sans text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70 ${textColor}`}
                      mutedClassName={`font-sans text-[13px] font-medium leading-snug ${mutedLabel}`}
                    />
                  </div>

                  {showAppearance ? (
                    <div
                      className={`pt-5 flex flex-col items-start gap-2 border-t ${
                        variant === 'light' ? 'border-white/10' : 'border-black/8'
                      }`}
                    >
                      <p
                        className={`font-sans text-[13px] font-medium leading-snug ${mutedLabel}`}
                      >
                        {t('appearance')}
                      </p>
                      <ColorSchemeToggle />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Clear at top so page / artifact color shows through; glass only after scroll.
           Blur is never keyframed (iOS Safari can’t interpolate backdrop-filter). */
        .animate-nav-glass,
        .animate-nav-glass-light {
          background-color: transparent;
          border-color: transparent;
          -webkit-backdrop-filter: none;
          backdrop-filter: none;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .animate-nav-glass.nav-glass-scrolled {
          background-color: color-mix(in srgb, var(--page-bg-color, #1F1F1F) 72%, transparent);
          border-color: rgba(255, 255, 255, 0.1);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          backdrop-filter: blur(24px) saturate(1.4);
        }

        .animate-nav-glass-light.nav-glass-scrolled {
          background-color: color-mix(in srgb, var(--page-bg-color, #EDE8DF) 78%, transparent);
          border-color: rgba(0, 0, 0, 0.06);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          backdrop-filter: blur(24px) saturate(1.4);
        }

        @keyframes revealGlassTint {
          from {
            background-color: transparent;
            border-color: transparent;
          }
          to {
            background-color: color-mix(in srgb, var(--page-bg-color, #1F1F1F) 72%, transparent);
            border-color: rgba(255, 255, 255, 0.1);
          }
        }

        @keyframes revealGlassTintLight {
          from {
            background-color: transparent;
            border-color: transparent;
          }
          to {
            background-color: color-mix(in srgb, var(--page-bg-color, #EDE8DF) 78%, transparent);
            border-color: rgba(0, 0, 0, 0.06);
          }
        }

        /* Desktop: ease tint in on scroll while still .nav-glass-top.
           Blur snaps on when JS flips to .nav-glass-scrolled. */
        @supports (animation-timeline: scroll()) {
          @media (hover: hover) and (pointer: fine) {
            .animate-nav-glass.nav-glass-top {
              animation: revealGlassTint linear both;
              animation-timeline: scroll(root);
              animation-range: 40px 90px;
            }

            .animate-nav-glass-light.nav-glass-top {
              animation: revealGlassTintLight linear both;
              animation-timeline: scroll(root);
              animation-range: 40px 90px;
            }
          }
        }
      `,
        }}
      />
    </header>
  );
}

export default Navbar;
