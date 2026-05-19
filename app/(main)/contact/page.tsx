'use client';

import React from 'react';
import { ContactPill } from '@/components/ui/contact-pill';

export default function ContactPage() {
  return (
    /* 🎯 DYNAMIC LAYOUT DECK: Carving out the 70px navbar heights to keep the viewport scroll-free and perfectly centered */
    <div className="w-full min-h-[calc(100vh-70px)] bg-dark-01 text-[#F5F5F7] flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans select-none">
      
      {/* COMPACT CENTER MARKETING HERO LAYER */}
      <div className="max-w-xl text-center flex flex-col items-center gap-4 z-10">
        
        {/* SUBTITLE TRACKING */}
        <span className="text-[14px] font-mono tracking-[0.25em] uppercase text-zinc-400 font-bold">
          Contact
        </span>
        
        {/* HERO TITLE BLOCK */}
        {/* Tailwind pulls directly from your config to apply "futura-pt-condensed" here */}
        <h1 className="text-[48px] md:text-[100px] font-extrabold uppercase tracking-tighter text-white leading-[0.9] font-futura">
          Thinking?
        </h1>
        
        {/* EDITORIAL DECK BLURB */}
        <p className="text-[15px] md:text-[16px] font-medium font-inter text-zinc-400 max-w-sm tracking-relaxed leading-relaxed mb-6">
          Ideas, partnerships, or something worth making. We&apos;re here for it.
        </p>

        {/* THE BOT-PROOF COPY TO CLIPBOARD PILL */}
        <ContactPill />
        
      </div>

    </div>
  );
}