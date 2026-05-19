'use client';

import React, { useState, useEffect } from 'react';
import FeatureRail from './FeatureRail'; 
import { createBrowserClient } from '@supabase/ssr';

export default function FeatureRailLoader() {
  const [featuredFilm, setFeaturedFilm] = useState<any>(null);
  const [diagnostic, setDiagnostic] = useState<string>("Initializing Client Gateway...");

  useEffect(() => {
    async function loadData() {
      try {
        setDiagnostic("Reading Env Credentials...");
        
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
          setDiagnostic("Missing Keys inside your local configurations.");
          return;
        }

        const supabase = createBrowserClient(url, key);
        setDiagnostic("Fetching featured film asset directly via slug target...");

        // 🎯 DIRECT LOOKUP: Queries the film table directly for 'shoebox' to guarantee it displays
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
          .eq('slug', 'shoebox') // 🌟 Looks up your exact asset row directly!
          .maybeSingle();

        if (error) {
          setDiagnostic(`Database Error: ${error.message} (Code: ${error.code})`);
          return;
        }

        if (filmData) {
          // Flatten the sponsor object cleanly for the presenter layer
          const sanitizedFilm = {
            ...filmData,
            sponsor: typeof filmData.sponsor === 'object' && filmData.sponsor !== null
              ? (filmData.sponsor as any).name 
              : filmData.sponsor
          };

          setFeaturedFilm(sanitizedFilm);
          setDiagnostic("Data loaded successfully.");
        } else {
          setDiagnostic("Connected successfully, but no film with slug 'shoebox' exists in your database table.");
        }
      } catch (err: any) {
        setDiagnostic(`Gateway Error: ${err.message || err}`);
      }
    }

    loadData();
  }, []);

  if (!featuredFilm) {
    return (
      <section className="w-full px-[10%] pb-[60px]">
        <div 
          className="w-full rounded-[12px] aspect-[1/1.618] md:aspect-[4/3] lg:aspect-[16/9] flex flex-col items-center justify-center font-sans text-[14px] p-6 text-center text-white/70" 
          style={{ backgroundColor: '#4C7A57' }}
        >
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <p className="font-mono text-[11px] bg-black/40 px-4 py-2 rounded border border-white/10 max-w-md break-all tracking-tight">
            {diagnostic}
          </p>
        </div>
      </section>
    );
  }

  return <FeatureRail film={featuredFilm} />;
}