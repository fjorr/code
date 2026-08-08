/** First-visit FeatureRail intro poster — dismissed once, then never shown again. */

export const INTRO_RAIL_STORAGE_KEY = 'fjorr_feature_intro_seen';

export function hasSeenFeatureIntro(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(INTRO_RAIL_STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function markFeatureIntroSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(INTRO_RAIL_STORAGE_KEY, '1');
  } catch {
    /* private mode */
  }
}
