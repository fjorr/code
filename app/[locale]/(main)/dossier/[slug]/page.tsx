import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import {
  DOSSIER_ARTICLES,
  getAdjacentArticles,
  getDossierArticle,
  getDossierBody,
  getDossierSlugs,
  type DossierBlock,
} from '@/lib/dossier/content';

type Props = {
  params: Promise<{ slug: string }>;
};

const FOOTNOTE_MARKS: Record<string, string> = {
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

/** Inline: `**bold**`, `*italic*`, footnote superscripts ¹–⁹ */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|[¹²³⁴⁵⁶⁷⁸⁹])/);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-page">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const id = Object.entries(FOOTNOTE_MARKS).find(([, mark]) => mark === part)?.[0];
    if (!id) return <span key={i}>{part}</span>;
    return (
      <a
        key={i}
        href={`#note-${id}`}
        id={`ref-${id}`}
        className="font-mono text-[0.7em] align-super text-page-muted hover:text-page transition-colors no-underline"
        aria-describedby={`note-${id}`}
      >
        {part}
      </a>
    );
  });
}

function renderBody(blocks: DossierBlock[], slug: string, hasLead: boolean) {
  let firstParagraph = true;
  return blocks.map((block, i) => {
    if (block.type === 'h2') {
      return (
        <h2
          key={`${slug}-h2-${i}`}
          className="m-0 mt-10 sm:mt-12 mb-4 sm:mb-5 font-interTight font-bold tracking-tight text-page text-[clamp(1.35rem,3.5vw,1.75rem)] leading-[1.2]"
        >
          {block.text}
        </h2>
      );
    }
    if (block.type === 'ul') {
      return (
        <ul
          key={`${slug}-ul-${i}`}
          className="m-0 mb-5 sm:mb-6 pl-0 list-none flex flex-col gap-4"
        >
          {block.items.map((item, j) => (
            <li
              key={`${slug}-li-${i}-${j}`}
              className="relative pl-5 font-sans text-[16px] sm:text-[17px] font-medium leading-[1.7] tracking-[-0.01em] text-page before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-page-faint"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === 'timeline') {
      return (
        <ol
          key={`${slug}-tl-${i}`}
          className="m-0 mb-6 sm:mb-8 pl-0 list-none relative"
        >
          {block.items.map((item, j) => {
            const isLast = j === block.items.length - 1;
            return (
              <li
                key={`${slug}-tl-${i}-${j}`}
                className={`relative pl-7 sm:pl-8 ${isLast ? '' : 'pb-7 sm:pb-8'}`}
              >
                {/* Rail */}
                {!isLast ? (
                  <span
                    aria-hidden
                    className="absolute left-[5px] sm:left-[6px] top-[1.1em] bottom-0 w-px bg-[color-mix(in_srgb,var(--page-fg)_16%,transparent)]"
                  />
                ) : null}
                {/* Node */}
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.55em] h-[11px] w-[11px] rounded-full border-[1.5px] border-[color-mix(in_srgb,var(--page-fg)_35%,transparent)] bg-[var(--page-bg)]"
                />
                <p className="m-0 mb-1.5 font-interTight font-bold tracking-tight text-page text-[17px] sm:text-[18px] leading-[1.25]">
                  {item.title}
                </p>
                <p className="m-0 font-sans text-[16px] sm:text-[17px] font-medium leading-[1.7] tracking-[-0.01em] text-page-muted">
                  {renderInline(item.text)}
                </p>
              </li>
            );
          })}
        </ol>
      );
    }
    if (block.type === 'figure') {
      return (
        <figure
          key={`${slug}-fig-${i}`}
          className="m-0 mx-auto my-10 sm:my-14 w-[75%]"
        >
          <div className="overflow-hidden rounded-2xl bg-[var(--page-elevated)] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.28),0_4px_14px_-4px_rgba(0,0,0,0.14)] dark:shadow-[0_14px_40px_-10px_rgba(0,0,0,0.6),0_4px_14px_-4px_rgba(0,0,0,0.4)]">
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              className="block h-auto w-full"
              sizes="(max-width: 640px) 75vw, 504px"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 sm:mt-3.5 px-1 font-sans text-[13px] sm:text-[14px] font-medium leading-[1.45] tracking-[-0.01em] text-page-muted text-center">
              {renderInline(block.caption)}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    const isFirst = firstParagraph && !hasLead;
    firstParagraph = false;
    return (
      <p
        key={`${slug}-p-${i}`}
        className={`m-0 font-sans font-medium tracking-[-0.01em] text-page ${
          isFirst
            ? 'mb-7 sm:mb-8 text-[17px] sm:text-[18px] leading-[1.7] dossier-drop'
            : 'mb-5 sm:mb-6 text-[16px] sm:text-[17px] leading-[1.7]'
        }`}
      >
        {renderInline(block.text)}
      </p>
    );
  });
}

export function generateStaticParams() {
  return getDossierSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getDossierArticle(slug);
  if (!article) return {};
  const t = await getTranslations('Meta');
  const description = article.dek;
  return {
    title: article.title,
    description,
    alternates: { canonical: `/dossier/${article.slug}` },
    openGraph: {
      title: `${article.title} | ${t('dossierTitle')} | Fjorr`,
      description,
      url: `https://www.fjorr.com/dossier/${article.slug}`,
      type: 'article',
    },
    twitter: {
      title: `${article.title} | Fjorr`,
      description,
    },
  };
}

export default async function DossierArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getDossierArticle(slug);
  if (!article) notFound();

  const t = await getTranslations('Dossier');
  const { prev, next } = getAdjacentArticles(slug);
  const index = DOSSIER_ARTICLES.findIndex((a) => a.slug === slug) + 1;
  const footnotes = article.footnotes ?? [];
  const body = getDossierBody(article);

  return (
    <div className="w-full min-h-screen bg-[var(--page-bg)] text-page pb-24 sm:pb-28">
      <article className="w-full max-w-[42rem] mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <header className="opacity-0 animate-slide-up style-delay-headline">
          <p className="m-0 mb-8 sm:mb-10 text-center">
            <Link
              href="/dossier"
              className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-page-faint hover:text-page-muted transition-colors"
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.75}
                className="shrink-0 translate-y-px"
                aria-hidden
              />
              {t('back')}
            </Link>
          </p>

          <h1 className="m-0 mb-4 sm:mb-5 font-futura font-extrabold uppercase tracking-tighter text-page select-none text-[clamp(2rem,6vw,3.25rem)] !leading-[0.92] text-balance text-center">
            {article.title}
          </h1>
          <p className="m-0 mx-auto font-sans text-[16px] sm:text-[17px] font-medium leading-[1.5] tracking-normal text-page-muted max-w-xl text-center">
            {article.dek}
          </p>

          <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-y border-[color-mix(in_srgb,var(--page-fg)_12%,transparent)] py-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-page-faint">
            <span>
              {t('document')} {article.number}/
              {String(DOSSIER_ARTICLES.length).padStart(2, '0')}
            </span>
            <span aria-hidden>·</span>
            <span>{article.ref}</span>
            <span aria-hidden>·</span>
            <span>{t('readTime', { minutes: article.readMinutes })}</span>
            <span aria-hidden>·</span>
            <span>{t('publicRecord')}</span>
          </div>
        </header>

        {/* One column — measure is the craft. Pulls + close beat do the elevating. */}
        <div className="mt-12 sm:mt-16 opacity-0 animate-slide-up style-delay-body">
          {article.lead ? (
            <p className="m-0 mb-8 font-sans text-[17px] sm:text-[18px] font-medium leading-[1.7] tracking-[-0.01em] text-page">
              {article.lead}
            </p>
          ) : null}

          <div className="flex flex-col">
            {renderBody(body, article.slug, Boolean(article.lead))}
          </div>

          {footnotes.length > 0 ? (
            <section
              className="mt-14 sm:mt-16 border-t border-[color-mix(in_srgb,var(--page-fg)_14%,transparent)] pt-7"
              aria-label={t('notes')}
            >
              <h2 className="m-0 mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-page-faint">
                {t('notes')}
              </h2>
              <ol className="m-0 p-0 list-none flex flex-col gap-4">
                {footnotes.map((note) => (
                  <li
                    key={note.id}
                    id={`note-${note.id}`}
                    className="scroll-mt-28 grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2"
                  >
                    <a
                      href={`#ref-${note.id}`}
                      className="font-mono text-[12px] tabular-nums text-page-faint hover:text-page transition-colors"
                      aria-label={t('returnToText')}
                    >
                      {FOOTNOTE_MARKS[note.id] ?? note.id}
                    </a>
                    <p className="m-0 font-sans text-[13px] leading-[1.55] text-page tracking-[-0.01em]">
                      {note.text}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <footer className="mt-12 sm:mt-14 border-t border-[color-mix(in_srgb,var(--page-fg)_14%,transparent)] pt-6">
            <p className="m-0 mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-page-faint">
              {t('endOfDocument')} · {index}/{DOSSIER_ARTICLES.length}
            </p>
            <nav
              className="flex flex-col gap-3 sm:flex-row sm:justify-between"
              aria-label={t('seriesNav')}
            >
              {prev ? (
                <Link
                  href={`/dossier/${prev.slug}`}
                  className="font-sans text-[14px] font-medium tracking-[-0.01em] text-page transition-opacity hover:opacity-70"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-page-faint mb-1">
                    {t('previous')}
                  </span>
                  {prev.number} · {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/dossier/${next.slug}`}
                  className="font-sans text-[14px] font-medium tracking-[-0.01em] text-page transition-opacity hover:opacity-70 sm:text-right"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-page-faint mb-1">
                    {t('next')}
                  </span>
                  {next.number} · {next.title}
                </Link>
              ) : (
                <Link
                  href="/dossier"
                  className="font-sans text-[14px] font-medium tracking-[-0.01em] text-page transition-opacity hover:opacity-70 sm:text-right"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-page-faint mb-1">
                    {t('index')}
                  </span>
                  {t('back')}
                </Link>
              )}
            </nav>
          </footer>
        </div>
      </article>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dossier-drop::first-letter {
              font-family: var(--font-display), sans-serif;
              font-weight: 800;
              float: left;
              font-size: 3.35em;
              line-height: 0.82;
              padding-right: 0.1em;
              margin-top: 0.06em;
              letter-spacing: -0.04em;
            }
          `,
        }}
      />
    </div>
  );
}
