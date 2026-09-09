'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { localeLabels, locales, stripLocalePrefix, type AppLocale } from '@/i18n/config';

export default function LanguagePanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations('Nav');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname() || '/';

  return (
    <div
      role="dialog"
      aria-label={t('languages')}
      className="absolute inset-0 z-30 flex flex-col bg-white text-[#0B0B0C]"
    >
      <div className="flex h-14 items-center border-b border-black/[0.08] px-4">
        <p className="font-sans text-[15px] text-black/40">{t('languagesHeadline')}</p>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-6 py-4 md:px-10" aria-label={t('languages')}>
        {locales.map((code) => {
          const current = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => {
                onClose();
                if (current) return;
                const raw = typeof window !== 'undefined' ? window.location.pathname : pathname;
                const href = stripLocalePrefix(raw || '/') || '/';
                router.replace(href, { locale: code });
              }}
              className={`block w-full rounded-[8px] px-3 py-2 text-left font-sans text-[15px] font-semibold ${
                current ? 'cursor-default text-black/35' : 'text-[#0B0B0C] hover:bg-black/[0.04]'
              }`}
            >
              {localeLabels[code]}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
