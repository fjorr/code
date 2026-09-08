import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import QuietFrame from '@/components/quiet/QuietFrame';

export const metadata: Metadata = {
  title: 'Desk',
  robots: { index: false, follow: false },
};

export default function QuietDeskPage() {
  return (
    <QuietFrame>
      <section className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-20">
        <div className="w-full max-w-md flex flex-col gap-14">
          <div>
            <h1 className="m-0 font-sans font-semibold tracking-tight text-[1.75rem] leading-[1.15] text-page">
              A note
            </h1>
            <p className="mt-3 m-0 font-sans text-[16px] leading-[1.5] text-page-muted">
              Tell the desk a moment is not landing. You do not edit the film. Most notes get no reply.
            </p>
          </div>
          <div>
            <h2 className="m-0 font-sans font-semibold tracking-tight text-[1.75rem] leading-[1.15] text-page">
              A nomination
            </h2>
            <p className="mt-3 m-0 font-sans text-[16px] leading-[1.5] text-page-muted">
              A story to make. The desk decides.
            </p>
            <Link
              href="/nominate"
              className="mt-6 inline-flex font-sans text-[14px] font-semibold text-page underline underline-offset-4"
            >
              Nominate
            </Link>
          </div>
        </div>
      </section>
    </QuietFrame>
  );
}
