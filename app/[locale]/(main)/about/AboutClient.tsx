'use client';

import React, { useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { FjorrIcon, FjorrWordmark } from '@/components/brand/FjorrMarks';

export type AboutCopy = {
  heroLines: string[];
  manifestoHeadline: string;
  manifestoParagraphs: string[];
  logoLabel: string;
  logoTitle: string;
  logoBody: string;
  nameLabel: string;
  nameTitle: string;
  nameBody: React.ReactNode;
  exploreFjorr: string;
};

const SCOUT_SRC = '/fjorr_scout.mp4';

/**
 * About — three beats:
 * 1 Statement (Matter / Myth) — on-screen until scroll; Matter fades out quickly
 * 2 Scout stage — small overlay line on the girl, then body reveal
 * 3 Name / mark cards
 */
export default function AboutClient({ copy }: { copy: AboutCopy }) {
  const { heroLines, manifestoHeadline, manifestoParagraphs } = copy;

  const heroSectionRef = useRef<HTMLElement>(null);
  const scoutSectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const markGridRef = useRef<HTMLDivElement>(null);
  const markCardRef = useRef<HTMLElement>(null);
  const nameCardRef = useRef<HTMLElement>(null);

  // Attach scout video src when section nears viewport
  useEffect(() => {
    const el = scoutSectionRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (!video.getAttribute('src')) {
          video.src = SCOUT_SRC;
          video.load();
        }
        io.disconnect();
      },
      { rootMargin: '100px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Motions — GSAP loaded on demand
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let matterExit: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mythExit: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scoutTl: any = null;
    let scoutTrigger: { kill: () => void } | null = null;
    let ctx: { revert: () => void } | null = null;

    const run = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const video = videoRef.current;

      if (reduced) {
        gsap.set('.reveal-line', { visibility: 'visible', opacity: 1 });
        gsap.set('.scout-headline', { opacity: 1, y: 0 });
        gsap.set('.scout-body-p', { opacity: 1, y: 0 });
        gsap.set('.scout-explore', { opacity: 1 });
      } else {
        // Hero copy on-screen from load. Matter stays until scroll, then
        // fades out over a short scrub distance; Myth holds until scout.
        gsap.set('.reveal-line', {
          visibility: 'visible',
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        });

        matterExit = gsap.fromTo(
          '.reveal-line-matter',
          { opacity: 1, y: 0, filter: 'blur(0px)' },
          {
            opacity: 0,
            filter: 'blur(10px)',
            y: -8,
            ease: 'power1.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: 'top top',
              // Short range → quick fade as soon as the user scrolls.
              end: '+=90',
              scrub: 0.05,
            },
          }
        );

        mythExit = gsap.fromTo(
          '.reveal-line-myth',
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -16,
            ease: 'power1.in',
            immediateRender: false,
            scrollTrigger: {
              trigger: scoutSectionRef.current,
              start: 'top 85%',
              end: 'top 45%',
              scrub: 0.2,
            },
          }
        );

        gsap.set('.scout-headline', { opacity: 0, y: 10 });
        gsap.set('.scout-body-p', { opacity: 0, y: 14 });
        gsap.set('.scout-explore', { opacity: 0 });
      }

      const ensureScoutSrc = () => {
        if (!video) return;
        if (!video.getAttribute('src')) {
          video.src = SCOUT_SRC;
          video.load();
        }
      };

      const playScout = () => {
        if (!video || reduced) return;
        ensureScoutSrc();
        video.pause();
        video.currentTime = 0;
        video.loop = false;
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      };

      const resetScoutReveal = () => {
        if (reduced) return;
        scoutTl?.kill();
        scoutTl = null;
        if (video) {
          video.pause();
          try {
            video.currentTime = 0;
          } catch {
            /* ignore seek before load */
          }
        }
        gsap.set('.scout-headline', { opacity: 0, y: 10 });
        gsap.set('.scout-body-p', { opacity: 0, y: 14 });
        gsap.set('.scout-explore', { opacity: 0 });
      };

      const showScoutCopy = () => {
        gsap.set('.scout-headline', { opacity: 1, y: 0 });
        gsap.set('.scout-body-p', { opacity: 1, y: 0 });
        gsap.set('.scout-explore', { opacity: 1 });
      };

      const runScoutReveal = () => {
        if (reduced) return;
        // Restart cleanly if user scrolled away mid-sequence.
        scoutTl?.kill();
        playScout();

        scoutTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        // Overlay line soon after enter — don’t wait on the scout clip.
        scoutTl.fromTo(
          '.scout-headline',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.2 }
        );
        // Body comes in right after the line, so fast scrollers still catch it.
        scoutTl.fromTo(
          '.scout-body-p',
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          '+=0.2'
        );
        scoutTl.fromTo(
          '.scout-explore',
          { opacity: 0 },
          { opacity: 1, duration: 0.35 },
          '-=0.2'
        );
      };

      // Replay when scrolling back up past the stage, then down again.
      // If they leave downward mid-sequence, snap copy visible so it isn’t blank.
      scoutTrigger = ScrollTrigger.create({
        trigger: scoutSectionRef.current,
        start: 'top 72%',
        onEnter: runScoutReveal,
        onLeave: () => {
          scoutTl?.kill();
          scoutTl = null;
          showScoutCopy();
        },
        onLeaveBack: resetScoutReveal,
      });

      ctx = gsap.context(() => {
        gsap.set('.helmet-frame', { opacity: 0, visibility: 'hidden' });
        gsap.set('.helmet-frame-1', {
          opacity: reduced ? 1 : 0,
          visibility: reduced ? 'visible' : 'hidden',
        });
        gsap.set('.fjorr-about-wordmark', { opacity: reduced ? 1 : 0 });
        gsap.set('.mark-copy', { opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 });

        if (reduced) {
          gsap.set('.helmet-frame-1', { opacity: 1, visibility: 'visible' });
          return;
        }

        // Fire when each card is actually in view (not when the grid top peeks in).
        const cardEnter = {
          start: 'top 68%',
          once: true,
        } as const;

        const markTl = gsap.timeline({
          delay: 0.2,
          scrollTrigger: {
            trigger: markCardRef.current,
            ...cardEnter,
          },
        });

        markTl.set('.helmet-frame-1', { opacity: 1, visibility: 'visible' });
        markTl.to('.helmet-frame-2', {
          opacity: 1,
          visibility: 'visible',
          duration: 0.08,
          ease: 'steps(1)',
        });
        markTl.set('.helmet-frame-1', { opacity: 0, visibility: 'hidden' });
        markTl.to('.helmet-frame-3', {
          opacity: 1,
          visibility: 'visible',
          duration: 0.08,
          ease: 'steps(1)',
        });
        markTl.set('.helmet-frame-2', { opacity: 0, visibility: 'hidden' });
        markTl.to('.helmet-frame-4', {
          opacity: 1,
          visibility: 'visible',
          duration: 0.08,
          ease: 'steps(1)',
        });
        markTl.set('.helmet-frame-3', { opacity: 0, visibility: 'hidden' });
        markTl.to('.helmet-frame-5', {
          opacity: 1,
          visibility: 'visible',
          duration: 0.08,
          ease: 'steps(1)',
        });
        markTl.set('.helmet-frame-4', { opacity: 0, visibility: 'hidden' });
        markTl.to('.mark-copy-logo', { opacity: 1, y: 0, duration: 0.35 }, '-=0.05');

        const nameTl = gsap.timeline({
          delay: 0.25,
          scrollTrigger: {
            trigger: nameCardRef.current,
            ...cardEnter,
          },
        });

        nameTl.to('.fjorr-about-wordmark', { opacity: 1, duration: 0.6, ease: 'power2.out' });
        nameTl.to(
          '.mark-copy-name',
          { opacity: 1, y: 0, duration: 0.35 },
          '-=0.2'
        );
      }, markGridRef);
    };

    void run();

    return () => {
      cancelled = true;
      matterExit?.scrollTrigger?.kill();
      matterExit?.kill();
      mythExit?.scrollTrigger?.kill();
      mythExit?.kill();
      scoutTl?.kill();
      scoutTrigger?.kill();
      videoRef.current?.pause();
      ctx?.revert();
    };
  }, [heroLines.length]);

  return (
    <div className="w-full bg-black text-white relative select-none min-h-screen">
      {/* Beat 1 — Statement */}
      <section
        ref={heroSectionRef}
        className="relative w-full min-h-[calc(100dvh+72px)] flex flex-col items-center justify-center text-center px-6 -mt-[72px]"
      >
        <h1 className="font-futura font-extrabold uppercase tracking-tighter text-[#f5f5f7] w-full max-w-5xl text-[clamp(2.75rem,12.5vw,8.75rem)] leading-[0.88] -translate-y-[min(5vh,2.75rem)]">
          {heroLines.map((line, i) => (
            <span
              key={line}
              className={`reveal-line block${
                i === 0
                  ? ' reveal-line-matter'
                  : i === 1
                    ? ' reveal-line-myth'
                    : ''
              }`}
            >
              {line}
            </span>
          ))}
        </h1>
      </section>

      {/* Beat 2 — Scout stage + overlay line, then body */}
      <section
        ref={scoutSectionRef}
        className="relative w-full flex flex-col items-center px-6 pb-14 md:pb-20"
      >
        <div className="relative flex w-full min-h-[min(78dvh,720px)] flex-col items-center justify-center pt-6 md:pt-10">
          <div className="relative w-full max-w-[min(620px,88vw)] aspect-[440/359]">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="none"
              className="h-full w-full object-contain"
              aria-label="Fjorr scout"
            />
            {/* Soft veil so small type reads over the lantern */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[8%] bottom-[18%] top-[42%] rounded-full opacity-80"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 48%, transparent 72%)',
              }}
            />
            <h2 className="scout-headline pointer-events-none absolute inset-x-6 top-[52%] z-[1] -translate-y-1/2 text-center font-interTight text-[clamp(1.05rem,2.6vw,1.35rem)] font-semibold leading-snug tracking-tight text-[#f5f5f7] text-balance sm:inset-x-10">
              {manifestoHeadline}
            </h2>
          </div>
        </div>

        <div className="mx-auto mt-2 w-full max-w-[28rem] space-y-4 text-left font-sans text-[clamp(1.05rem,2.1vw,1.2rem)] font-medium leading-[1.5] tracking-normal text-[#f5f5f7]/88 md:mt-4 md:space-y-5">
          {manifestoParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="scout-body-p m-0">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="scout-explore mx-auto mt-7 w-full max-w-[28rem] md:mt-8">
          <Link
            href="/"
            className="font-sans text-[14px] font-semibold text-white/45 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/80"
          >
            {copy.exploreFjorr}
          </Link>
        </div>
      </section>

      {/* Beat 3 — Name & mark cards */}
      <section className="relative w-full px-6 sm:px-8 md:px-16 pt-10 md:pt-16 pb-20 md:pb-24">
        <div
          ref={markGridRef}
          className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-[20px] md:grid-cols-2"
        >
          {/* Mark / helmet */}
          <article
            ref={markCardRef}
            className="relative flex min-h-[360px] flex-col overflow-hidden rounded-[8px] border border-white/15 bg-[#0c0c0c] text-white md:min-h-[400px] lg:min-h-[440px]"
            style={{
              backgroundImage: 'url(/about/dot-grid.png)',
              backgroundSize: '18px 18px',
              backgroundRepeat: 'repeat',
            }}
          >
            <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-8 md:px-10">
              <p className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                {copy.logoLabel}
              </p>
              <div className="flex flex-1 items-center justify-center py-14 md:py-16 text-white">
                <FjorrIcon className="h-[88px] w-[88px] sm:h-[104px] sm:w-[104px]" />
              </div>
              <div className="mark-copy mark-copy-logo mt-auto w-full max-w-[22rem] text-left font-sans">
                <p className="mb-1.5 text-[14px] font-bold leading-snug text-white sm:text-[15px]">
                  {copy.logoTitle}
                </p>
                <p className="text-[13px] font-medium leading-snug tracking-tight text-[#f5f5f7]/65 sm:text-[14px]">
                  {copy.logoBody}
                </p>
              </div>
            </div>
          </article>

          {/* Name / wordmark */}
          <article
            ref={nameCardRef}
            className="relative flex min-h-[360px] flex-col overflow-hidden rounded-[8px] border border-white/15 bg-[#0c0c0c] text-white md:min-h-[400px] lg:min-h-[440px]"
            style={{
              backgroundImage: 'url(/about/dot-grid.png)',
              backgroundSize: '18px 18px',
              backgroundRepeat: 'repeat',
            }}
          >
            <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-8 md:px-10">
              <p className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                {copy.nameLabel}
              </p>
              <div className="flex flex-1 items-center justify-center py-14 md:py-16 text-white">
                <FjorrWordmark className="fjorr-about-wordmark h-[64px] w-[105px] sm:h-[80px] sm:w-[131px]" />
              </div>
              <div className="mark-copy mark-copy-name mt-auto w-full max-w-[22rem] text-left font-sans">
                <p className="mb-1.5 text-[14px] font-bold leading-snug text-white sm:text-[15px]">
                  {copy.nameTitle}
                </p>
                <p className="text-[13px] font-medium leading-snug tracking-tight text-[#f5f5f7]/65 sm:text-[14px]">
                  {copy.nameBody}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
