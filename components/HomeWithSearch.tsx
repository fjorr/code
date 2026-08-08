'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { MinimalFilterProvider, useMinimalFilter } from '@/components/MinimalFilterContext';
import type { HomeMix } from '@/lib/home-mix';
import { preloadCinemaTheater } from '@/lib/cinema-theater';

/** Search chrome + RPC — loaded only when the user opens search. */
const SearchExperience = dynamic(() => import('@/components/SearchExperience'), {
  ssr: false,
  loading: () => <SearchChromeSkeleton />,
});

function SearchChromeSkeleton() {
  return (
    <section
      className="relative z-30 w-full pt-4 pb-4 px-[10%] flex flex-col items-center"
      aria-hidden
    >
      <div className="w-full max-w-4xl flex flex-col items-center gap-4">
        <div className="relative w-full max-w-sm flex flex-col items-stretch">
          <div className="w-full h-12 rounded-[10px] bg-page-chip" />
        </div>
        <div className="w-full max-w-sm flex justify-center">
          <div className="h-9 w-full max-w-[280px] rounded-[8px] bg-page-chip" />
        </div>
      </div>
    </section>
  );
}

function urlWantsSearch(params: URLSearchParams) {
  return Boolean(params.get('q')?.trim()) || params.get('search') === '1';
}

/**
 * Home shell: idle = FeatureRail / browse only.
 * Navbar search (or ?q= / ?search=1) opens the code-split search experience.
 */
function HomeWithSearchInner({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setSearchChromeOpen } = useMinimalFilter();
  const [theaterOpen, setTheaterOpen] = useState(false);
  const [chromeOpen, setChromeOpen] = useState(() =>
    urlWantsSearch(new URLSearchParams(searchParams.toString())),
  );

  // Keep chrome in sync with the URL — logo → `/` closes search; `?q=` / `?search=1` opens it.
  useEffect(() => {
    const wants = urlWantsSearch(
      new URLSearchParams(searchParams.toString()),
    );
    setChromeOpen(wants);
    setSearchChromeOpen(wants);
  }, [searchParams, setSearchChromeOpen]);

  useEffect(() => {
    setSearchChromeOpen(chromeOpen);
    return () => setSearchChromeOpen(false);
  }, [chromeOpen, setSearchChromeOpen]);

  useEffect(() => {
    const hide = () => setTheaterOpen(true);
    const show = () => setTheaterOpen(false);
    window.addEventListener('fjorr_hide_main_navbar', hide);
    window.addEventListener('fjorr_show_main_navbar', show);
    return () => {
      window.removeEventListener('fjorr_hide_main_navbar', hide);
      window.removeEventListener('fjorr_show_main_navbar', show);
    };
  }, []);

  // Warm theater after load + idle — don't race hero LCP.
  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const warm = () => {
      if (cancelled) return;
      const conn = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      if (conn?.saveData) return;
      if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') {
        return;
      }
      void preloadCinemaTheater();
    };

    const schedule = () => {
      const ric = (
        window as Window & {
          requestIdleCallback?: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number;
          cancelIdleCallback?: (id: number) => void;
        }
      ).requestIdleCallback;

      if (typeof ric === 'function') {
        idleId = ric(warm, { timeout: 10000 });
      } else {
        timeoutId = window.setTimeout(warm, 5000);
      }
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      if (idleId != null) {
        (
          window as Window & { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(idleId);
      }
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, []);

  const writeParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const openChrome = useCallback(() => {
    setChromeOpen(true);
    setSearchChromeOpen(true);
    writeParams((params) => {
      if (!params.get('q')?.trim()) params.set('search', '1');
    });
  }, [writeParams, setSearchChromeOpen]);

  const closeChrome = useCallback(() => {
    setChromeOpen(false);
    setSearchChromeOpen(false);
    writeParams((params) => {
      params.delete('q');
      params.delete('search');
    });
  }, [writeParams, setSearchChromeOpen]);

  useEffect(() => {
    const onOpen = () => openChrome();
    const onClose = () => closeChrome();
    const onToggle = () => {
      if (chromeOpen) closeChrome();
      else openChrome();
    };
    window.addEventListener('fjorr_open_home_search', onOpen);
    window.addEventListener('fjorr_close_home_search', onClose);
    window.addEventListener('fjorr_toggle_home_search', onToggle);
    return () => {
      window.removeEventListener('fjorr_open_home_search', onOpen);
      window.removeEventListener('fjorr_close_home_search', onClose);
      window.removeEventListener('fjorr_toggle_home_search', onToggle);
    };
  }, [chromeOpen, openChrome, closeChrome]);

  return (
    <div className="w-full min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] pb-24">
      <h1 className="sr-only">
        Fjorr — Short films of the world&apos;s greatest stories
      </h1>
      {chromeOpen ? (
        <SearchExperience
          browseContent={children}
          theaterOpen={theaterOpen}
          autoFocus
          onCloseChrome={closeChrome}
        />
      ) : (
        <div
          className={`relative z-0 w-full ${
            theaterOpen ? 'pointer-events-none' : ''
          }`}
          aria-hidden={theaterOpen}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function HomeWithSearch({
  children,
  mixes = [],
}: {
  children: ReactNode;
  mixes?: HomeMix[];
}) {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[var(--page-bg)]" />}>
      <MinimalFilterProvider initialMixes={mixes}>
        <HomeWithSearchInner>{children}</HomeWithSearchInner>
      </MinimalFilterProvider>
    </Suspense>
  );
}
