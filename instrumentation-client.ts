import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/ingest',
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
  capture_exceptions: true,
  debug: process.env.NODE_ENV === 'development',
  // Privacy settings for GDPR compliance
  respect_dnt: true, // Respect "Do Not Track" browser setting
  persistence: 'localStorage', // Use localStorage instead of cookies
  mask_all_text: false, // Set to true if you want to mask all text in session recordings
  mask_all_element_attributes: false, // Set to true for stricter privacy
});

// IMPORTANT: Never combine this approach with other client-side PostHog initialization approaches,
// especially components like a PostHogProvider. instrumentation-client.ts is the correct solution
// for initializing client-side PostHog in Next.js 15.3+ apps.
