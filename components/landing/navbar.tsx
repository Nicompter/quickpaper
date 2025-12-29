import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { MobileMenu } from '@/components/mobile-menu';
import { Translations, Locale } from '@/lib/i18n';

interface NavbarProps {
  t: Translations;
  locale: Locale;
}

export function Navbar({ t, locale }: NavbarProps) {
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
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher currentLocale={locale} />
            <Button size="sm" className="ml-2" asChild>
              <a href="#installation">{t.hero.cta}</a>
            </Button>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher currentLocale={locale} />
            <MobileMenu links={navLinks} ctaText={t.hero.cta} />
          </div>
        </div>
      </div>
    </nav>
  );
}
