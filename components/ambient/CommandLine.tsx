'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { parseLocale } from '@/i18n/config';
import { createClient } from '@/lib/supabase/client';

type SeedFilm = {
  id: string;
  slug: string;
  name?: string | null;
  teaser?: string | null;
  runtime?: number | null;
  release_date?: string | null;
  comingSoon?: boolean;
  theme?: string | null;
};

export type CommandFilm = {
  id: string;
  slug: string;
  name: string;
  teaser: string | null;
  creator: string | null;
  theme: string | null;
  year: string | null;
  runtime: number | null;
  comingSoon: boolean;
  kind: 'film' | 'artifact';
};

const FILM_LIMIT = 4;

const SYSTEM = [
  { label: 'About Fjorr', href: '/about' },
  { label: 'Privacy & Data Sovereignty', href: '/privacy' },
  { label: 'Terms & Colophon', href: '/terms' },
];

function runtimeLabel(seconds?: number | null) {
  if (!seconds) return null;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes}m`;
}

function yearFrom(value?: string | null) {
  if (!value) return null;
  const year = new Date(value).getFullYear();
  return Number.isFinite(year) ? String(year) : null;
}

function isFuture(value?: string | null) {
  if (!value) return false;
  return new Date(value).getTime() > Date.now();
}

function toFilm(row: {
  id?: string;
  internal_id?: string;
  slug?: string;
  name?: string | null;
  teaser?: string | null;
  creator?: string | null;
  theme?: string | null;
  label?: string | null;
  release_date?: string | null;
  runtime?: number | null;
  comingSoon?: boolean;
  item_type?: string;
  kind?: 'film' | 'artifact';
}): CommandFilm | null {
  const slug = String(row.slug || '');
  if (!slug) return null;
  const kind = row.kind || (row.item_type === 'artifact' ? 'artifact' : 'film');
  return {
    id: String(row.internal_id || row.id || ''),
    slug,
    name: row.name || 'Untitled',
    teaser: row.teaser || row.label || null,
    creator: row.creator || null,
    theme: row.theme || null,
    year: yearFrom(row.release_date),
    runtime: row.runtime ?? null,
    comingSoon: kind === 'film' && (Boolean(row.comingSoon) || isFuture(row.release_date)),
    kind,
  };
}

function promptsFor(catalog: CommandFilm[]) {
  const prompts: string[] = [];
  if (catalog.some((film) => film.comingSoon)) prompts.push('Coming soon');

  const released = catalog.filter((film) => !film.comingSoon && film.runtime);
  const hasShort = released.some((film) => (film.runtime || 0) <= 10 * 60);
  const hasLonger = released.some((film) => (film.runtime || 0) > 10 * 60);
  if (hasShort && hasLonger) prompts.push('Under 10 minutes');

  const themes = [...new Set(catalog.map((film) => film.theme).filter(Boolean))] as string[];
  const useful = themes.find(
    (theme) => catalog.filter((film) => film.theme === theme).length < catalog.length
  );
  if (useful) prompts.push(useful);

  return prompts.slice(0, 3);
}

function parseIntent(query: string, catalog: CommandFilm[]) {
  let rest = query.toLowerCase().trim();
  let maxMinutes: number | null = null;
  let comingSoon = false;
  let theme: string | null = null;

  const under = rest.match(/\b(?:under|less than)\s+(\d+)\s*(?:m|min|mins|minute|minutes)\b/);
  if (under) {
    maxMinutes = Number(under[1]);
    rest = rest.replace(under[0], ' ');
  }

  if (/\bcoming soon\b/.test(rest)) {
    comingSoon = true;
    rest = rest.replace(/\bcoming soon\b/g, ' ');
  }

  const themes = [...new Set(catalog.map((film) => film.theme).filter(Boolean))] as string[];
  const matched = themes
    .slice()
    .sort((a, b) => b.length - a.length)
    .find((name) => rest.includes(name.toLowerCase()));
  if (matched) {
    theme = matched;
    rest = rest.replace(matched.toLowerCase(), ' ');
  }

  return {
    maxMinutes,
    comingSoon,
    theme,
    text: rest.replace(/\s+/g, ' ').trim(),
  };
}

function passesIntent(
  film: CommandFilm,
  intent: ReturnType<typeof parseIntent>
) {
  const filmOnly = intent.comingSoon || intent.maxMinutes != null;
  if (film.kind === 'artifact') return !filmOnly;
  if (intent.comingSoon && !film.comingSoon) return false;
  if (intent.maxMinutes != null) {
    if (!film.runtime || film.runtime > intent.maxMinutes * 60) return false;
  }
  if (intent.theme && film.theme?.toLowerCase() !== intent.theme.toLowerCase()) return false;
  return true;
}

function scoreFilm(film: CommandFilm, text: string) {
  if (!text) return 1;
  const name = film.name.toLowerCase();
  const creator = (film.creator || '').toLowerCase();
  const teaser = (film.teaser || '').toLowerCase();
  const theme = (film.theme || '').toLowerCase();
  let score = 0;
  if (name === text) score += 100;
  else if (name.startsWith(text)) score += 60;
  else if (name.includes(text)) score += 40;
  if (film.year === text) score += 30;
  if (creator.includes(text)) score += 35;
  if (theme.includes(text)) score += 25;
  if (teaser.includes(text)) score += 15;
  return score;
}

function rankFilms(catalog: CommandFilm[], query: string) {
  const intent = parseIntent(query, catalog);
  const hasConstraint = intent.comingSoon || intent.maxMinutes != null || Boolean(intent.theme);
  return catalog
    .filter((film) => passesIntent(film, intent))
    .map((film) => ({ film, score: scoreFilm(film, intent.text) }))
    .filter((row) => (intent.text ? row.score > 0 : hasConstraint || true))
    .sort((a, b) => b.score - a.score || a.film.name.localeCompare(b.film.name))
    .map((row) => row.film);
}

function FilmRow({
  film,
  selected,
  onHover,
  onClick,
}: {
  film: CommandFilm;
  selected: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onClick}
      className={`flex w-full flex-col rounded-[8px] px-3 py-2 text-left ${
        selected ? 'bg-black/[0.05] text-[#0B0B0C]' : 'text-[#0B0B0C]/85'
      }`}
    >
      <span className="flex w-full items-baseline justify-between gap-4">
        <span className="font-sans text-[14px] font-semibold">{film.name}</span>
        <span className="shrink-0 font-sans text-[12px] text-black/40">
          {film.kind === 'artifact'
            ? 'Artifact'
            : film.comingSoon
              ? 'Coming soon'
              : runtimeLabel(film.runtime)}
        </span>
      </span>
      {film.teaser ? (
        <span className="mt-0.5 line-clamp-1 font-sans text-[13px] text-black/50">{film.teaser}</span>
      ) : null}
    </button>
  );
}

export default function CommandLine({
  films,
  onClose,
  onPlay,
}: {
  films: SeedFilm[];
  onClose: () => void;
  onPlay: (hit: CommandFilm) => void;
}) {
  const locale = parseLocale(useLocale());
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState<CommandFilm[]>(() =>
    films.map((film) => toFilm(film)).filter((film): film is CommandFilm => Boolean(film))
  );
  const [artifacts, setArtifacts] = useState<CommandFilm[]>([]);
  const [remoteHits, setRemoteHits] = useState<CommandFilm[] | null>(null);
  const [active, setActive] = useState(0);

  const prompts = useMemo(() => promptsFor(catalog), [catalog]);
  const searching = query.trim().length > 0;
  const localHits = useMemo(() => {
    if (!searching) return [];
    const intent = parseIntent(query, catalog);
    const filmOnly = intent.comingSoon || intent.maxMinutes != null;
    const rankedFilms = rankFilms(catalog, query);
    if (filmOnly && !intent.text) return rankedFilms;
    const rankedArtifacts = rankFilms(artifacts, query);
    return [...rankedFilms, ...rankedArtifacts].sort(
      (a, b) => scoreFilm(b, intent.text) - scoreFilm(a, intent.text) || a.name.localeCompare(b.name)
    );
  }, [artifacts, catalog, query, searching]);
  const hits = (remoteHits && remoteHits.length ? remoteHits : localHits).slice(0, FILM_LIMIT);
  const listed = catalog.slice(0, FILM_LIMIT);
  const rowCount = searching ? hits.length : listed.length + prompts.length + SYSTEM.length;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query, hits.length, catalog.length]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    void (async () => {
      const { data, error } = await supabase
        .from('search')
        .select('internal_id, slug, name, teaser, creator, theme, label, runtime, release_date, item_type, locale')
        .eq('locale', locale);
      if (cancelled) return;
      if (error || !data?.length) return;
      const rows = data as Array<{
        internal_id?: string;
        slug?: string;
        name?: string | null;
        teaser?: string | null;
        creator?: string | null;
        theme?: string | null;
        label?: string | null;
        runtime?: number | null;
        release_date?: string | null;
        item_type?: string;
      }>;
      const loaded = rows
        .filter((row) => row.item_type === 'film')
        .map((row) => toFilm(row))
        .filter((film): film is CommandFilm => Boolean(film));
      const loadedArtifacts = rows
        .filter((row) => row.item_type === 'artifact')
        .map((row) => toFilm(row))
        .filter((film): film is CommandFilm => Boolean(film));
      setArtifacts(loadedArtifacts);
      if (!loadedArtifacts.length && locale !== 'en') {
        const fallback = await supabase
          .from('search')
          .select('internal_id, slug, name, teaser, creator, theme, label, runtime, release_date, item_type, locale')
          .eq('item_type', 'artifact')
          .eq('locale', 'en');
        if (!cancelled && fallback.data?.length) {
          setArtifacts(
            (fallback.data as Array<{
              internal_id?: string;
              slug?: string;
              name?: string | null;
              teaser?: string | null;
              creator?: string | null;
              theme?: string | null;
              label?: string | null;
              runtime?: number | null;
              release_date?: string | null;
              item_type?: string;
            }>)
              .map((row) => toFilm(row))
              .filter((item): item is CommandFilm => Boolean(item))
          );
        }
      }
      const order = new Map(films.map((film, index) => [film.slug, index]));
      loaded.sort((a, b) => {
        const aSoon = a.comingSoon ? 1 : 0;
        const bSoon = b.comingSoon ? 1 : 0;
        if (aSoon !== bSoon) return aSoon - bSoon;
        const aIndex = order.get(a.slug);
        const bIndex = order.get(b.slug);
        if (aIndex != null && bIndex != null) return aIndex - bIndex;
        if (aIndex != null) return -1;
        if (bIndex != null) return 1;
        return a.name.localeCompare(b.name);
      });
      setCatalog(loaded);
    })();
    return () => {
      cancelled = true;
    };
  }, [films, locale]);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setRemoteHits(null);
      return;
    }
    const intent = parseIntent(term, catalog);
    if (!intent.text) {
      setRemoteHits(null);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('search_items', {
          search_term: intent.text,
          p_locale: locale,
        });
        if (cancelled) return;
        if (error) {
          console.error('search_items failed:', error.message);
          setRemoteHits(null);
          return;
        }
        const known = new Map(
          [...catalog, ...artifacts].map((item) => [`${item.kind}:${item.slug}`, item])
        );
        const filmsFromSearch = (data || [])
          .map((row: { item_type?: string; slug?: string }) => {
            const kind = row.item_type === 'artifact' ? 'artifact' : 'film';
            return known.get(`${kind}:${String(row.slug || '')}`) || toFilm(row);
          })
          .filter((film: CommandFilm | null): film is CommandFilm => Boolean(film))
          .filter((film: CommandFilm) => passesIntent(film, intent));
        const seen = new Set<string>();
        const merged = [...localHits, ...filmsFromSearch].filter((film) => {
          const key = `${film.kind}:${film.slug}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setRemoteHits(merged);
      } catch {
        if (!cancelled) setRemoteHits(null);
      }
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, locale, catalog, artifacts, localHits]);

  const choose = (index: number) => {
    if (!searching) {
      if (index < listed.length) {
        const film = listed[index];
        if (!film) return;
        onClose();
        onPlay(film);
        return;
      }
      const promptIndex = index - listed.length;
      if (promptIndex < prompts.length) {
        setQuery(prompts[promptIndex]);
        return;
      }
      const page = SYSTEM[promptIndex - prompts.length];
      if (!page) return;
      onClose();
      router.push(page.href);
      return;
    }
    const hit = hits[index];
    if (!hit) return;
    onClose();
    onPlay(hit);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActive((current) => (rowCount === 0 ? 0 : (current + 1) % rowCount));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive((current) => (rowCount === 0 ? 0 : (current - 1 + rowCount) % rowCount));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rowCount]);

  return (
    <div
      role="dialog"
      aria-label="Command"
      className="absolute inset-0 z-30 flex flex-col bg-white text-[#0B0B0C]"
    >
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            choose(active);
          }}
        >
          <label className="sr-only" htmlFor="fjorr-command">
            Describe a mood, director, or cinematic intent
          </label>
          <div className="flex items-center gap-3 border-b border-black/[0.08] px-4">
            <span className="font-sans text-[15px] text-black/40" aria-hidden>
              ⌘
            </span>
            <input
              ref={inputRef}
              id="fjorr-command"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="A title, director, or a short phrase"
              className="h-14 w-full bg-transparent font-sans text-[15px] text-[#0B0B0C] outline-none placeholder:text-black/35"
            />
          </div>
        </form>

        <div className="min-h-0 flex-1 px-6 py-4 md:px-10">
          {searching ? (
            hits.length === 0 ? (
              <p className="px-3 py-2 font-sans text-[13px] text-black/40">No films</p>
            ) : (
              hits.map((film, index) => (
                <FilmRow
                  key={`${film.id}-${film.slug}`}
                  film={film}
                  selected={active === index}
                  onHover={() => setActive(index)}
                  onClick={() => choose(index)}
                />
              ))
            )
          ) : (
            <>
              {listed.map((film, index) => (
                <FilmRow
                  key={`${film.id}-${film.slug}`}
                  film={film}
                  selected={active === index}
                  onHover={() => setActive(index)}
                  onClick={() => choose(index)}
                />
              ))}
              {prompts.length > 0 ? (
                <>
                  <p className="px-3 pb-1.5 pt-3 font-sans text-[11px] uppercase tracking-[0.14em] text-black/40">
                    Prompts
                  </p>
                  {prompts.map((prompt, index) => {
                    const row = listed.length + index;
                    return (
                      <button
                        key={prompt}
                        type="button"
                        onMouseEnter={() => setActive(row)}
                        onClick={() => choose(row)}
                        className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left font-sans text-[13px] ${
                          active === row ? 'bg-black/[0.05] text-[#0B0B0C]' : 'text-black/70'
                        }`}
                      >
                        <span className="text-black/35">↳</span>
                        <span>{prompt}</span>
                      </button>
                    );
                  })}
                </>
              ) : null}
              <p className="px-3 pb-1.5 pt-3 font-sans text-[11px] uppercase tracking-[0.14em] text-black/40">
                System
              </p>
              {SYSTEM.map((page, index) => {
                const row = listed.length + prompts.length + index;
                return (
                  <button
                    key={page.href}
                    type="button"
                    onMouseEnter={() => setActive(row)}
                    onClick={() => choose(row)}
                    className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left font-sans text-[13px] ${
                      active === row ? 'bg-black/[0.05] text-[#0B0B0C]' : 'text-black/70'
                    }`}
                  >
                    <span className="text-black/35">↳</span>
                    <span>{page.label}</span>
                  </button>
                );
              })}
            </>
          )}
        </div>
    </div>
  );
}
