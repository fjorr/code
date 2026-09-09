'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import AccountNavLink from '@/components/AccountNavLink';

const LINKS = [
  { href: '/', labelKey: 'films' as const },
  { href: '/bounties', labelKey: 'bounties' as const },
  { href: '/nominate', labelKey: 'nominate' as const },
  { href: '/cabinet', labelKey: 'cabinet' as const },
  { href: '/about', labelKey: 'about' as const },
  { href: '/principles', labelKey: 'principles' as const },
  { href: '/manual', labelKey: 'manual' as const },
];

export default function HouseMenu({ onClose }: { onClose: () => void }) {
  const t = useTranslations('Nav');
  const pathname = usePathname() || '/';

  return (
    <div
      role="dialog"
      aria-label={t('openMenu')}
      className="absolute inset-0 z-30 flex flex-col bg-white text-[#0B0B0C]"
    >
      <div className="flex h-14 items-center border-b border-black/[0.08] px-4">
        <p className="font-sans text-[15px] text-black/40">{t('openMenu')}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 md:px-10">
        <nav className="flex flex-col">
          {LINKS.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            if (active) {
              return (
                <span
                  key={item.href}
                  aria-current="page"
                  className="px-3 py-2 font-sans text-[15px] font-semibold text-black/35"
                >
                  {t(item.labelKey)}
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="px-3 py-2 font-sans text-[15px] font-semibold text-[#0B0B0C] hover:bg-black/[0.04]"
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-black/[0.08] px-3 pt-4">
          <AccountNavLink
            onNavigate={onClose}
            className="font-sans text-[15px] font-semibold text-[#0B0B0C] hover:opacity-70"
            mutedClassName="font-sans text-[13px] font-medium text-black/40"
          />
        </div>
      </div>
    </div>
  );
}
