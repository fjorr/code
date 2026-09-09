'use client';

import Image from 'next/image';
import React from 'react';
import mediaImageLoader from '@/lib/image-loader';

type HeroPictureProps = {
  wide?: string | null;
  clsx?: string | null;
  tall?: string | null;
  alt: string;
  /** LCP hero — sets priority + high fetchPriority */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /**
   * `width` switches at 768 / 1024 (film pages).
   * `aspect` switches by the viewport shape so a resized window picks
   * 16:9, the middle crop, or the vertical poster.
   */
  artDirection?: 'width' | 'aspect';
  onError?: React.ReactEventHandler<HTMLImageElement>;
};

const WIDE_WIDTHS = [1280, 1600, 1920, 2560];
const CLSX_WIDTHS = [768, 1024, 1280, 1600];

function buildSrcSet(src: string, widths: number[]) {
  return widths
    .map((width) => `${mediaImageLoader({ src, width })} ${width}w`)
    .join(', ');
}

/**
 * Art-directed hero with next/image for priority/lazy semantics.
 * `<source>` srcSets go through the same Cloudflare-aware loader as Image.
 */
export default function HeroPicture({
  wide,
  clsx,
  tall,
  alt,
  priority = false,
  className = '',
  imgClassName = 'object-cover object-center',
  artDirection = 'width',
  onError,
}: HeroPictureProps) {
  const fallback = tall || clsx || wide;
  if (!fallback) return null;

  const wideSrcSet = wide ? buildSrcSet(wide, WIDE_WIDTHS) : null;
  const midSrc = artDirection === 'aspect' ? clsx || wide || tall : clsx || wide;
  const clsxSrcSet = midSrc ? buildSrcSet(midSrc, CLSX_WIDTHS) : null;
  const wideMedia =
    artDirection === 'aspect' ? '(min-aspect-ratio: 3/2)' : '(min-width: 1024px)';
  const midMedia =
    artDirection === 'aspect' ? '(min-aspect-ratio: 3/4)' : '(min-width: 768px)';

  return (
    <picture className={className}>
      {wideSrcSet ? (
        <source
          media={wideMedia}
          srcSet={wideSrcSet}
          sizes="100vw"
        />
      ) : null}
      {clsxSrcSet ? (
        <source
          media={midMedia}
          srcSet={clsxSrcSet}
          sizes="100vw"
        />
      ) : null}
      <Image
        src={fallback}
        alt={alt}
        fill
        sizes="(max-width: 1440px) 100vw, 1440px"
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={imgClassName}
        onError={onError}
      />
    </picture>
  );
}
