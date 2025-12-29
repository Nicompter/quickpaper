'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { Separator } from '@/components/ui/separator';
import { Zap, Heart, Github } from 'lucide-react';
import posthog from 'posthog-js';

export function Footer() {
    const { t } = useI18n();

    const links = [
        { href: '#features', label: t.nav.features },
        { href: '#installation', label: t.nav.installation },
        { href: '/docs', label: t.nav.docs },
        { href: 'https://github.com/Nicompter/quickpaper', label: t.nav.github, external: true },
    ];

    const legal = [
        { href: '/privacy', label: t.footer.privacy },
    ];

    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Zap className="size-6 text-primary" />
                            <span className="font-bold text-xl">
                                Quick<span className="text-primary">paper</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            {t.footer.description}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            <Link
                                href="https://github.com/Nicompter/quickpaper"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                                onClick={() => {
                                    // PostHog: Track GitHub link click from footer
                                    posthog.capture('footer_link_clicked', {
                                        link_type: 'github',
                                        destination: 'https://github.com/Nicompter/quickpaper',
                                        source: 'footer_social',
                                    });
                                }}
                            >
                                <Github className="size-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">{t.footer.links}</h4>
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => {
                                            // PostHog: Track footer link click
                                            posthog.capture('footer_link_clicked', {
                                                link_type: link.external ? 'external' : 'internal',
                                                link_label: link.label,
                                                destination: link.href,
                                                source: 'footer_links',
                                            });
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
                        <ul className="space-y-2">
                            {legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => {
                                            // PostHog: Track legal link click
                                            posthog.capture('footer_link_clicked', {
                                                link_type: 'legal',
                                                link_label: link.label,
                                                destination: link.href,
                                                source: 'footer_legal',
                                            });
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} Quickpaper. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1">
                        {t.footer.madeWith} <Heart className="size-4 text-red-500 fill-red-500" /> {t.footer.by}{' '}
                        <Link href="https://nicompter.de" className="text-foreground hover:text-primary transition-colors">
                            Nicompter
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
