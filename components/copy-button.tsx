'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import posthog from 'posthog-js';

interface CopyButtonProps {
  text: string;
  copiedText: string;
  source: string;
}

export function CopyButton({ text, copiedText, source }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    posthog.capture('install_command_copied', {
      command: text,
      source,
    });
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 bg-card border border-border rounded-xl p-4 font-mono text-sm cursor-pointer transition-all hover:border-primary/50",
        copied && "border-green-500/50"
      )}
      onClick={copyToClipboard}
    >
      <span className="text-muted-foreground select-none">$</span>
      <code className="flex-1 text-left text-foreground truncate">
        {text}
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

      <span
        className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs rounded-lg opacity-0 transition-opacity pointer-events-none",
          copied && "opacity-100"
        )}
      >
        {copiedText}
      </span>
    </div>
  );
}
