// app/password/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FjorrWordmark } from '@/components/brand/FjorrMarks';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(false);

    const res = await fetch('/api/gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // router.refresh forces the middleware to instantly evaluate the newly added cookie token
      router.refresh();
      router.push('/');
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-dark-01 flex flex-col items-center justify-center px-6 text-white font-sans selection:bg-white selection:text-black">
      <div className="w-full max-w-xs flex flex-col items-center text-center">
        
        {/* FJORR OFFICIAL BRAND MARK VECTOR LOGO */}
        <div className="mb-10 text-white flex items-center justify-center">
          <FjorrWordmark className="h-[52px] w-[85px]" />
        </div>

        <form onSubmit={handleVerify} className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access phrase"
            className={`w-full h-11 bg-[#2e2e2e] border ${
              error ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-white/20'
            } rounded-full px-4 text-sm text-center font-mono font-semibold tracking-normal text-white placeholder-white/40 transition-all outline-none`}
            autoFocus
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-white hover:bg-white/90 text-black text-sm font-bold rounded-full transition-all active:scale-[0.99] duration-150 flex items-center justify-center"
          >
            {loading ? 'Verifying...' : 'Unlock'}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 font-semibold font-mono mt-3 capitalize tracking-normal">
            Access Key Invalid.
          </p>
        )}
      </div>
    </div>
  );
}