import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import FilmStage from '@/components/ambient/FilmStage';
import ServerSafeSkeleton from '@/components/ServerSafeSkeleton';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import { resolveSocialOgImage } from '@/lib/og';
import {
  getFilmMetadata,
  getFilmPageData,
  getFilmSlugs,
  getFilmTranscripts,
} from '@/lib/content/film';
import { getLocale } from 'next-intl/server';
import { parseLocale } from '@/i18n/config';

/** Must be a literal — Next.js cannot analyze imported revalidate values. */
export const revalidate = 60;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getFilmSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: urlSlug } = await params;
  const locale = parseLocale(await getLocale());
  const film = await getFilmMetadata(urlSlug, locale);
  if (!film) return { title: 'Film Not Found' };
  const titleText = film.name;
  const descriptionText = film.teaser || 'Watch this short film on Fjorr.';
  const canonical = absoluteUrl(`/film/${film.slug}`);
  const ogImageUrl = await resolveSocialOgImage(film.blok_ogrf);
  return {
    title: titleText,
    description: descriptionText,
    alternates: { canonical },
    openGraph: {
      title: `${titleText} | Fjorr`,
      description: descriptionText,
      url: canonical,
      siteName: 'Fjorr',
      type: 'video.movie',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Short film poster for ${film.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titleText} | Fjorr`,
      description: descriptionText,
      images: [ogImageUrl],
    },
  };
}

export default async function FilmDetailPage({ params }: PageProps) {
  const { slug: urlSlug } = await params;
  return (
    <div className="w-full min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] flex flex-col items-center relative z-0">
      <Suspense
        fallback={
          <div className="w-full flex justify-center bg-[var(--page-bg)] animate-pulse my-3 md:my-4 px-0">
            <div className="w-full max-w-[1440px] relative aspect-[1/1.618] md:aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-none min-[1440px]:rounded-xl">
              <ServerSafeSkeleton variant="feature" />
              <div className="absolute inset-x-0 bottom-0 px-8 md:px-12 pb-8 md:pb-10 flex flex-col items-center md:items-start gap-4 z-10">
                <div className="w-32 h-4 bg-white/5 rounded" />
                <div className="w-64 h-12 bg-white/10 rounded-lg" />
                <div className="w-full max-w-xs h-4 bg-white/5 rounded" />
                <div className="w-40 h-10 bg-white/20 rounded-full mt-2" />
              </div>
            </div>
          </div>
        }
      >
        <DeferredPageContent urlSlug={urlSlug} />
      </Suspense>
    </div>
  );
}

async function DeferredPageContent({ urlSlug }: { urlSlug: string }) {
  const locale = parseLocale(await getLocale());
  const pageData = await getFilmPageData(urlSlug, locale);
  if (!pageData) notFound();

  const { filmData, relatedArtifacts, subtitleTracks, creatorRows } = pageData;

  const [ogImageUrl, transcripts] = await Promise.all([
    resolveSocialOgImage(filmData.blok_ogrf),
    subtitleTracks.length > 0
      ? getFilmTranscripts(filmData.id)
      : Promise.resolve([]),
  ]);

  const isComingSoon = filmData.release_date
    ? new Date(filmData.release_date).getTime() > Date.now()
    : false;

  const credits = (creatorRows || [])
    .map((row: any) => ({
      name: row?.creator?.name ? String(row.creator.name) : '',
      role: row?.role ? String(row.role) : '',
    }))
    .filter((row: { name: string }) => row.name);

  const artifacts = (relatedArtifacts || [])
    .map((row: any) => row?.artifact)
    .filter(Boolean)
    .map((artifact: any) => ({
      slug: String(artifact.slug || ''),
      name: artifact.name || 'Artifact',
      image: artifact.blok_tall || artifact.hero_tall || null,
    }))
    .filter((artifact: { slug: string }) => artifact.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Movie',
            name: filmData.name,
            description: filmData.teaser,
            image: ogImageUrl,
            datePublished: filmData.release_date,
            productionCompany: { '@type': 'Organization', name: 'Fjorr' },
          }),
        }}
      />

      <FilmStage
        id={String(filmData.id)}
        name={filmData.name || 'Untitled'}
        slug={String(filmData.slug)}
        teaser={filmData.teaser || null}
        runtime={filmData.runtime ?? null}
        releaseDate={filmData.release_date || null}
        comingSoon={isComingSoon}
        muxPlaybackId={filmData.mux_playback_id || null}
        heroWide={filmData.hero_wide || null}
        heroClsx={filmData.hero_clsx || null}
        heroTall={filmData.hero_tall || null}
        sponsorId={filmData.sponsor_id || null}
        exhibition={{
          name: filmData.name || 'Untitled',
          teaser: filmData.teaser || null,
          description: filmData.description || null,
          note: filmData.note || null,
          directorNote: filmData.director_note || null,
          credits,
          artifacts,
          transcripts,
          tracks: subtitleTracks,
        }}
      />
    </>
  );
}
