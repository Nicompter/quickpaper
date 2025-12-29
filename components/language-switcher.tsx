'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import posthog from 'posthog-js';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [locale, setLocale] = useState<Locale>(currentLocale);

  const toggleLocale = () => {
    const newLocale = locale === 'de' ? 'en' : 'de';
    setLocale(newLocale);
    
    // Set cookie for server-side detection
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    
    // Track language change
    posthog.capture('language_changed', {
      from: locale,
      to: newLocale,
    });
    
    // Reload to get new SSR content
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="gap-1.5"
    >
      <Globe className="size-4" />
      <span className="uppercase text-xs font-medium">{locale}</span>
    </Button>
  );
}
