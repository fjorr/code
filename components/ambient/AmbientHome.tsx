'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { type AppLocale } from '@/i18n/config';
import CommandLine from '@/components/ambient/CommandLine';
import CornerColophon from '@/components/ambient/CornerColophon';
import HouseMenu from '@/components/ambient/HouseMenu';
import LanguagePanel from '@/components/ambient/LanguagePanel';
import { FjorrWordmark } from '@/components/brand/FjorrMarks';
import { Icon } from '@/components/ui/Icons';
import TheaterOpenShell from '@/components/TheaterOpenShell';
import { openTheaterFromFilm } from '@/lib/theater-open';
import {
  finishWatchProgress,
  trackWatchProgress,
} from '@/lib/watch-progress';

const CinemaTheater = dynamic(() => import('@/components/CinemaTheater'), {
  ssr: false,
  loading: () => <TheaterOpenShell />,
});

export type AmbientFilm = {
  id: string;
  name?: string | null;
  slug: string;
  mux_playback_id?: string | null;
  hero_wide?: string | null;
  hero_clsx?: string | null;
  hero_tall?: string | null;
  teaser?: string | null;
  story_date?: string | null;
  runtime?: number | null;
  release_date?: string | null;
  comingSoon?: boolean;
  sponsor?: string | null;
  title_art_code?: string | null;
  title_art_hex?: string | null;
  title_art_scale?: number | null;
  rating?: string | null;
  theme?: string | null;
};

const TAGLINE = "Short films of the world's greatest stories.";
function marginsForViewport(width: number) {
  if (width >= 1024) return { top: 100, side: 100, bottom: 100 };
  if (width >= 768) return { top: 60, side: 60, bottom: 60 };
  return { top: 44, side: 20, bottom: 44 };
}

function runtimeLabel(seconds?: number | null) {
  const minutes = Math.ceil((seconds || 0) / 60);
  return minutes === 0 ? '1m' : `${minutes}m`;
}

type HeroFrame = 'wide' | 'clsx' | 'tall';

