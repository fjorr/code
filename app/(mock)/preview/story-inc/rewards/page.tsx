import type { Metadata } from 'next';
import Link from 'next/link';
import HallOfWinsRail from '../HallOfWinsRail';

export const metadata: Metadata = {
  title: 'Rewards — Hall of Wins placement',
  description:
    'Client comp: rebuild of app.storyincmedia.com/rewards with Hall of Wins replacing the gold-coin hero.',
};

const NAV = [
  { label: 'Markets', href: null as string | null },
  { label: 'Rewards', href: '/preview/story-inc/rewards', active: true },
  { label: 'About', href: null },
  { label: 'Filmmakers', href: null },
  { label: 'Resources', href: null },
] as const;

/** Demo balance — locked rewards show remaining SC to go. */
const STORY_CASH_BALANCE = 0;

/** Catalog samples — enough to feel like the live redeem grid. */
const REWARDS = [
  {
    title: 'Movie Theater Concessions',
    body: 'Large popcorn and two large sodas—enjoyed the way they’re meant to be: at the movies.',
    sc: 900,
    image: '/preview/story-inc/market-1.jpg',
  },
  {
    title: '2 Tickets to the Big Screen',
    body: 'A night out with friends. Fandango gift card valid at theaters nationwide including Regal, AMC, Cinemark, Marcus Theaters.',
    sc: 1500,
    image: '/preview/story-inc/rolling-loud/reward-poster.png',
  },
  {
    title: 'Netflix for 3 Months',
    body: 'From prestige dramas to guilty-pleasure binges—queue up your next obsession.',
    sc: 1800,
    image: '/preview/story-inc/angry-birds/reward-bts.png',
  },
  {
    title: 'Uber Eats Watch Party For 2',
    body: 'Dinner for two to watch your favorite flick at home.',
    sc: 2200,
    image: '/preview/story-inc/market-2.jpg',
  },
  {
    title: 'Apple TV for a Year',
    body: 'One year of award-winning originals that stay with you after the credits.',
    sc: 4500,
    image: '/preview/story-inc/rolling-loud/reward-merch.png',
  },
  {
    title: '2 Tickets to Universal Studios',
    body: 'Big-screen worlds, iconic rides, and behind-the-scenes magic in Los Angeles.',
    sc: 9000,
    image: '/preview/story-inc/rolling-loud/reward-festival-vip.png',
  },
] as const;

function formatSc(amount: number, decimals = 0): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const COMING_SOON = [
  {
    title: 'Visit the Set',
    body: 'Get up close — a behind-the-scenes visit to the set.',
    image: '/preview/story-inc/hello-darkness/set-visit.jpg',
  },
  {
    title: 'Join the Movie Premiere',
    body: 'Join the cast and crew for opening night.',
    image: '/preview/story-inc/hello-darkness/screening.jpg',
  },
  {
    title: 'Signed Movie Posters & Scripts',
    body: 'A true keepsake for the project you’ve helped support.',
    image: '/preview/story-inc/rolling-loud/reward-poster.png',
  },
] as const;

/**
 * Client placement comp — rebuild of live /rewards with Hall of Wins in the
 * hero slot (replacing the oversized Story Cash coin).
 * Live reference: https://app.storyincmedia.com/rewards
 */
