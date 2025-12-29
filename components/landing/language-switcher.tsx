'use client';

import { useI18n } from '@/lib/i18n-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import posthog from 'posthog-js';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    const newLocale = locale === 'de' ? 'en' : 'de';
    setLocale(newLocale);

    // PostHog: Track language change
    posthog.capture('language_changed', {
      from_locale: locale,
      to_locale: newLocale,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleLocale}
      className="gap-2"
      aria-label="Switch language"
    >
      <Globe className="size-4" />
      <span className="text-xs font-medium uppercase">{locale}</span>
    </Button>
  );
}
