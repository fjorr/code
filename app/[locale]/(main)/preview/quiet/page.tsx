import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import HeroPicture from '@/components/HeroPicture';
import QuietFrame from '@/components/quiet/QuietFrame';
import { getFeaturedFilms } from '@/lib/content/home';
import { defaultLocale, type AppLocale } from '@/i18n/config';

export const metadata: Metadata = {
  title: 'Fjorr',
  robots: { index: false, follow: false },
};

function minutes(runtime: number | null | undefined) {
  const mins = Math.max(1, Math.ceil((runtime || 0) / 60));
  return `${mins} min`;
}

export default async function QuietHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const films = await getFeaturedFilms((locale as AppLocale) || defaultLocale);
  const film = films[0];
  const rest = films.slice(1, 5);

  return (
    <QuietFrame>
      {film ? (
        <section className="px-6 sm:px-10 pt-10 pb-16 flex flex-col items-center">
          <Link
            href={`/film/${film.slug}`}
            className="group w-full max-w-[920px] block"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-page-chip">
              <HeroPicture
                wide={film.hero_wide}
                clsx={film.hero_clsx}
                tall={film.hero_tall}
                alt={film.name || 'Film'}
                priority
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="mt-8 flex flex-col items-center text-center">
              <h1 className="m-0 font-sans font-semibold tracking-tight text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] text-page">
                {film.name}
              </h1>
              <p className="mt-3 m-0 font-sans text-[13px] font-medium text-page-muted">
                {minutes(film.runtime)}
              </p>
              <span className="mt-8 font-sans text-[15px] font-semibold text-page group-hover:opacity-70 transition-opacity">
                Play
              </span>
            </div>
          </Link>
        </section>
      ) : (
        <section className="px-6 sm:px-10 pt-24 pb-16 text-center">
          <p className="m-0 font-sans text-[16px] text-page-muted">No films yet.</p>
        </section>
      )}

      {rest.length > 0 ? (
        <section className="px-6 sm:px-10 pb-20">
          <ul className="m-0 mx-auto max-w-md p-0 list-none flex flex-col">
            {rest.map((item) => (
              <li key={item.id || item.slug} className="border-t border-page-faint">
                <Link
                  href={`/film/${item.slug}`}
                  className="flex items-baseline justify-between gap-6 py-4 font-sans text-[15px] text-page hover:opacity-70 transition-opacity"
                >
                  <span>{item.name}</span>
                  <span className="text-[13px] text-page-muted shrink-0">
                    {minutes(item.runtime)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </QuietFrame>
  );
}
