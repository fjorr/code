'use client';

import React, { useState, useEffect } from 'react';
import { ContactPill } from '@/components/ui/contact-pill';

export default function ContactPage() {
  const targetText = "Thinking?";
  const [displayedText, setDisplayedText] = useState("");
  const [startCursorBlink, setStartCursorBlink] = useState(true);
  
  // Controls the grand entrance of the subhead and pill button
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let currentIdx = 0;
    let timeoutId: NodeJS.Timeout;

    function typeNextCharacter() {
      if (currentIdx <= targetText.length) {
        setDisplayedText(targetText.slice(0, currentIdx));
        currentIdx++;

        // Natural human cadence random speed generator (45ms to 180ms)
        const randomDelay = Math.random() * (180 - 45) + 45;
        const finalDelay = currentIdx === targetText.length ? 300 : randomDelay; 

        timeoutId = setTimeout(typeNextCharacter, finalDelay);
      } else {
        // 🏁 THE TYPING FINISH LINE:
        // Trigger the subhead and button animations instantly when the word completes
        setShowDetails(true);

        // Melt the cursor line away shortly after
        timeoutId = setTimeout(() => {
          setStartCursorBlink(false);
        }, 400);
      }
    }

    // 🎯 FAST TRACK: Fire the typing function immediately on mount!
    typeNextCharacter();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    /* 🎯 DYNAMIC LAYOUT DECK: Carving out the 100px navbar heights to keep the viewport scroll-free and perfectly centered */
    <div className="w-full min-h-[calc(100vh-100px)] bg-dark-01 text-[#F5F5F7] flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans select-none">
      
      {/* COMPACT CENTER MARKETING HERO LAYER */}
      <div className="max-w-xl text-center flex flex-col items-center gap-4 z-10">
        
        {/* HERO TITLE BLOCK */}
        <h1 className="text-[60px] md:text-[100px] font-extrabold uppercase tracking-tighter text-white leading-[0.9] font-futura relative max-w-fit mx-auto select-none mb-4">
          
          {/* THE JUMP-PROOF INVISIBLE FOOTPRINT */}
          <span className="opacity-0 pointer-events-none select-none" aria-hidden="true">
            {targetText}
          </span>

          {/* THE VISIBLE TYPING TRACK */}
          <span className="absolute inset-y-0 left-0 flex items-center justify-start whitespace-nowrap">
            {displayedText}
            
            {/* THE TERMINAL NEEDLE */}
            {startCursorBlink && (
              <span className="inline-block h-[42px] md:h-[72px] w-[4px] md:w-[6px] bg-white ml-2 animate-pulse [animation-duration:0.6s]" />
            )}
          </span>
        </h1>
        
        {/* 🎬 STAGGER SELECTION 1: THE EDITORIAL DECK BLURB */}
        <p 
          className={`text-[15px] md:text-[16px] font-medium font-inter text-zinc-400 max-w-xs tracking-relaxed leading-relaxed mb-6 transform-gpu transition-all ease-out duration-700 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Ideas, partnerships, or something worth making. We&apos;re here for it.
        </p>

        {/* 🎬 STAGGER SELECTION 2: THE BOT-PROOF COPY TO CLIPBOARD PILL */}
        <div
          className={`transform-gpu transition-all ease-out duration-700 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: showDetails ? '200ms' : '0ms' }}
        >
          <ContactPill />
        </div>
        
      </div>

    </div>
  );
}