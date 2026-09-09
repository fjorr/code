'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';
import { FjorrIcon } from '@/components/brand/FjorrMarks';

export default function CornerColophon() {
  const t = useTranslations('Footer');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <p className="font-sans text-[10px] tracking-wide text-black/40">{t('copyright')}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Footer"
          className="text-black/45 hover:text-black"
        >
          <FjorrIcon className="h-3 w-3" />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-[100000] overflow-y-auto bg-white">
          <div className="flex justify-end px-6 pt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-sans text-[13px] font-semibold text-black/60 hover:text-black"
            >
              Close
            </button>
          </div>
          <Footer variant="dark" />
        </div>
      ) : null}
    </>
  );
}
