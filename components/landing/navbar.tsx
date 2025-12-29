'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { Menu, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import posthog from 'posthog-js';

export function Navbar() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: t.nav.features },
    { href: '#installation', label: t.nav.installation },
    { href: '/docs', label: t.nav.docs },
    { href: 'https://github.com/Nicompter/quickpaper', label: t.nav.github, external: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg group-hover:bg-primary/30 transition-colors" />
              <Zap className="relative size-7 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Quick<span className="text-primary">paper</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  // PostHog: Track navigation clicks
                  if (link.href === '/docs') {
                    posthog.capture('docs_navigation_clicked', {
                      source: 'navbar_desktop',
                      destination: link.href,
                    });
                  } else if (link.external) {
                    posthog.capture('github_link_clicked', {
                      source: 'navbar_desktop',
                      destination: link.href,
                    });
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Button size="sm" className="ml-2" asChild>
              <a href="#installation">{t.hero.cta}</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-64 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => {
                  setIsOpen(false);
                  // PostHog: Track navigation clicks (mobile)
                  if (link.href === '/docs') {
                    posthog.capture('docs_navigation_clicked', {
                      source: 'navbar_mobile',
                      destination: link.href,
                    });
                  } else if (link.external) {
                    posthog.capture('github_link_clicked', {
                      source: 'navbar_mobile',
                      destination: link.href,
                    });
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            <Button size="sm" className="mt-2 w-full" asChild>
              <a href="#installation">{t.hero.cta}</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
