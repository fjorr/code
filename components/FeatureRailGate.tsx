'use client';

import React, { type ReactNode } from 'react';
import { useMinimalFilter } from '@/components/MinimalFilterContext';

/** Hide feature rail while mixes, dials, artifacts, or home search chrome are active. */
export default function FeatureRailGate({ children }: { children: ReactNode }) {
  const { queryActive, contentType, searchChromeOpen } = useMinimalFilter();
  if (queryActive || contentType === 'artifact' || searchChromeOpen) return null;
  return <>{children}</>;
}
