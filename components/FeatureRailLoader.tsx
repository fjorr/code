'use client';

import React, { useState, useEffect } from 'react';
import FeatureRail from './FeatureRail'; 
import { createBrowserClient } from '@supabase/ssr';

export default function FeatureRailLoader() {
  const [featuredFilm, setFeaturedFilm] = useState<any>(null);
  
  // 🎯 ANIMATION TIMING ENGINE
  const [showAnchor, setShowAnchor] = useState<boolean>(true);
  const [fadeAnchor, setFadeAnchor] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) return;

        const supabase = createBrowserClient(url, key);

        const { data: filmData, error } = await supabase
          .from('film')
          .select(`
            id,
            name,
            slug,
            teaser,
            story_date,
            hero_wide,
            hero_clsx,
            hero_tall,
            title_art_code,
            title_art_hex,
            runtime,
            rating ( name ),
            theme ( name ),
            sponsor:sponsor_id ( name )
          `)
          .eq('slug', 'shoebox')
          .maybeSingle();

        if (error) {
          console.error(error.message);
          return;
        }

        if (filmData) {
          const sanitizedFilm = {
            ...filmData,
            sponsor: typeof filmData.sponsor === 'object' && filmData.sponsor !== null
              ? (filmData.sponsor as any).name 
              : filmData.sponsor
          };

          // 🎬 CHOREOGRAPHY SEQUENCE:
          // 1. Mount the real component underneath the dark box
          setFeaturedFilm(sanitizedFilm);
          
          // 2. Trigger the CSS transition class instantly
          setFadeAnchor(true);
          
          // 3. Remove the block completely from the DOM after the 500ms fade finishes
          setTimeout(() => {
            setShowAnchor(false);
          }, 500);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  return (
    <div className="w-full relative">
      
      {/* 1. THE CONTENT LAYER 
          Mounts silently in total darkness while the images download
      */}
      {featuredFilm && <FeatureRail film={featuredFilm} />}

      {/* 2. THE CHOSEN SOLID ANCHOR BOX
          Locks layout spacing instantly to kill layer jumps, then fades out beautifully.
      */}
      {showAnchor && (
        <div 
          className={`absolute inset-0 w-full px-8 md:px-16 pointer-events-none z-50 transform-gpu transition-opacity duration-500 ease-in-out ${
            fadeAnchor ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Matches your FeatureRail gutters, maximum width, and precise responsive aspect ratios */}
          <div 
            className="w-full max-w-[1440px] mx-auto aspect-[1/1.618] md:aspect-[4/3] lg:aspect-[16/9] rounded-[12px]" 
            style={{ backgroundColor: '#1F1F1F' }}
          />
        </div>
      )}

    </div>
  );
}