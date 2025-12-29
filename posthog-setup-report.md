# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Quickpaper project. This Next.js 16.1.1 application now has comprehensive event tracking for user interactions across the landing page, including both client-side and server-side analytics.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization using the Next.js 15.3+ recommended pattern
- `lib/posthog-server.ts` - Server-side PostHog client for API route tracking
- `.env` - Environment variables for PostHog configuration

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog to avoid ad blockers
- `components/landing/hero-section.tsx` - Added install command copy and CTA button tracking
- `components/landing/installation-section.tsx` - Added command copy, platform selection, and mode selection tracking
- `components/landing/language-switcher.tsx` - Added language change tracking
- `components/landing/navbar.tsx` - Added navigation and GitHub link tracking
- `components/landing/footer.tsx` - Added footer link tracking
- `components/landing/cta-section.tsx` - Added CTA button tracking
- `app/install/route.ts` - Added server-side install script download tracking

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `install_command_copied` | User copied the main install command from the hero section | `components/landing/hero-section.tsx` |
| `installation_command_copied` | User copied an install command with specific mode and platform | `components/landing/installation-section.tsx` |
| `platform_selected` | User selected a platform (Linux/macOS/Windows) | `components/landing/installation-section.tsx` |
| `installation_mode_selected` | User selected an installation mode (interactive/quick/custom) | `components/landing/installation-section.tsx` |
| `cta_button_clicked` | User clicked a call-to-action button | `components/landing/hero-section.tsx`, `components/landing/cta-section.tsx` |
| `github_link_clicked` | User clicked the GitHub link | `components/landing/hero-section.tsx`, `components/landing/navbar.tsx` |
| `language_changed` | User switched the language | `components/landing/language-switcher.tsx` |
| `docs_navigation_clicked` | User navigated to documentation | `components/landing/navbar.tsx` |
| `install_script_downloaded` | Install script was downloaded via the API (server-side) | `app/install/route.ts` |
| `footer_link_clicked` | User clicked a footer link | `components/landing/footer.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/111714/dashboard/471520) - Core analytics dashboard with all key metrics

### Insights
- [Install Command Copies Over Time](https://eu.posthog.com/project/111714/insights/ub5s97yu) - Tracks conversion intent
- [Platform Distribution](https://eu.posthog.com/project/111714/insights/0jnSJn0C) - Understand your audience's operating systems
- [Installation Mode Preferences](https://eu.posthog.com/project/111714/insights/SJsQOIFs) - Indicates user expertise level
- [Script Downloads (Server-side)](https://eu.posthog.com/project/111714/insights/DrZ4oY7c) - Ultimate conversion metric
- [User Engagement Overview](https://eu.posthog.com/project/111714/insights/IxP72Vp3) - Overall engagement metrics

## Configuration

PostHog is configured with the following environment variables in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_gnF8n8Ezzyg3I3SitIeLXFVoJMTuRlbFkiUp4O5bCoR
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

A reverse proxy is configured in `next.config.ts` to route PostHog requests through `/ingest/*` to avoid ad blockers.
