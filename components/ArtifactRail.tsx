'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

interface ArtifactRailProps {
  title: string;
  artifacts: any[];
}

export default function ArtifactRail({ title, artifacts: rawArtifacts }: ArtifactRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isMobile, setIsMobile] = useState(false);

  // Filter out any broken elements missing an active slug property
  const filteredArtifacts = (rawArtifacts || []).filter((item) => {
    const artifact = item?.artifact ? item.artifact : item;
    return artifact && artifact.slug;
  });

  // Generates 18 slots by cycling the validated layout array payload
  const activeArtifacts = filteredArtifacts.length > 0 
    ? Array.from({ length: 18 }, (_, i) => filteredArtifacts[i % filteredArtifacts.length]) 
    : [];

  // Handle items per page and mobile viewport detection state updates
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Explicit state toggle flag for conditional DOM demolition
      setIsMobile(width < 768);

      if (width >= 1024) setItemsPerPage(6);
      else if (width >= 768) setItemsPerPage(4);
      else setItemsPerPage(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculates true total pages based on how many items are actually visible on screen
  const totalPages = Math.ceil(activeArtifacts.length / itemsPerPage);

  // 🎯 FIXED SCROLL PROGRESS ENGINE: Dynamically maps tracking based on current fluid gap size
  const handleScroll = () => {
    if (railRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
      
      if (scrollWidth > clientWidth) {
        {/* 🎯 ADJUSTMENT 1: Updated tracking gap calculations to balance your new layout values */}
        const currentGap = window.innerWidth >= 1024 ? 24 : window.innerWidth >= 768 ? 20 : 16;
        const itemWidth = (scrollWidth + currentGap) / activeArtifacts.length;
        
        // Maps the scroll placement parameter index directly onto our visible groupings
        const calculatedPage = Math.round(scrollLeft / (itemWidth * itemsPerPage));
        
        // Safety lock preventing trailing indexes from overflowing array page length boundaries
        const safePage = Math.max(0, Math.min(calculatedPage, totalPages - 1));
        setCurrentPage(safePage);
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const { scrollLeft, clientWidth } = railRef.current;
      const scrollAmount = clientWidth; 
      
      const targetScroll = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;

      railRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  if (!activeArtifacts || activeArtifacts.length === 0) return null;

  const formatIndex = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="w-full pb-12 relative group/rail select-none z-20 px-8 md:px-16">
      
      {/* Scrollbar hidden styling core structure element */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { 
          display: none !important; 
        }
      `}} />

      <div className="w-full max-w-[1440px] mx-auto relative">
        
        {/* HEADER TRACK COMPONENT ROW */}
        <div className="w-full flex items-center justify-between mb-4">
          <h3 className="font-sans font-bold text-[18px] text-white/90 tracking-tight capitalize whitespace-nowrap">
            {title}
          </h3>
          
          <div className="flex items-center gap-3">
            {/* The counter numbers: Static layout always present on all devices */}
            <span className="font-mono text-[14px] font-bold tracking-wider text-white/30 select-none bg-transparent py-1 px-1">
              <span className="text-white/80">{formatIndex(currentPage + 1)}</span>
              <span className="mx-1 text-white/20">/</span>
              {formatIndex(totalPages)}
            </span>

            {/* 🎯 CONDITIONAL HARD DEMOLITION TERNARY: 
                If device viewport is determined mobile (< 768px), this node layer is deleted completely */}
            {!isMobile && (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => scroll('left')} 
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all duration-200 text-[16px] font-sans font-bold cursor-pointer pb-0.5"
                >
                  &lsaquo;
                </button>
                <button 
                  onClick={() => scroll('right')} 
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all duration-200 text-[16px] font-sans font-bold cursor-pointer pb-0.5"
                >
                  &rsaquo;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ARTIFACT CAROUSEL WINDOW PANELS */}
        <div className="w-full overflow-hidden rounded-[8px]">
          {/* 🎯 ADJUSTMENTS 2 & 3: 
              - Updated grid padding rules: 'gap-4 md:gap-5 lg:gap-6'
              - Updated math widths to subtract out extra space so cards align perfectly with headers:
                Mobile auto-cols: minus 2rem
                Tablet auto-cols: minus 3.75rem
                Desktop auto-cols: minus 7.5rem (120px space for 6 columns)
          */}
          <div 
            ref={railRef} 
            onScroll={handleScroll}
            className="no-scrollbar w-full grid grid-flow-col auto-cols-[calc((100%-2rem)/3)] md:auto-cols-[calc((100%-3.75rem)/4)] lg:auto-cols-[calc((100%-7.5rem)/6)] gap-4 md:gap-5 lg:gap-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {activeArtifacts.map((item, index) => {
              const artifact = item?.artifact ? item.artifact : item;

              return (
                <Link 
                  key={index} 
                  href={`/artifact/${artifact.slug}`}
                  className="w-full shrink-0 snap-start group/card cursor-pointer block"
                >
                  <div className="w-full aspect-[2/3] rounded-[8px] bg-zinc-900/40 border border-white/5 overflow-hidden relative transition-all duration-300 group-hover/card:scale-[1.02] shadow-xl flex items-center justify-center">
                    {artifact.blok_tall ? (
                      <img 
                        src={artifact.blok_tall} 
                        alt={artifact.name} 
                        className="w-full h-full object-cover pointer-events-none" 
                        loading="lazy" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 text-center text-white/30 font-sans font-medium text-[11px]" style={{ background: 'linear-gradient(to bottom, #3b3954, #272538)' }}>
                        {artifact.name} {index + 1}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}