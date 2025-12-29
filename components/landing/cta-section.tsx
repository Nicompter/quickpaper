'use client';

import { useI18n } from '@/lib/i18n-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import posthog from 'posthog-js';

export function CtaSection() {
    const { t } = useI18n();

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-primary/5" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Decorative Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-8">
                    <Sparkles className="size-8 text-primary" />
                </div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                    {t.cta.title}
                </h2>

                {/* Description */}
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                    {t.cta.description}
                </p>

                {/* CTA Button */}
                <Button
                    size="lg"
                    className="group text-lg px-8 py-6"
                    asChild
                    onClick={() => {
                        // PostHog: Track CTA button click from bottom section
                        posthog.capture('cta_button_clicked', {
                            button_text: t.cta.button,
                            destination: '#installation',
                            source: 'cta_section',
                        });
                    }}
                >
                    <a href="#installation">
                        {t.cta.button}
                        <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                </Button>

            </div>
        </section>
    );
}
