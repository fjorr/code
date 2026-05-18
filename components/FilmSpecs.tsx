'use client';

import React, { useState, useEffect } from 'react';

interface SubtitleItem {
  name: string;
  code: string;
  vttUrl: string;
}

interface FilmSpecsProps {
  film: any;
  audioLanguages: string[];
  subtitles: SubtitleItem[];
  themes: string[];
}

interface TranscriptCue {
  time: string;
  text: string;
}

export default function FilmSpecs({ film, audioLanguages, subtitles, themes }: FilmSpecsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SubtitleItem | null>(subtitles[0] || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [transcriptCues, setTranscriptCues] = useState<TranscriptCue[]>([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  // Mock static fallback text just in case a VTT URL isn't configured in Supabase yet
  const fallbackCues: TranscriptCue[] = [
    { time: '00:00', text: "I'm sorry, but I don't want to be an emperor." },
    { time: '00:03', text: "That's not my business." },
    { time: '00:05', text: "I don't want to rule or conquer anyone." },
    { time: '00:08', text: "I should like to help everyone if possible." },
    { time: '00:10', text: "Jew, gentile, black man, white." },
    { time: '00:13', text: "We all want to help one another." },
    { time: '00:15', text: "Human beings are like that." }
  ];

  // Automatically fetch and convert WebVTT format into clean timestamps
  useEffect(() => {
    if (!selectedLang?.vttUrl) {
      setTranscriptCues(fallbackCues);
      return;
    }

    async function loadVtt() {
      setLoadingTranscript(true);
      try {
        const res = await fetch(selectedLang!.vttUrl);
        const text = await res.text();
        
        // Parse simple WebVTT structures
        const lines = text.split('\n');
        const parsedCues: TranscriptCue[] = [];
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('-->')) {
            const timeRaw = lines[i].split('-->')[0].trim();
            // Trim down HH:MM:SS.MMM to MM:SS
            const parts = timeRaw.split(':');
            const formattedTime = parts.length === 3 ? `${parts[1]}:${parts[2].split('.')[0]}` : timeRaw;
            
            const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
            if (nextLine) {
              parsedCues.push({ time: formattedTime, text: nextLine });
            }
          }
        }
        setTranscriptCues(parsedCues.length > 0 ? parsedCues : fallbackCues);
      } catch (err) {
        console.error("Error reading WebVTT transcript data asset:", err);
        setTranscriptCues(fallbackCues);
      } finally {
        setLoadingTranscript(false);
      }
    }

    loadVtt();
  }, [selectedLang]);

  // Safely parse out formatted metadata properties
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : film.release_year || '2026';
  const displayRuntime = film.runtime ? `${Math.ceil(film.runtime / 60)} min` : '1 min';
  const rawRatingName = film.rating?.name || film.rating_name || '4+';
  const displayRating = rawRatingName.toUpperCase().includes('AGES') ? rawRatingName : `Ages ${rawRatingName}`;

  return (
    <div className="w-full px-[10%] text-white/90 font-sans select-none relative z-20">
      
      {/* 📖 TOP REGION: ABOUT THE ASSET */}
      <div className="max-w-3xl mb-12">
        <h3 className="text-[20px] font-bold text-white mb-3">About Film</h3>
        <p className="text-[16px] leading-[1.6em] text-white/80 font-medium mb-4">
          {film.description || "No description asset mapped for this specific historical record profile entry."}
        </p>
        
        {/* SUB-METADATA SUBTITLE STRIP */}
        <div className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-white/50">
          {film.location && <span>{film.location}</span>}
          {film.location && film.story_date && <span className="text-white/20">•</span>}
          {film.story_date && <span>{film.story_date}</span>}
          {film.story_date && film.note && <span className="text-white/20">•</span>}
          {film.note && <span className="italic font-normal">{film.note}</span>}
        </div>

        {/* TRANSCRIPT DIALOG POPUP TOGGLE OVERLAY */}
        <button 
          onClick={() => setIsOpen(true)}
          className="mt-6 h-10 px-4 bg-white/10 hover:bg-white/15 active:scale-98 transition-all duration-150 rounded-[8px] inline-flex items-center gap-2 text-[14px] font-bold text-white border border-white/5 shadow-md"
        >
          <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span>Transcript</span>
        </button>
      </div>

      {/* 📋 BOTTOM REGION: TECHNICAL SPECIFICATION LAYOUT GRID */}
      <div className="w-full max-w-4xl border-t border-white/5 pt-10">
        <h3 className="text-[20px] font-bold text-white mb-6">Technical Specs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 text-[14px]">
          
          {/* Left specification columns */}
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline">
              <span className="w-28 text-white/40 font-medium">Runtime</span>
              <span className="text-white font-semibold">{displayRuntime}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 text-white/40 font-medium">Rating</span>
              <span className="text-white font-semibold">{displayRating}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 text-white/40 font-medium">Released</span>
              <span className="text-white font-semibold">{releaseYear}</span>
            </div>
          </div>

          {/* Right specification columns */}
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline">
              <span className="w-28 text-white/40 font-medium">Audio</span>
              <span className="text-white font-semibold">
                {audioLanguages.length > 0 ? audioLanguages.join(', ') : 'English'}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 text-white/40 font-medium">Subtitles</span>
              <span className="text-white font-semibold">
                {subtitles.length > 0 ? subtitles.map(s => s.name).join(', ') : 'English'}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 text-white/40 font-medium">Themes</span>
              <div className="flex flex-wrap gap-1.5 items-center">
                {themes.length > 0 ? (
                  themes.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 bg-white/10 text-white/80 rounded-[2px] text-[11px] font-bold tracking-wide uppercase select-none"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-white/30 italic font-normal">None assigned</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🎭 TRANSCRIPT LIGHTBOX ACCORDION MODAL SHELF */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#1D1D1F] border border-white/5 rounded-[24px] p-6 shadow-2xl flex flex-col max-h-[85vh] relative">
            
            {/* Header Layout Container */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
              
              {/* Language Picker Dropdown Trigger Section */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-10 px-4 bg-white/5 hover:bg-white/10 transition-colors rounded-[8px] flex items-center gap-3 text-[14px] font-semibold text-white border border-white/5"
                >
                  <span>{selectedLang?.name || 'English'}</span>
                  <svg className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Opened Menu Options Panel */}
                {isDropdownOpen && subtitles.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#2C2C2E] border border-white/10 rounded-[12px] shadow-xl overflow-hidden z-50 animate-pop-in">
                    {subtitles.map((sub, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          setSelectedLang(sub);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-[14px] font-medium transition-colors hover:bg-white/5 ${selectedLang?.code === sub.code ? 'text-white font-bold' : 'text-white/60'}`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Overlay Trigger Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="h-9 px-3 bg-white text-black hover:bg-white/90 active:scale-95 transition-all rounded-full flex items-center gap-1.5 text-[13px] font-bold shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Transcript</span>
              </button>
            </div>

            {/* Scrolling Dynamic Cue Text Grid Panel */}
            <div className="w-full flex-1 overflow-y-auto pr-2 space-y-4 font-mono scrollbar-thin scrollbar-thumb-white/10">
              {loadingTranscript ? (
                <div className="text-center py-12 text-white/40 text-[14px]">Loading lines...</div>
              ) : (
                transcriptCues.map((cue, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-6 text-[15px] leading-[1.6em]">
                    <span className="text-[#3A96DD] font-bold tracking-tight select-none pt-0.5">{cue.time}</span>
                    <span className="text-white/90 font-sans font-medium">{cue.text}</span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}