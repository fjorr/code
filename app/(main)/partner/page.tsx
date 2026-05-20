'use client';

import React from 'react';
import { ContactPill } from '@/components/ui/contact-pill';

export default function PartnerPage() {
  return (
    /* 🎯 UNIFIED CANVAS WORKSPACE: 20px top padding via pt-5, flush on the bottom */
    <div className="w-full h-auto bg-[#1F1F1F] text-[#F5F5F7] flex items-center justify-center font-sans select-none pt-5 pb-0">
      
      {/* 🎬 SEAMLESS SLIDE ANCHOR FIELD */}
      <div className="w-full max-w-[1240px] px-6 sm:px-10 md:px-16 relative flex flex-col items-center justify-center overflow-hidden">
        
        {/* --- THE CORRECT SPEC COMPLIANT PICTURE SYSTEM --- */}
        {/* Sources are evaluated from top to bottom. The <img> tag at the end renders the active state. */}
        <picture className="w-full h-auto select-none pointer-events-none z-0 block">
          
          {/* 1. Desktop & Tablet Asset: Loaded when viewport width is 768px or wider */}
          <source 
            media="(min-width: 768px)" 
            srcSet="https://media.fjorr.com/assets/fjorr-partner-crowd-desktop-v05.avif" 
          />
          
          {/* 2. Mobile Asset: Loaded on screens narrower than 767px */}
          <source 
            media="(max-width: 767px)" 
            srcSet="https://media.fjorr.com/assets/fjorr-partner-crowd-mobile-v05.avif" 
          />
          
          {/* 3. The Mandatory Final Fallback: This is what actually paints to the DOM canvas */}
          <img 
            src="https://media.fjorr.com/assets/fjorr-partner-crowd-mobile-v05.avif" 
            className="w-full h-auto object-contain block mx-auto"
            alt="Fjorr Partnerships Slide"
          />
          
        </picture>

        {/* --- THE TYPOGRAPHY CONTENT DECK OVERLAY --- */}
        <div className="absolute inset-x-0 top-0 bottom-[32%] md:bottom-[40%] flex flex-col items-center justify-center text-center gap-3 md:gap-4 z-20 px-12 sm:px-20 md:px-32 mt-6 sm:mt-16 md:mt-0">
          
          {/* SUBTITLE */}
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-zinc-400 font-bold">
            Partnerships
          </span>
          
          {/* HERO TYPE BRAND BLOCK */}
          <h1 className="text-[42px] sm:text-[48px] md:text-[76px] font-extrabold uppercase tracking-tighter text-white leading-[0.85] font-futura mb-0.5">
            Make &apos;Em Feel.
          </h1>
          
          {/* EDITORIAL DECK BLURB */}
          <p className="text-[13px] md:text-[16px] font-light font-inter text-zinc-200 max-w-xs md:max-w-md tracking-tight leading-relaxed mb-4 md:mb-6 drop-shadow-xl opacity-95">
            We work with brands, studios, and individuals who believe stories shape people. From original films to cultural partnerships, we collaborate to bring meaningful ideas to life. If you&apos;re interested in building something worth making, reach out.
          </p>

          {/* DYNAMIC CLIPBOARD INTERACTION PILL */}
          <ContactPill />
          
        </div>

      </div>

    </div>
  );
}