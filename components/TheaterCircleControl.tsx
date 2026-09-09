'use client';

import React, { useCallback, useRef } from 'react';
import { FjorrIcon } from '@/components/brand/FjorrMarks';

type Props = {
  progressRef: React.RefObject<SVGCircleElement | null>;
  timeRef: React.RefObject<HTMLSpanElement | null>;
  isPlaying: boolean;
  isScrubbing: boolean;
  isLight?: boolean;
  captionsActive?: boolean;
  showCCMenu?: boolean;
  playIcon: React.ReactNode;
  rewindIcon: React.ReactNode;
  forwardIcon: React.ReactNode;
  captionsIcon: React.ReactNode;
  fullscreenIcon: React.ReactNode;
  volumeIcon: React.ReactNode;
  playLabel: string;
  pauseLabel: string;
  rewindLabel: string;
  forwardLabel: string;
  captionsLabel: string;
  fullscreenLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  isMuted: boolean;
  onTogglePlay: () => void;
  onSeekBack: () => void;
  onSeekForward: () => void;
  onToggleCaptions: () => void;
  onToggleFullscreen: () => void;
  onToggleMute: () => void;
  onScrubStart: () => void;
  onScrubTo: (ratio: number) => void;
  onScrubEnd: () => void;
};

/** SVG geometry — viewBox 100×100, ring centered. */
const CX = 50;
const CY = 50;
const R = 42;
const CIRC = 2 * Math.PI * R;
const SIZE_CLASS =
  'w-[min(48vmin,300px)] h-[min(48vmin,300px)] sm:w-[min(40vmin,320px)] sm:h-[min(40vmin,320px)]';

function pointerToRatio(clientX: number, clientY: number, el: Element) {
  const rect = el.getBoundingClientRect();
  const x = clientX - (rect.left + rect.width / 2);
  const y = clientY - (rect.top + rect.height / 2);
  // 0 at top, clockwise
  const angle = (Math.atan2(y, x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
  return angle / (Math.PI * 2);
}

function FjorrMark({ className }: { className?: string }) {
  return <FjorrIcon className={className} />;
}

/**
 * Centered circle timeline — logo + play + single clock inside,
 * ±10 flanking, secondary actions under the ring.
 */
export default function TheaterCircleControl({
  progressRef,
  timeRef,
  isPlaying,
  isScrubbing,
  isLight = false,
  captionsActive = false,
  showCCMenu = false,
  playIcon,
  rewindIcon,
  forwardIcon,
  captionsIcon,
  fullscreenIcon,
  volumeIcon,
  playLabel,
  pauseLabel,
  rewindLabel,
  forwardLabel,
  captionsLabel,
  fullscreenLabel,
  muteLabel,
  unmuteLabel,
  isMuted,
  onTogglePlay,
  onSeekBack,
  onSeekForward,
  onToggleCaptions,
  onToggleFullscreen,
  onToggleMute,
  onScrubStart,
  onScrubTo,
  onScrubEnd,
}: Props) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const trackStroke = isLight ? 'rgba(11,11,12,0.14)' : 'rgba(245,245,247,0.22)';
  const ink = isLight ? 'text-[#0B0B0C]' : 'text-[#F5F5F7]';
  const muted = isLight ? 'text-[#0B0B0C]/50' : 'text-[#F5F5F7]/50';

  const scrubFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const root = ringRef.current;
      if (!root) return;
      onScrubTo(pointerToRatio(clientX, clientY, root));
    },
    [onScrubTo]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-circle-core]')) return;
      e.preventDefault();
      draggingRef.current = true;
      ringRef.current?.setPointerCapture(e.pointerId);
      onScrubStart();
      scrubFromEvent(e.clientX, e.clientY);
    },
    [onScrubStart, scrubFromEvent]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      scrubFromEvent(e.clientX, e.clientY);
    },
    [scrubFromEvent]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        ringRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      onScrubEnd();
    },
    [onScrubEnd]
  );

  const sideBtn =
    'w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity bg-transparent border-0 outline-none cursor-pointer shrink-0';
  const toolBtn =
    'w-10 h-10 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity bg-transparent border-0 outline-none cursor-pointer';

  return (
    <div
      data-ui-control="true"
      className={`pointer-events-auto flex flex-col items-center gap-5 sm:gap-6 select-none ${ink}`}
    >
      <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-7">
        <button
          type="button"
          onClick={onSeekBack}
          className={sideBtn}
          title={rewindLabel}
        >
          {rewindIcon}
        </button>

        <div
          ref={ringRef}
          className={`relative ${SIZE_CLASS} touch-none ${isScrubbing ? 'cursor-grabbing' : 'cursor-grab'}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full -rotate-90"
            aria-hidden
          >
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={trackStroke}
              strokeWidth="1.25"
            />
            <circle
              ref={progressRef}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="#ffd446"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC}
              style={{ transition: isScrubbing ? 'none' : 'stroke-dashoffset 80ms linear' }}
            />
          </svg>

          <div
            data-circle-core
            className="absolute inset-[18%] flex flex-col items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <FjorrMark className={`h-8 w-8 sm:h-9 sm:w-9 ${ink}`} />

            <button
              type="button"
              onClick={onTogglePlay}
              className={`flex items-center justify-center bg-transparent border-0 outline-none cursor-pointer transition-opacity hover:opacity-100 p-1 ${
                isPlaying ? 'opacity-75' : 'opacity-95'
              }`}
              title={isPlaying ? pauseLabel : playLabel}
            >
              {playIcon}
            </button>

            <span
              ref={timeRef}
              className={`font-mono text-[12px] sm:text-[13px] font-semibold tabular-nums tracking-tight leading-none ${muted}`}
            >
              0:00
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSeekForward}
          className={sideBtn}
          title={forwardLabel}
        >
          {forwardIcon}
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onToggleCaptions}
          aria-pressed={captionsActive}
          className={`${toolBtn} ${
            captionsActive || showCCMenu ? 'opacity-100' : ''
          } ${captionsActive ? 'text-[#ffd446]' : ''}`}
          title={captionsLabel}
        >
          {captionsIcon}
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={toolBtn}
          title={fullscreenLabel}
        >
          {fullscreenIcon}
        </button>
        <button
          type="button"
          onClick={onToggleMute}
          className={toolBtn}
          title={isMuted ? unmuteLabel : muteLabel}
        >
          {volumeIcon}
        </button>
      </div>
    </div>
  );
}

export const THEATER_CIRCLE_CIRCUMFERENCE = CIRC;
