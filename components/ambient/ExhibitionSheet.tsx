'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Footer from '@/components/Footer';
import { parseLocale } from '@/i18n/config';
import { parseVttCues, type VttCue } from '@/lib/vtt';

export type SheetCredit = { name: string; role: string };
export type SheetArtifact = { slug: string; name: string; image: string | null };
export type SheetTranscript = { language_code: string; content: string };
export type SheetTrack = { code: string; name: string; vtt_url?: string };

export type ExhibitionFilm = {
  name: string;
  teaser: string | null;
  description: string | null;
  note: string | null;
  directorNote: string | null;
  credits: SheetCredit[];
  artifacts: SheetArtifact[];
  transcripts: SheetTranscript[];
  tracks: SheetTrack[];
};

function clock(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function groupCredits(credits: SheetCredit[]) {
  const groups = new Map<string, string[]>();
  for (const credit of credits) {
    const role = credit.role || 'Credit';
    const names = groups.get(role) || [];
    if (credit.name && !names.includes(credit.name)) names.push(credit.name);
    groups.set(role, names);
  }
  return [...groups.entries()];
}

export default function ExhibitionSheet({
  film,
  onClose,
  onSeek,
}: {
  film: ExhibitionFilm;
  onClose: () => void;
  onSeek: (seconds: number) => void;
}) {
  const locale = parseLocale(useLocale());
  const [cues, setCues] = useState<VttCue[]>([]);
  const credits = groupCredits(film.credits);
  const synopsis = film.description?.trim() || film.teaser?.trim() || '';
  const logline = film.note?.trim() || (film.description ? film.teaser?.trim() : '') || '';

  const transcriptSource = useMemo(() => {
    const rows = film.transcripts || [];
    const match =
      rows.find((row) => row.language_code?.toLowerCase() === locale) ||
      rows.find((row) => row.language_code?.toLowerCase() === 'en') ||
      rows[0];
    return match?.content || '';
  }, [film.transcripts, locale]);

  useEffect(() => {
    const parsed = parseVttCues(transcriptSource);
    if (parsed.length) {
      setCues(parsed);
      return;
    }
    const track =
      film.tracks.find((track) => track.code?.toLowerCase() === locale && track.vtt_url) ||
      film.tracks.find((track) => track.vtt_url);
    if (!track?.vtt_url) return;
    let cancelled = false;
    void fetch(track.vtt_url)
      .then((response) => response.text())
      .then((text) => {
        if (!cancelled) setCues(parseVttCues(text));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [film.tracks, locale, transcriptSource]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100000] overflow-y-auto bg-white text-[#0B0B0C]">
      <div className="mx-auto w-full max-w-[760px] px-6 pb-0 pt-8 md:px-10">
        <div className="mb-12 flex items-center justify-between">
          <p className="font-sans text-[13px] font-medium text-black/45">{film.name}</p>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-[13px] font-semibold text-black/60 hover:text-black"
          >
            Close
          </button>
        </div>

        <section className="border-t border-black/10 py-10">
          <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.14em] text-black/35">01 / Context</p>
          {synopsis ? (
            <p className="max-w-[38rem] font-sans text-[17px] font-medium leading-relaxed text-black/90">
              {synopsis}
            </p>
          ) : null}
          {film.directorNote ? (
            <div className="mt-8 max-w-[38rem]">
              <p className="mb-2 font-sans text-[13px] text-black/40">Director</p>
              <p className="whitespace-pre-line font-sans text-[15px] leading-relaxed text-black/75">
                {film.directorNote}
              </p>
            </div>
          ) : null}
          {logline ? (
            <p className="mt-8 max-w-[32rem] font-sans text-[15px] leading-relaxed text-black/55">{logline}</p>
          ) : null}
        </section>

        {credits.length > 0 ? (
          <section className="border-t border-black/10 py-10">
            <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.14em] text-black/35">02 / Credits</p>
            <div className="grid max-w-[38rem] grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
              {credits.map(([role, names]) => (
                <p key={role} className="font-sans text-[14px] leading-snug">
                  <span className="text-black/40">{role}</span>
                  <span className="text-black"> {names.join(', ')}</span>
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {film.artifacts.length > 0 ? (
          <section className="border-t border-black/10 py-10">
            <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.14em] text-black/35">03 / Artifacts</p>
            <div className="-mx-6 flex gap-3 overflow-x-auto px-6 md:-mx-10 md:px-10">
              {film.artifacts.map((artifact) => (
                <Link key={artifact.slug} href={`/artifact/${artifact.slug}`} className="w-[180px] shrink-0">
                  {artifact.image ? (
                    <img src={artifact.image} alt="" className="h-[240px] w-full object-cover" />
                  ) : (
                    <div className="h-[240px] w-full bg-black/5" />
                  )}
                  <p className="mt-2 font-sans text-[13px] text-black/70">{artifact.name}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {cues.length > 0 ? (
          <section className="border-t border-black/10 py-10">
            <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.14em] text-black/35">04 / Transcript</p>
            <div className="max-w-[38rem]">
              {cues.map((cue) => (
                <button
                  key={`${cue.startSeconds}-${cue.dialogue}`}
                  type="button"
                  onClick={() => onSeek(cue.startSeconds)}
                  className="flex w-full gap-4 py-1.5 text-left font-sans text-[14px] leading-snug hover:text-black"
                >
                  <span className="w-12 shrink-0 font-mono text-[12px] text-black/40">{clock(cue.startSeconds)}</span>
                  <span className="text-black/80">{cue.dialogue}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <Footer variant="dark" />
    </div>
  );
}
