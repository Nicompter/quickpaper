'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  links: { href: string; label: string; external?: boolean }[];
  ctaText: string;
}

export function MobileMenu({ links, ctaText }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        className="md:hidden"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <div
        className={cn(
          'absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border md:hidden overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-64 py-4' : 'max-h-0'
        )}
      >
        <div className="flex flex-col gap-2 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button size="sm" className="mt-2" asChild>
            <a href="#installation" onClick={() => setIsOpen(false)}>
              {ctaText}
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
