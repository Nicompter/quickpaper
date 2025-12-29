'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import posthog from 'posthog-js';

export function HeroSection() {
    const { t } = useI18n();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(t.hero.installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // PostHog: Track install command copied from hero section
        posthog.capture('install_command_copied', {
            command: t.hero.installCommand,
            source: 'hero_section',
        });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 mb-8">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5">
                            <Sparkles className="size-3.5 mr-1.5 text-primary" />
                            {t.hero.badge}
                        </Badge>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        {t.hero.title}
                        <br />
                        <span className="relative">
                            <span className="bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                {t.hero.titleHighlight}
                            </span>
                            <svg
                                className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                                viewBox="0 0 200 12"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 8 Q50 0, 100 8 T200 8"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                />
                            </svg>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        {t.hero.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto group"
                            asChild
                            onClick={() => {
                                // PostHog: Track CTA button click
                                posthog.capture('cta_button_clicked', {
                                    button_text: t.hero.cta,
                                    destination: '#installation',
                                    source: 'hero_section',
                                });
                            }}
                        >
                            <a href="#installation">
                                {t.hero.cta}
                                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                            asChild
                            onClick={() => {
                                // PostHog: Track GitHub link click
                                posthog.capture('github_link_clicked', {
                                    source: 'hero_section',
                                    destination: 'https://github.com/Nicompter/quickpaper',
                                });
                            }}
                        >
                            <a href="https://github.com/Nicompter/quickpaper" target="_blank" rel="noopener noreferrer">
                                {t.hero.ctaSecondary}
                            </a>
                        </Button>
                    </div>

                    {/* Install Command */}
                    <div className="max-w-xl mx-auto">
                        <div
                            className={cn(
                                "group relative flex items-center gap-3 bg-card border border-border rounded-xl p-4 font-mono text-sm cursor-pointer transition-all hover:border-primary/50",
                                copied && "border-green-500/50"
                            )}
                            onClick={copyToClipboard}
                        >
                            <span className="text-muted-foreground select-none">$</span>
                            <code className="flex-1 text-left text-foreground truncate">
                                {t.hero.installCommand}
                            </code>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard();
                                }}
                            >
                                {copied ? (
                                    <Check className="size-4 text-green-500" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </Button>

                            {/* Tooltip */}
                            <span
                                className={cn(
                                    "absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs rounded-lg opacity-0 transition-opacity",
                                    copied && "opacity-100"
                                )}
                            >
                                {t.hero.copied}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
