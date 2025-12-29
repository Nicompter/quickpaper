'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { ArrowLeft, Shield, ShieldOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import posthog from 'posthog-js';
import { useState, useEffect } from 'react';

export default function PrivacyPage() {
    const { locale } = useI18n();
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
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 -ml-4">
                        <ArrowLeft className="size-4 mr-2" />
                        {locale === 'de' ? 'Zurück' : 'Back'}
                    </Button>
                </Link>

                {/* Opt-Out Card */}
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

                {locale === 'de' ? <PrivacyDE /> : <PrivacyEN />}
            </div>
        </div>
    );
}

function PrivacyDE() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Datenschutz</h1>
                <p className="text-muted-foreground">
                    Quickpaper ist ein Open-Source-Projekt. Wir respektieren deine Privatsphäre.
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Was wir erfassen</h2>
                <p className="text-muted-foreground">
                    Wir nutzen <strong>PostHog</strong> (Open-Source) für anonyme Nutzungsstatistiken:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Welche Seiten besucht werden</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Allgemeine technische Infos (Browser, Betriebssystem)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Ungefähre Region (Land)</span>
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Was wir NICHT tun</h2>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        <span>Keine Tracking-Cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        <span>Keine Weitergabe an Dritte</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        <span>Keine personenbezogenen Profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        <span>Keine Werbung</span>
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Datenschutzmaßnahmen</h2>
                <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm"><strong>EU-Server</strong> – Daten werden in der EU verarbeitet</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm"><strong>Do Not Track</strong> – Wird respektiert</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm"><strong>Open Source</strong> – Transparente Datenverarbeitung</span>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Opt-Out</h2>
                <p className="text-muted-foreground">
                    Du kannst die Analyse jederzeit oben auf dieser Seite deaktivieren. 
                    Alternativ kannst du die &quot;Do Not Track&quot;-Einstellung in deinem Browser aktivieren.
                </p>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
                <h2 className="text-xl font-semibold">Hosting</h2>
                <p className="text-muted-foreground">
                    Diese Website wird bei Vercel gehostet. Beim Aufruf werden technisch notwendige 
                    Server-Logs erstellt (IP-Adresse, Zeitstempel, aufgerufene Seite).
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Mehr Infos</h2>
                <p className="text-muted-foreground">
                    Weitere Details zur Datenverarbeitung findest du in der{' '}
                    <a 
                        href="https://posthog.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        PostHog Datenschutzerklärung
                    </a>.
                </p>
            </section>
        </div>
    );
}

function PrivacyEN() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Privacy</h1>
                <p className="text-muted-foreground">
                    Quickpaper is an open-source project. We respect your privacy.
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">What We Collect</h2>
                <p className="text-muted-foreground">
                    We use <strong>PostHog</strong> (open-source) for anonymous usage statistics:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Which pages are visited</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>General technical info (browser, operating system)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Approximate region (country)</span>
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">What We DON&apos;T Do</h2>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        <span>No tracking cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        <span>No data sharing with third parties</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        <span>No personal profiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✕</span>
                        <span>No advertising</span>
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Privacy Measures</h2>
                <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm"><strong>EU Servers</strong> – Data processed in the EU</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm"><strong>Do Not Track</strong> – Respected</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm"><strong>Open Source</strong> – Transparent data processing</span>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Opt-Out</h2>
                <p className="text-muted-foreground">
                    You can disable analytics at any time using the button at the top of this page. 
                    Alternatively, you can enable the &quot;Do Not Track&quot; setting in your browser.
                </p>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
                <h2 className="text-xl font-semibold">Hosting</h2>
                <p className="text-muted-foreground">
                    This website is hosted on Vercel. When you visit, technically necessary 
                    server logs are created (IP address, timestamp, page visited).
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">More Info</h2>
                <p className="text-muted-foreground">
                    For more details about data processing, see the{' '}
                    <a 
                        href="https://posthog.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        PostHog Privacy Policy
                    </a>.
                </p>
            </section>
        </div>
    );
}
