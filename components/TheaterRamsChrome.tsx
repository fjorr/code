'use client';

import React from 'react';
import { FjorrIcon } from '@/components/brand/FjorrMarks';

type IdentityProps = {
  isLight?: boolean;
  filmTitle?: string;
  filmMeta?: string;
  /** Quiet credit under meta — reserved, unused for now. */
  filmCredit?: string;
  logoLabel?: string;
  onLogoClick?: () => void;
  className?: string;
};

/** Logo + title + subhead — used above plaque media. */
export function TheaterRamsIdentity({
  isLight = false,
  filmTitle,
  filmMeta,
  filmCredit,
  logoLabel,
  onLogoClick,
  className = '',
}: IdentityProps) {
  const muted = isLight ? 'text-[#0B0B0C]/55' : 'text-[#F5F5F7]/55';
  const ink = isLight ? 'text-[#0B0B0C]' : 'text-[#F5F5F7]';

  return (
    <div
      data-ui-control="true"
      className={`pointer-events-auto flex flex-col items-center gap-3 w-[min(84vw,320px)] select-none ${ink} ${className}`}
    >
      {onLogoClick ? (
        <button
          type="button"
          onClick={onLogoClick}
          aria-label={logoLabel || 'Fjorr'}
          title={logoLabel}
          className="bg-transparent border-0 outline-none cursor-pointer p-0 opacity-80 hover:opacity-100 transition-opacity"
        >
          <FjorrIcon className="h-7 w-7" />
        </button>
      ) : null}

      {filmTitle ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="font-sans text-[15px] font-medium tracking-normal leading-snug text-center truncate w-full">
            {filmTitle}
          </p>
          {filmMeta ? (
            <p
              className={`font-sans text-[12px] font-normal tracking-normal leading-snug text-center truncate w-full ${muted}`}
            >
              {filmMeta}
            </p>
          ) : null}
          {filmCredit ? (
            <p
              className={`font-mono text-[11px] font-medium tracking-normal leading-snug text-center truncate w-full ${muted}`}
            >
              {filmCredit}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  scrubberRef: React.RefObject<HTMLInputElement | null>;
  playheadRef: React.RefObject<HTMLDivElement | null>;
  elapsedRef: React.RefObject<HTMLSpanElement | null>;
  durationRef: React.RefObject<HTMLSpanElement | null>;
  isScrubbing: boolean;
  isLight?: boolean;
  filmTitle?: string;
  filmMeta?: string;
  filmCredit?: string;
  toolsSlot?: React.ReactNode;
  /** Extra content under tools (Plus note strip). */
  belowToolsSlot?: React.ReactNode;
  /** Plus mode — playhead becomes a note-anchor pin on the scrubber. */
  plusMode?: boolean;
  logoLabel?: string;
  onLogoClick?: () => void;
  onScrubStart: () => void;
  onScrubChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScrubEnd: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  /** When true, omit logo/title (rendered above plaque instead). */
  hideHeader?: boolean;
};

/** Matches plaque video width so scrubber aligns with the frame. */
export const PLAQUE_WIDTH =
  'w-[min(72vw,300px)] sm:w-[min(58vw,420px)] lg:w-[min(48vw,560px)] xl:w-[min(42vw,640px)]';

const CHROME_WIDTH = PLAQUE_WIDTH;

/** Scrubber thumb/track reset — module-level so it isn't rebuilt every render. */
const RAMS_SCRUB_STYLE = `
  .fjorr-rams-scrub::-webkit-slider-thumb{
    -webkit-appearance:none!important;
    appearance:none!important;
    width:28px!important;
    height:44px!important;
    background:transparent!important;
    border:0!important;
    border-radius:0!important;
    box-shadow:none!important;
    opacity:0!important;
  }
  .fjorr-rams-scrub::-moz-range-thumb{
    appearance:none!important;
    width:28px!important;
    height:44px!important;
    background:transparent!important;
    border:0!important;
    border-radius:0!important;
    box-shadow:none!important;
    opacity:0!important;
  }
  .fjorr-rams-scrub::-webkit-slider-runnable-track,
  .fjorr-rams-scrub::-moz-range-track{
    background:transparent!important;
    border:0!important;
  }
`;

/**
 * Museum plaque chrome — no glass.
 * Logo → title → thin scrubber → centered tools.
 */
export default function TheaterRamsChrome({
  scrubberRef,
  playheadRef,
  elapsedRef,
  durationRef,
  isScrubbing,
  isLight = false,
  filmTitle,
  filmMeta,
  filmCredit,
  toolsSlot,
  belowToolsSlot,
  plusMode = false,
  logoLabel,
  onLogoClick,
  onScrubStart,
  onScrubChange,
  onScrubEnd,
  hideHeader = false,
}: Props) {
  const muted = isLight ? 'text-[#0B0B0C]/55' : 'text-[#F5F5F7]/55';
  const ink = isLight ? 'text-[#0B0B0C]' : 'text-[#F5F5F7]';
  const hatch = isLight ? '#0B0B0C' : '#F5F5F7';
  const clockClass =
    'font-mono text-[12px] font-medium tabular-nums tracking-normal leading-none shrink-0 min-w-[3.25em] transition-colors duration-150';
  const clockTone = isScrubbing || plusMode ? ink : muted;

  return (
    <div
      data-ui-control="true"
      className={`pointer-events-auto flex flex-col items-center select-none ${ink} ${CHROME_WIDTH} ${
        plusMode ? 'gap-3.5' : 'gap-5'
      }`}
    >
      {!hideHeader ? (
        <TheaterRamsIdentity
          isLight={isLight}
          filmTitle={filmTitle}
          filmMeta={filmMeta}
          filmCredit={filmCredit}
          logoLabel={logoLabel}
          onLogoClick={onLogoClick}
          className="!w-full"
        />
      ) : null}

      <div className="w-full flex items-center gap-2.5">
        <style dangerouslySetInnerHTML={{ __html: RAMS_SCRUB_STYLE }} />
        <span ref={elapsedRef} className={`${clockClass} text-left ${clockTone}`} />
        <div className="relative min-w-0 flex-1 h-11">
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-[8px] -translate-y-1/2 rounded-full overflow-hidden opacity-55"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  -45deg,
                  transparent 0 1px,
                  ${hatch} 1px 2px
                ),
                repeating-linear-gradient(
                  45deg,
                  transparent 0 1px,
                  ${hatch} 1px 2px
                )
              `,
            }}
            aria-hidden
          />
          <div
            ref={playheadRef}
            className="pointer-events-none absolute z-20 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          >
            {plusMode ? (
              /* Bold plus at the note frame — thicker arms so it reads on the hatch. */
              <svg
                viewBox="0 0 16 16"
                className={`w-4 h-4 ${isLight ? 'text-[#1B6FBF]' : 'text-[#8FE0F2]'}`}
                fill="currentColor"
                aria-hidden
              >
                <path d="M6.25 1.5a1.75 1.75 0 0 1 3.5 0v4.75H14.5a1.75 1.75 0 0 1 0 3.5H9.75V14.5a1.75 1.75 0 0 1-3.5 0V9.75H1.5a1.75 1.75 0 0 1 0-3.5h4.75V1.5Z" />
              </svg>
            ) : (
              <div
                className={`rounded-full transition-[width,height] duration-100 ${
                  isLight ? 'bg-[#0B0B0C]' : 'bg-[#F5F5F7]'
                } ${isScrubbing ? 'w-[13px] h-[13px]' : 'w-[12px] h-[12px]'}`}
              />
            )}
          </div>
          <input
            ref={scrubberRef}
            type="range"
            min={0}
            max={100}
            step="any"
            defaultValue={0}
            onMouseDown={onScrubStart}
            onTouchStart={onScrubStart}
            onChange={onScrubChange}
            onMouseUp={onScrubEnd}
            onTouchEnd={onScrubEnd}
            aria-label="Seek"
            className="fjorr-rams-scrub absolute inset-0 w-full h-full m-0 appearance-none bg-transparent cursor-pointer outline-none z-30 touch-none focus:outline-none focus:ring-0"
            style={{ WebkitAppearance: 'none', appearance: 'none', background: 'transparent' }}
          />
        </div>
        <span ref={durationRef} className={`${clockClass} text-right ${clockTone}`} />
      </div>

      <div className={`min-h-[18px] flex items-center justify-center w-full ${muted}`}>
        <div className="flex items-center justify-center flex-wrap min-w-0 gap-x-2 gap-y-2 min-[400px]:gap-x-3.5">
          {toolsSlot}
        </div>
      </div>

      {belowToolsSlot ? (
        <div className="w-full flex justify-center">{belowToolsSlot}</div>
      ) : null}
    </div>
  );
}
