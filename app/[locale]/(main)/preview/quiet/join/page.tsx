import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import QuietFrame from '@/components/quiet/QuietFrame';
import { getBureauxAnnualAmountCents } from '@/lib/bureaux';

export const metadata: Metadata = {
  title: 'Join',
  robots: { index: false, follow: false },
};

function priceLabel(cents: number, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `$${Math.round(cents / 100)}`;
  }
}

export default async function QuietJoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const price = priceLabel(getBureauxAnnualAmountCents(), locale);

  return (
    <QuietFrame join={false}>
      <section className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-20 text-center">
        <h1 className="m-0 font-sans font-semibold tracking-tight text-[clamp(2rem,5vw,3rem)] leading-[1.05] text-page">
          Join
        </h1>
        <p className="mt-6 m-0 max-w-sm font-sans text-[16px] leading-[1.5] text-page-muted">
          This pays for the films. {price} a year.
        </p>
        <Link
          href="/bureaux"
          className="mt-10 inline-flex h-12 items-center px-8 rounded-full bg-[var(--page-fg)] text-[var(--page-bg)] font-sans text-[14px] font-semibold"
        >
          Continue
        </Link>
        <p className="mt-8 m-0 font-sans text-[13px] text-page-faint">
          Watching does not require this.
        </p>
      </section>
    </QuietFrame>
  );
}
