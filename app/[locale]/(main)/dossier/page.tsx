import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import FjorrMark from '@/components/help/FjorrMark';
import { createClient } from '@/lib/supabase/server';
import {
  DOSSIER_ARTICLES,
  DOSSIER_ISSUED,
  DOSSIER_SERIES,
  type DossierArticle,
} from '@/lib/dossier/content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta');
  const title = t('dossierTitle');
  const description = t('dossierDescription');
  return {
    title,
    description,
    alternates: { canonical: '/dossier' },
    openGraph: {
      title: `${title} | Fjorr`,
      description,
      url: 'https://www.fjorr.com/dossier',
      type: 'website',
    },
    twitter: {
      title: `${title} | Fjorr`,
      description,
    },
  };
}

function DossierPoster({ article }: { article: DossierArticle }) {
  return (
    <div
      className="relative w-full aspect-[2/3] overflow-hidden rounded-[5px] border border-[color-mix(in_srgb,var(--page-fg)_12%,transparent)] bg-[var(--page-bg)]"
      aria-hidden
    >
      {/* Dense subtle crosshatch */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09] dark:opacity-[0.14]"
        style={{
          backgroundImage: [
            'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--page-fg) 2px, var(--page-fg) 3px)',
            'repeating-linear-gradient(90deg, transparent, transparent 2px, var(--page-fg) 2px, var(--page-fg) 3px)',
          ].join(', '),
        }}
      />

      <div className="relative z-[1] flex h-full flex-col p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="m-0 font-mono text-[11px] sm:text-[12px] tabular-nums tracking-[0.08em] text-page">
            {article.number}
          </p>
          <FjorrMark className="w-[28px] sm:w-[32px] h-auto shrink-0 text-page translate-y-px" />
        </div>

        <p className="m-0 mt-auto mb-auto py-3 font-interTight font-bold tracking-tight text-[clamp(1.15rem,2.6vw,1.45rem)] leading-[1.15] text-page text-balance">
          {article.title}
        </p>

        <p className="m-0 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-page tabular-nums">
          {DOSSIER_ISSUED}
        </p>
      </div>
    </div>
  );
}

export default async function DossierIndexPage() {
  const t = await getTranslations('Dossier');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="w-full min-h-screen bg-[var(--page-bg)] text-page pb-28">
      <div className="w-full max-w-4xl mx-auto px-[10%] pt-14 sm:pt-20 flex flex-col items-center text-center">
        <div className="w-full flex flex-col items-center">
          <p className="font-sans text-lg sm:text-xl font-semibold normal-case tracking-normal text-page select-none opacity-0 animate-slide-up style-delay-headline">
            {t('eyebrow')}
          </p>
          <h1 className="mt-2 sm:mt-2.5 mb-5 sm:mb-6 font-futura tracking-tighter text-page select-none text-[clamp(2.5rem,8vw,4.5rem)] !leading-[0.9] text-center max-w-[14ch] sm:max-w-[16ch] opacity-0 animate-slide-up style-delay-headline">
            {t('title')
              .split('\n')
              .filter(Boolean)
              .map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
          </h1>
          <p className="font-sans font-medium text-[16px] leading-[1.55] tracking-normal text-page max-w-lg opacity-0 animate-slide-up style-delay-body">
            {t('lead')}
          </p>
        </div>

        <div className="mt-8 w-full max-w-xl opacity-0 animate-slide-up style-delay-body">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-y border-[color-mix(in_srgb,var(--page-fg)_12%,transparent)] py-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-page-faint">
            <span>
              {t('seriesLabel')} {DOSSIER_SERIES}
            </span>
            <span aria-hidden className="text-page-faint/50">
              ·
            </span>
            <span>
              {t('issued')} {DOSSIER_ISSUED}
            </span>
            <span aria-hidden className="text-page-faint/50">
              ·
            </span>
            <span>
              {String(DOSSIER_ARTICLES.length).padStart(2, '0')} {t('entries')}
            </span>
            <span aria-hidden className="text-page-faint/50">
              ·
            </span>
            <span>{t('publicRecord')}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 mt-10 sm:mt-12 opacity-0 animate-slide-up style-delay-form">
        <div className="mb-5 sm:mb-6 flex items-baseline justify-between gap-3">
          <h2 className="m-0 font-sans text-[16px] font-semibold normal-case tracking-normal text-page text-left">
            {t('indexHeading')}
          </h2>
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-page-faint">
            {t('endOfFile')}
          </p>
        </div>

        <ul className="m-0 p-0 list-none flex flex-wrap justify-center gap-5">
          {DOSSIER_ARTICLES.map((article) => (
            <li
              key={article.slug}
              className="flex flex-col w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-3*1.25rem)/4)]"
            >
              <Link
                href={`/dossier/${article.slug}`}
                className="group block rounded-[5px] transition-opacity hover:opacity-85"
              >
                <DossierPoster article={article} />
              </Link>
              <div className="mt-3 flex flex-col gap-1 min-w-0">
                <p className="m-0 font-sans text-[13px] sm:text-[14px] leading-snug text-page-muted tracking-normal">
                  {article.dek}
                </p>
                <p className="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-page-faint tabular-nums">
                  {t('readTime', { minutes: article.readMinutes })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {!user ? (
        <div className="mt-14 sm:mt-16 flex justify-center px-5 opacity-0 animate-slide-up style-delay-form">
          <Link
            href="/bureaux"
            className="px-10 h-14 inline-flex items-center justify-center bg-[var(--page-fg)] text-[var(--page-bg)] font-sans font-bold text-[15px] tracking-tight rounded-full shadow-2xl hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            {t('joinCta')}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