function useHeroFrame(): HeroFrame {
  const [frame, setFrame] = useState<HeroFrame>('wide');

  useEffect(() => {
    const apply = () => {
      const margin = marginsForViewport(window.innerWidth);
      const width = window.innerWidth - margin.side * 2;
      const height = window.innerHeight - margin.top - margin.bottom;
      const aspect = width / Math.max(height, 1);
      setFrame(aspect >= 1.5 ? 'wide' : aspect >= 0.75 ? 'clsx' : 'tall');
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  return frame;
}

function heroSrc(item: AmbientFilm, frame: HeroFrame) {
  if (frame === 'wide') return item.hero_wide || item.hero_clsx || item.hero_tall || null;
  if (frame === 'clsx') return item.hero_clsx || item.hero_wide || item.hero_tall || null;
  return item.hero_tall || item.hero_clsx || item.hero_wide || null;
}

export default function AmbientHome({ films }: { films: AmbientFilm[] }) {
  const t = useTranslations('Film');
  const tNav = useTranslations('Nav');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [phase, setPhase] = useState<'idle' | 'from' | 'to'>('idle');
  const [commandOpen, setCommandOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [showTheater, setShowTheater] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<AmbientFilm | null>(null);
  const [startAt, setStartAt] = useState<number | undefined>(undefined);
  const leavingRef = useRef<number | null>(null);
  const frame = useHeroFrame();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setLangOpen(false);
        setMenuOpen(false);
        setCommandOpen((open) => !open);
      }
      if (event.key === 'Escape') {
        setCommandOpen(false);
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (!films.length) return;
      const wrapped = ((next % films.length) + films.length) % films.length;
      if (wrapped === index) return;
      let delta = wrapped - index;
      if (delta > films.length / 2) delta -= films.length;
      if (delta < -films.length / 2) delta += films.length;
      leavingRef.current = index;
      setDir(delta >= 0 ? 1 : -1);
      setPhase('from');
      setIndex(wrapped);
    },
    [films.length, index]
  );

  useEffect(() => {
    if (phase !== 'from') return;
    let frame2 = 0;
    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => setPhase('to'));
    });
    return () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
    };
  }, [phase, index]);

  useEffect(() => {
    if (phase !== 'to') return;
    const clear = window.setTimeout(() => {
      leavingRef.current = null;
      setPhase('idle');
    }, 700);
    return () => window.clearTimeout(clear);
  }, [phase, index]);

  const openFilm = useCallback((target: AmbientFilm) => {
    if (!target.slug) return;
    openTheaterFromFilm({
      film: {
        id: target.id,
        name: target.name,
        slug: target.slug,
        mux_playback_id: target.mux_playback_id,
        story_date: target.story_date,
        runtime: target.runtime,
        last_line: null,
        location: null,
        sponsor: target.sponsor,
      },
      setSelectedFilm,
      setStartAt,
      setShowTheater,
    });
  }, []);

  const handleTimeUpdate = useCallback(
    (seconds: number) => {
      if (!selectedFilm?.id || !selectedFilm.slug) return;
      trackWatchProgress({
        filmId: selectedFilm.id,
        slug: selectedFilm.slug,
        seconds,
        duration: selectedFilm.runtime,
      });
    },
    [selectedFilm]
  );

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-white text-[#0B0B0C]">
      <header className="relative z-30 flex h-[44px] shrink-0 items-center justify-between px-5 md:h-[60px] md:px-[60px] lg:h-[100px] lg:px-[100px]">
        <Link href="/" className="flex items-center gap-3 text-[#0B0B0C]">
          <FjorrWordmark className="h-[22px] w-[35px]" />
          <span className="hidden font-sans text-[13px] font-medium tracking-normal text-black/55 sm:inline">
            {TAGLINE}
          </span>
        </Link>
        <div className="flex items-center gap-3.5 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              setLangOpen(false);
              setMenuOpen(false);
              setCommandOpen((open) => !open);
            }}
            aria-keyshortcuts="Meta+K"
            aria-expanded={commandOpen}
            aria-label="Open command"
            className={`inline-flex h-8 items-center gap-1.5 bg-transparent p-0 font-sans text-[12px] font-medium hover:text-black ${
              commandOpen ? 'text-[#0B0B0C]' : 'text-black/55'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
              <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.2 10.2L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            ⌘K
          </button>
          <button
            type="button"
            onClick={() => {
              setCommandOpen(false);
              setLangOpen(false);
              setMenuOpen((open) => !open);
            }}
            aria-label={menuOpen ? tNav('closeMenu') : tNav('openMenu')}
            aria-expanded={menuOpen}
            className={`relative flex h-8 w-8 items-center justify-center ${
              menuOpen ? 'text-[#0B0B0C]' : 'text-black/55 hover:text-black'
            }`}
          >
            <span
              className={`absolute left-1/2 top-1/2 block h-[1.5px] w-[14px] rounded-full bg-current transition-transform duration-300 ${
                menuOpen ? '-translate-x-1/2 -translate-y-1/2 rotate-45' : '-translate-x-1/2 -translate-y-[3px]'
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-[1.5px] w-[14px] rounded-full bg-current transition-transform duration-300 ${
                menuOpen ? '-translate-x-1/2 -translate-y-1/2 -rotate-45' : '-translate-x-1/2 translate-y-[3px]'
              }`}
            />
          </button>
          <button
            type="button"
            aria-label={tNav('language')}
            aria-expanded={langOpen}
            onClick={() => {
              setCommandOpen(false);
              setMenuOpen(false);
              setLangOpen((open) => !open);
            }}
            className={`flex items-center gap-1.5 ${
              langOpen ? 'text-[#0B0B0C]' : 'text-black/55 hover:text-black'
            }`}
          >
            <Icon name="globe" className="h-[18px] w-[18px]" />
            <span className="font-mono text-[11px] font-medium uppercase leading-none tracking-[0.05em]">
              {locale}
            </span>
          </button>
        </div>
      </header>

      <div className="relative mx-5 min-h-0 flex-1 overflow-hidden rounded-lg md:mx-[60px] lg:mx-[100px]">
        {films.map((item, slide) => {
          const active = slide === index;
          const leaving = leavingRef.current === slide && !active;
          const shift = dir * 72;
          const x = phase === 'idle' || (!active && !leaving)
            ? 0
            : active
              ? phase === 'from'
                ? shift
                : 0
              : phase === 'from'
                ? 0
                : -shift;
          const opacity = active
            ? phase === 'from'
              ? 0
              : 1
            : leaving
              ? phase === 'from'
                ? 1
                : 0
              : 0;
          const poster = heroSrc(item, frame);

          return (
            <article
              key={item.id}
              className={`absolute inset-0 ${
                active && phase !== 'from' ? 'z-10' : 'pointer-events-none'
              } ${phase === 'to' && (active || leaving) ? 'transition-[opacity,transform] duration-700 ease-out' : ''} ${
                active && !item.comingSoon ? 'cursor-pointer' : ''
              }`}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                zIndex: active ? 10 : leaving ? 9 : 0,
              }}
              aria-hidden={!active}
              onClick={() => {
                if (!active || item.comingSoon) return;
                openFilm(item);
              }}
            >
              {poster ? (
                <img
                  key={`${item.id}-${frame}`}
                  src={poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : null}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
                }}
              />

              <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-8 pb-8 pt-16 text-center md:items-start md:px-12 md:pb-10 md:text-left">
                {item.sponsor ? (
                  <div className="mb-2.5 font-sans text-[13px] font-bold tracking-wide text-white/90">
                    {item.sponsor}{' '}
                    <span className="font-medium text-white/70">{t('presents')}</span>
                  </div>
                ) : null}

                {item.name ? (
                  <h2 className="mb-3 max-w-lg font-interTight text-[40px] font-bold leading-[0.95] tracking-tight text-white md:text-[52px]">
                    {item.name}
                  </h2>
                ) : null}

                {item.teaser ? (
                  <p className="mb-5 max-w-xs font-sans text-sm font-medium leading-[1.4em] text-white/80">
                    {item.teaser}
                  </p>
                ) : null}

                <div className="flex items-center justify-center gap-5 md:justify-start" onClick={(event) => event.stopPropagation()}>
                  {item.comingSoon ? (
                    <span className="font-sans text-[15px] font-semibold tracking-normal text-white/70">
                      {t('comingSoon')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openFilm(item)}
                      className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-sans text-[15px] font-semibold tracking-normal text-white outline-none transition-opacity hover:opacity-70"
                    >
                      <img
                        src="/icons/play.svg"
                        className="h-3.5 w-3.5 select-none object-contain invert"
                        alt=""
                      />
                      <span>{t('play', { runtime: runtimeLabel(item.runtime) })}</span>
                    </button>
                  )}
                  <Link
                    href={`/film/${item.slug}#info`}
                    className="font-sans text-[15px] font-semibold tracking-normal text-white/80 hover:text-white"
                  >
                    {t('info')}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
        {commandOpen ? (
          <CommandLine
            films={films}
            onClose={() => setCommandOpen(false)}
            onPlay={(hit) => {
              if (hit.kind === 'artifact') {
                router.push(`/artifact/${hit.slug}`);
                return;
              }
              router.push(`/film/${hit.slug}`);
            }}
          />
        ) : null}
        {menuOpen ? <HouseMenu onClose={() => setMenuOpen(false)} /> : null}
        {langOpen ? <LanguagePanel onClose={() => setLangOpen(false)} /> : null}
      </div>

      <div className="grid h-[44px] shrink-0 grid-cols-[1fr_auto_1fr] items-center px-5 md:h-[60px] md:px-[60px] lg:h-[100px] lg:px-[100px]">
        <div />
        {films.length > 0 ? (
          <div className="flex items-center gap-2">
            {films.map((item, slide) => (
              <React.Fragment key={item.id}>
                {slide === Math.ceil(films.length / 2) ? (
                  <div className="mx-1 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => goTo(index - 1)}
                      aria-label="Previous film"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] text-[#0B0B0C] hover:bg-black/10"
                    >
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-180">
                        <polyline points="1.5 8.5 5 5 1.5 1.5" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo(index + 1)}
                      aria-label="Next film"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] text-[#0B0B0C] hover:bg-black/10"
                    >
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="1.5 1.5 5 5 1.5 8.5" />
                      </svg>
                    </button>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => goTo(slide)}
                  aria-label={item.comingSoon ? `${item.name || 'Film'}, coming soon` : item.name || `Film ${slide + 1}`}
                  aria-current={slide === index ? 'true' : undefined}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    slide === index ? 'bg-[#0B0B0C]' : 'bg-black/30 hover:bg-black/55'
                  }`}
                />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div />
        )}
        <div className="flex items-center justify-end">
          <CornerColophon />
        </div>
      </div>

      {showTheater && selectedFilm ? (
        <CinemaTheater
          film={selectedFilm}
          startAt={startAt}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            if (selectedFilm.id) finishWatchProgress(selectedFilm.id);
          }}
          onClose={() => {
            setShowTheater(false);
            setSelectedFilm(null);
            setStartAt(undefined);
          }}
        />
      ) : null}
    </div>
  );
}
