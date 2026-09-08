import { Link } from '@/i18n/navigation';

export default function QuietFrame({
  children,
  join = true,
}: {
  children: React.ReactNode;
  join?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-page flex flex-col">
      <header className="flex items-center justify-between px-6 sm:px-10 pt-8">
        <Link
          href="/preview/quiet"
          className="font-sans text-[15px] font-semibold tracking-normal text-page"
        >
          Fjorr
        </Link>
        {join ? (
          <Link
            href="/preview/quiet/join"
            className="font-sans text-[13px] font-medium text-page-muted hover:text-page transition-colors"
          >
            Join
          </Link>
        ) : (
          <span className="w-10" />
        )}
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
