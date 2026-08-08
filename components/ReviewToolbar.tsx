import { VercelToolbar } from '@vercel/toolbar/next';

/**
 * Injects Vercel Comments toolbar while the site is password-gated (staging +
 * pre-launch production) and in local development. After public launch
 * (`SITE_GATE_ENABLED` off), visitors no longer get the toolbar prompt.
 */
export function ReviewToolbar() {
  const enabled =
    process.env.NODE_ENV === 'development' ||
    process.env.SITE_GATE_ENABLED === 'true';

  if (!enabled) return null;
  return <VercelToolbar />;
}