export default function StoryIncRewardsPage() {
  return (
    <div
      className="min-h-screen bg-white text-[#1d1d1f]"
      style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
    >
      <header className="border-b border-black/[0.06]">
        <div className="mx-auto flex h-[56px] max-w-[1120px] items-center justify-between gap-4 px-5">
          <Link href="/preview/story-inc/projects" className="shrink-0">
            <img
              src="/preview/story-inc/logo.png"
              alt="Story Inc"
              className="h-7 w-auto sm:h-8"
            />
          </Link>
          <nav className="hidden items-center gap-5 text-[13px] font-medium text-[#1d1d1f]/75 md:flex">
            {NAV.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    'active' in item && item.active
                      ? 'border-b-2 border-[#1d1d1f] pb-0.5 text-[#1d1d1f]'
                      : 'transition-opacity hover:opacity-80'
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="cursor-default">
                  {item.label}
                </span>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2 text-[12px] sm:gap-3">
            <span className="hidden rounded-full border border-[#00A6FF]/25 px-3 py-1.5 font-semibold text-[#00A6FF] sm:inline">
              Log in
            </span>
            <span className="rounded-full bg-[#00A6FF] px-3 py-1.5 font-semibold text-white">
              Join
            </span>
          </div>
        </div>
      </header>

      <main>
        {/* Client header comp — struck Rewards · mast · Hall of Wins · action bar */}
        <section className="mx-auto max-w-[720px] px-5 pb-8 pt-14 text-center sm:pb-10 sm:pt-16">
          <h1 className="text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[44px] md:text-[52px]">
            Redeem Rewards
          </h1>
          <p className="mx-auto mt-4 max-w-[34rem] text-[15px] leading-relaxed text-[#6e6e73] sm:mt-5 sm:text-[17px]">
            This is where Story Cash becomes something real.
          </p>
        </section>

        <section className="pb-0">
          <HallOfWinsRail hideControls ctaHref={null} ctaLabel={null} />
        </section>

        <section className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-5 pb-6 pt-5 sm:gap-4 sm:pb-7 sm:pt-6">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-[#f5f5f7] px-3.5 py-2.5">
              <CoinMark size={32} />
              <div>
                <p className="m-0 text-[11px] font-medium text-[#86868b]">
                  Story Cash balance
                </p>
                <p className="m-0 text-[20px] font-bold tabular-nums tracking-tight leading-none">
                  {formatSc(STORY_CASH_BALANCE, 2)} SC
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-[#00A6FF] px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              How to Earn Story Cash
            </button>
          </div>
          <p className="m-0 text-[13px] font-medium text-[#1d1d1f]/70">
            Story Cash Range:{' '}
            <button
              type="button"
              className="font-semibold text-[#00A6FF] underline-offset-2 hover:underline"
            >
              All
            </button>
          </p>
        </section>

        {/* Redeem grid */}
        <section className="mx-auto max-w-[1120px] px-5 pb-16">
          <ul className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-16">
            {REWARDS.map((r) => {
              const toGo = Math.max(0, r.sc - STORY_CASH_BALANCE);
              return (
                <li key={r.title} className="flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden rounded-[14px] bg-[#e8e8ed]">
                    <img
                      src={r.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col pt-4">
                    <h2 className="m-0 text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1d1d1f]">
                      {r.title}
                    </h2>
                    <p className="m-0 mt-2 line-clamp-2 text-[13px] leading-[1.45] text-[#6e6e73]">
                      {r.body}
                    </p>
                    <button
                      type="button"
                      className="mt-2 self-start text-[13px] font-semibold text-[#00A6FF] transition-opacity hover:opacity-75"
                    >
                      More info{' '}
                      <span aria-hidden className="font-medium">
                        ›
                      </span>
                    </button>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="m-0 text-[20px] font-bold tabular-nums tracking-[-0.02em] text-[#1d1d1f]">
                          {formatSc(r.sc)}{' '}
                          <span className="text-[13px] font-semibold tracking-normal text-[#86868b]">
                            SC
                          </span>
                        </p>
                        <p className="m-0 mt-0.5 text-[12px] tabular-nums text-[#aeaeb2]">
                          {formatSc(toGo, 2)} SC to go
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#86868b]">
                        <LockIcon />
                        Locked
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Coming soon — same image-over-text treatment as redeem grid */}
        <section className="border-t border-black/[0.06] py-14 sm:py-16">
          <div className="mx-auto max-w-[1120px] px-5">
            <h2 className="m-0 text-center text-[28px] font-bold tracking-[-0.02em] sm:text-[32px]">
              Coming Soon
            </h2>
            <p className="mx-auto mt-2 max-w-md text-center text-[14px] text-[#6e6e73]">
              These rewards are being finalized. Stay tuned!
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-3 lg:gap-x-7 lg:gap-y-16">
              {COMING_SOON.map((r) => (
                <li key={r.title} className="flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden rounded-[14px] bg-[#e8e8ed]">
                    <img
                      src={r.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col pt-4">
                    <h3 className="m-0 text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1d1d1f]">
                      {r.title}
                    </h3>
                    <p className="m-0 mt-2 line-clamp-2 text-[13px] leading-[1.45] text-[#6e6e73]">
                      {r.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/[0.06] py-8">
        <p className="mx-auto max-w-[1120px] px-5 text-center text-[11px] leading-relaxed text-[#aeaeb2]">
          Concept comp for partner discussion. Layout mirrors{' '}
          <a
            href="https://app.storyincmedia.com/rewards"
            className="underline underline-offset-2 hover:text-[#6e6e73]"
          >
            app.storyincmedia.com/rewards
          </a>
          . Wins and prices shown are illustrative placeholders.
        </p>
      </footer>
    </div>
  );
}

/** Story Cash mark — size in px; keep ~32 next to balance, ~18 on CTAs. */
function CoinMark({ size = 20 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#e4b84a] font-black text-[#7a5410]"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(9, Math.round(size * 0.38)),
      }}
    >
      S
    </span>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3 w-3"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 1.5a2.75 2.75 0 0 0-2.75 2.75V6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-.75V4.25A2.75 2.75 0 0 0 8 1.5Zm1.25 4.5h-2.5V4.25a1.25 1.25 0 1 1 2.5 0V6Z" />
    </svg>
  );
}
