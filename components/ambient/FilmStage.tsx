'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { type AppLocale } from '@/i18n/config';
import { FjorrWordmark } from '@/components/brand/FjorrMarks';
import { Icon } from '@/components/ui/Icons';
import TheaterOpenShell from '@/components/TheaterOpenShell';
import { openTheaterFromFilm } from '@/lib/theater-open';
import {
  finishWatchProgress,
  trackWatchProgress,
} from '@/lib/watch-progress';
import CommandLine from '@/components/ambient/CommandLine';
import CornerColophon from '@/components/ambient/CornerColophon';
import HouseMenu from '@/components/ambient/HouseMenu';
import LanguagePanel from '@/components/ambient/LanguagePanel';
import ExhibitionSheet, { type ExhibitionFilm } from '@/components/ambient/ExhibitionSheet';

const CinemaTheater = dynamic(() => import('@/components/CinemaTheater'), {
  ssr: false,
  loading: () => <TheaterOpenShell />,
});

const TAGLINE = "Short films of the world's greatest stories.";
const MERCEDES_SPONSOR_ID = '0afb5b63-1e90-4a37-824d-33cc41afde3d';

export type FilmStageProps = {
  id: string;
  name: string;
  slug: string;
  teaser: string | null;
  runtime: number | null;
  releaseDate: string | null;
  comingSoon: boolean;
  muxPlaybackId: string | null;
  heroWide: string | null;
  heroClsx: string | null;
  heroTall: string | null;
  sponsorId: string | null;
  exhibition: ExhibitionFilm;
};

function runtimeLabel(seconds?: number | null) {
  const minutes = Math.ceil((seconds || 0) / 60);
  return minutes === 0 ? '1m' : `${minutes}m`;
}

function posterSrc(film: FilmStageProps, frame: 'wide' | 'clsx' | 'tall') {
  if (frame === 'wide') return film.heroWide || film.heroClsx || film.heroTall;
  if (frame === 'clsx') return film.heroClsx || film.heroWide || film.heroTall;
  return film.heroTall || film.heroClsx || film.heroWide;
}

function useHeroFrame() {
  const [frame, setFrame] = useState<'wide' | 'clsx' | 'tall'>('wide');
  useEffect(() => {
    const apply = () => {
      const width = window.innerWidth;
      const side = width >= 1024 ? 100 : width >= 768 ? 60 : 20;
      const top = width >= 1024 ? 100 : width >= 768 ? 60 : 44;
      const bottom = width >= 1024 ? 100 : width >= 768 ? 60 : 44;
      const aspect = (width - side * 2) / Math.max(window.innerHeight - top - bottom, 1);
      setFrame(aspect >= 1.5 ? 'wide' : aspect >= 0.75 ? 'clsx' : 'tall');
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);
  return frame;
}

export default function FilmStage(film: FilmStageProps) {
  const t = useTranslations('Film');
  const tNav = useTranslations('Nav');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const frame = useHeroFrame();
  const [commandOpen, setCommandOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [showTheater, setShowTheater] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<any>(null);
  const [startAt, setStartAt] = useState<number | undefined>(undefined);
  const [seekKey, setSeekKey] = useState(0);

  const sponsor =
    film.sponsorId === MERCEDES_SPONSOR_ID ? 'Mercedes-Benz' : null;
  const poster = posterSrc(film, frame);

  const openInfo = useCallback(() => {
    setInfoOpen(true);
    if (window.location.hash !== '#info') {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#info`);
    }
  }, []);

  const closeInfo = useCallback(() => {
    setInfoOpen(false);
    if (window.location.hash === '#info') {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash === '#info') setInfoOpen(true);
  }, []);

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

  const play = useCallback((at?: number) => {
    if (film.comingSoon) return;
    setStartAt(at);
    setSeekKey((key) => key + 1);
    openTheaterFromFilm({
      film: {
        id: film.id,
        name: film.name,
        slug: film.slug,
        mux_playback_id: film.muxPlaybackId,
        runtime: film.runtime,
        sponsor,
      },
      setSelectedFilm,
      setStartAt,
      setShowTheater,
    });
    if (at != null) setStartAt(at);
  }, [film, sponsor]);

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
        <article
          className={`absolute inset-0 ${film.comingSoon ? '' : 'cursor-pointer'}`}
          onClick={() => play()}
        >
          {poster ? <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover object-center" /> : null}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-8 pb-8 pt-16 text-center md:items-start md:px-12 md:pb-10 md:text-left">
            {sponsor ? (
              <div className="mb-2.5 font-sans text-[13px] font-bold tracking-wide text-white/90">
                {sponsor} <span className="font-medium text-white/70">{t('presents')}</span>
              </div>
            ) : null}
            <h1 className="mb-3 max-w-lg font-interTight text-[40px] font-bold leading-[0.95] tracking-tight text-white md:text-[52px]">
              {film.name}
            </h1>
            {film.teaser ? (
              <p className="mb-5 max-w-xs font-sans text-sm font-medium leading-[1.4em] text-white/80">{film.teaser}</p>
            ) : null}
            <div className="flex items-center gap-5">
              {film.comingSoon ? (
                <span className="font-sans text-[15px] font-semibold text-white/70">{t('comingSoon')}</span>
              ) : (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    play();
                  }}
                  className="inline-flex items-center gap-2 bg-transparent p-0 font-sans text-[15px] font-semibold text-white hover:opacity-70"
                >
                  <img src="/icons/play.svg" alt="" className="h-3.5 w-3.5 invert" />
                  <span>{t('play', { runtime: runtimeLabel(film.runtime) })}</span>
                </button>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openInfo();
                }}
                className="bg-transparent p-0 font-sans text-[15px] font-semibold text-white/80 hover:text-white"
              >
                {t('info')}
              </button>
            </div>
          </div>
        </article>
        {commandOpen ? (
          <CommandLine
            films={[{ id: film.id, slug: film.slug, name: film.name, teaser: film.teaser, runtime: film.runtime, comingSoon: film.comingSoon }]}
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
      <div className="flex h-[44px] shrink-0 items-center justify-end px-5 md:h-[60px] md:px-[60px] lg:h-[100px] lg:px-[100px]">
        <CornerColophon />
      </div>

      {infoOpen ? (
        <ExhibitionSheet
          film={film.exhibition}
          onClose={closeInfo}
          onSeek={(seconds) => play(seconds)}
        />
      ) : null}

      {showTheater && selectedFilm ? (
        <CinemaTheater
          key={seekKey}
          film={selectedFilm}
          startAt={startAt}
          onTimeUpdate={(seconds: number) => {
            trackWatchProgress({
              filmId: film.id,
              slug: film.slug,
              seconds,
              duration: film.runtime,
            });
          }}
          onEnded={() => finishWatchProgress(film.id)}
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
