'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, ShieldOff, Check } from 'lucide-react';
import posthog from 'posthog-js';

interface OptOutCardProps {
  locale: 'de' | 'en';
}

export function OptOutCard({ locale }: OptOutCardProps) {
  const [optedOut, setOptedOut] = useState(false);

  useEffect(() => {
    setOptedOut(posthog.has_opted_out_capturing());
  }, []);

  const handleOptOut = () => {
    posthog.opt_out_capturing();
    setOptedOut(true);
  };

  const handleOptIn = () => {
    posthog.opt_in_capturing();
    setOptedOut(false);
  };

  return (
    <Card className="p-6 mb-10 border-primary/20 bg-card/50">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${optedOut ? 'bg-muted' : 'bg-primary/10'}`}>
          {optedOut ? (
            <ShieldOff className="size-6 text-muted-foreground" />
          ) : (
            <Shield className="size-6 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">
            {locale === 'de' ? 'Analyse-Einstellungen' : 'Analytics Settings'}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {optedOut
              ? locale === 'de'
                ? 'Du hast die Analyse deaktiviert. Wir erfassen keine Daten über deine Nutzung.'
                : 'You have opted out. We are not collecting any data about your usage.'
              : locale === 'de'
                ? 'Wir nutzen datenschutzfreundliche Analysen um zu verstehen, wie die Website genutzt wird.'
                : 'We use privacy-friendly analytics to understand how the website is used.'}
          </p>
          {optedOut ? (
            <Button onClick={handleOptIn} variant="outline" size="sm">
              <Check className="size-4 mr-2" />
              {locale === 'de' ? 'Analyse wieder aktivieren' : 'Enable Analytics'}
            </Button>
          ) : (
            <Button onClick={handleOptOut} variant="outline" size="sm">
              <ShieldOff className="size-4 mr-2" />
              {locale === 'de' ? 'Analyse deaktivieren (Opt-Out)' : 'Disable Analytics (Opt-Out)'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
