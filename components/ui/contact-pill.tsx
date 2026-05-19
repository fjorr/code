'use client';

import React, { useState } from 'react';

interface ContactPillProps {
  email?: string;
  className?: string;
}

export const ContactPill: React.FC<ContactPillProps> = ({ 
  email = 'scout@fjorr.com', 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      
      // Hold feedback frame for 3.5 seconds before resetting state loop
      setTimeout(() => setCopied(false), 3500);
    } catch (err) {
      console.error('Hardware clipboard access transaction rejected:', err);
    }
  };

  return (
    <div className={`h-12 relative flex items-center justify-center min-w-[240px] select-none ${className}`}>
      {!copied ? (
        <button
          onClick={handleCopy}
          className="px-6 py-2.5 bg-white text-black font-semibold text-[14px] rounded-full hover:bg-[#F5F5F7] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl font-inter animate-in fade-in duration-300"
        >
          Let&apos;s talk
        </button>
      ) : (
        <div 
          className="px-5 py-2.5 bg-zinc-900 border border-white/10 rounded-full font-medium text-[13px] tracking-tight text-[#54ffb5] flex items-center gap-2 shadow-2xl font-inter animate-in zoom-in-95 fade-in duration-200"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Email copied. Fire away.</span>
        </div>
      )}
    </div>
  );
};