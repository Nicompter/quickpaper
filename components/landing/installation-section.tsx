'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, MessageSquare, Rocket, Settings, Monitor, Apple, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';
import posthog from 'posthog-js';

type InstallMode = 'interactive' | 'quick' | 'custom';
type Platform = 'linux' | 'macos' | 'windows';

const platformCommands: Record<Platform, Record<InstallMode, string>> = {
  linux: {
    interactive: 'curl -fsSL https://quickpaper.nicompter.de/install | bash',
    quick: 'curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --non-interactive --yes --accept-eula --auto-update',
    custom: 'curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --version 1.21.4 --min-ram 2G --max-ram 4G --port 25565 --accept-eula --auto-update',
  },
  macos: {
    interactive: 'curl -fsSL https://quickpaper.nicompter.de/install | bash',
    quick: 'curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --non-interactive --yes --accept-eula --auto-update',
    custom: 'curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --version 1.21.4 --min-ram 2G --max-ram 4G --port 25565 --accept-eula --auto-update',
  },
  windows: {
    interactive: 'irm https://quickpaper.nicompter.de/install?os=win | iex',
    quick: 'irm "https://quickpaper.nicompter.de/install?os=win" | iex; # Run with: -NonInteractive -Yes -AcceptEula -AutoUpdate',
    custom: 'irm "https://quickpaper.nicompter.de/install?os=win" -OutFile install.ps1; .\\install.ps1 -MCVersion 1.21.4 -MinRam 2G -MaxRam 4G -Port 25565 -AcceptEula -AutoUpdate',
  },
};

export function InstallationSection() {
  const { t } = useI18n();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<InstallMode>('interactive');
  const [activePlatform, setActivePlatform] = useState<Platform>('linux');

  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);

    // PostHog: Track installation command copied
    posthog.capture('installation_command_copied', {
      command: command,
      mode: activeMode,
      platform: activePlatform,
      source: 'installation_section',
    });
  };

  const platforms: { key: Platform; icon: typeof Monitor; label: string }[] = [
    { key: 'linux', icon: Laptop, label: 'Linux' },
    { key: 'macos', icon: Apple, label: 'macOS' },
    { key: 'windows', icon: Monitor, label: 'Windows' },
  ];

  const modes: { key: InstallMode; icon: typeof MessageSquare; data: { title: string; description: string; command: string } }[] = [
    { key: 'interactive', icon: MessageSquare, data: { ...t.installation.interactive, command: platformCommands[activePlatform].interactive } },
    { key: 'quick', icon: Rocket, data: { ...t.installation.quick, command: platformCommands[activePlatform].quick } },
    { key: 'custom', icon: Settings, data: { ...t.installation.custom, command: platformCommands[activePlatform].custom } },
  ];

  const shellPrompt = activePlatform === 'windows' ? 'PS>' : '$';
  const shellType = activePlatform === 'windows' ? 'PowerShell' : 'bash';

  return (
    <section id="installation" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t.installation.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.installation.subtitle}
          </p>
        </div>

        {/* Platform Selector */}
        <div className="flex justify-center gap-2 mb-6">
          {platforms.map(({ key, icon: Icon, label }) => (
            <Button
              key={key}
              variant={activePlatform === key ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setActivePlatform(key);
                // PostHog: Track platform selection
                posthog.capture('platform_selected', {
                  platform: key,
                  source: 'installation_section',
                });
              }}
              className="gap-2"
            >
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {modes.map(({ key, icon: Icon, data }) => (
            <Button
              key={key}
              variant={activeMode === key ? 'default' : 'outline'}
              onClick={() => {
                setActiveMode(key);
                // PostHog: Track installation mode selection
                posthog.capture('installation_mode_selected', {
                  mode: key,
                  mode_title: data.title,
                  platform: activePlatform,
                  source: 'installation_section',
                });
              }}
              className="gap-2"
            >
              <Icon className="size-4" />
              {data.title}
            </Button>
          ))}
        </div>

        {/* Active Mode Card */}
        <div className="max-w-3xl mx-auto">
          {modes.map(({ key, icon: Icon, data }) => (
            <Card
              key={key}
              className={cn(
                "transition-all duration-300",
                activeMode === key ? 'opacity-100 scale-100' : 'hidden'
              )}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{data.title}</h3>
                    <p className="text-muted-foreground">{data.description}</p>
                  </div>
                </div>

                {/* Shell Type Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-mono">
                    {shellType}
                  </span>
                </div>

                {/* Command Box */}
                <div 
                  className="group relative flex items-center gap-3 bg-background border border-border rounded-xl p-4 font-mono text-sm cursor-pointer transition-all hover:border-primary/50"
                  onClick={() => copyCommand(data.command)}
                >
                  <span className="text-primary select-none">{shellPrompt}</span>
                  <code className="flex-1 text-foreground break-all">
                    {data.command}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCommand(data.command);
                    }}
                  >
                    {copiedCommand === data.command ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Terminal Demo */}
        <div className="max-w-3xl mx-auto mt-12">
          <TerminalDemo platform={activePlatform} />
        </div>
      </div>
    </section>
  );
}

function TerminalDemo({ platform }: { platform: Platform }) {
  const { locale } = useI18n();
  const isDE = locale === 'de';
  const isWindows = platform === 'windows';
  const shellType = isWindows ? 'PowerShell' : 'bash';
  const prompt = isWindows ? 'PS C:\\Users\\User>' : '~$';
  const installCmd = isWindows 
    ? 'irm https://quickpaper.nicompter.de/install?os=win | iex'
    : 'curl -fsSL https://quickpaper.nicompter.de/install | bash';
  const serverDir = isWindows ? 'C:\\Users\\User\\paper-server' : '~/paper-server';
  const startCmd = isWindows 
    ? `cd "${serverDir}" && .\\start.ps1`
    : `cd ${serverDir} && ./start.sh`;

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/20 border border-border">
      {/* Terminal Header */}
      <div className="bg-card px-4 py-3 flex items-center gap-2 border-b border-border">
        <div className="flex gap-2">
          <div className={cn("w-3 h-3 rounded-full", isWindows ? "bg-red-500" : "bg-red-500")} />
          <div className={cn("w-3 h-3 rounded-full", isWindows ? "bg-yellow-500" : "bg-yellow-500")} />
          <div className={cn("w-3 h-3 rounded-full", isWindows ? "bg-green-500" : "bg-green-500")} />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono">{shellType}</span>
      </div>

      {/* Terminal Content */}
      <div className="bg-zinc-950 p-6 font-mono text-sm leading-relaxed overflow-x-auto">
        <div className="text-green-400">
          <span className="text-blue-400">{prompt}</span> {installCmd}
        </div>
        
        {/* ASCII Art Header */}
        <div className="mt-4 text-fuchsia-400 font-bold whitespace-pre text-xs sm:text-sm">
{`   ____        _      _                                   
  / __ \\      (_)    | |                                  
 | |  | |_   _ _  ___| | ___ __   __ _ _ __   ___ _ __    
 | |  | | | | | |/ __| |/ / '_ \\ / _\` | '_ \\ / _ \\ '__|   
 | |__| | |_| | | (__|   <| |_) | (_| | |_) |  __/ |      
  \\___\\_\\\\__,_|_|\\___|_|\\_\\ .__/ \\__,_| .__/ \\___|_|      
                          | |         | |                  
                          |_|         |_|                  `}
        </div>
        <div className="text-zinc-500 text-xs mt-1 mb-4">Minecraft Paper Server Installer {isWindows ? '(Windows)' : ''}</div>
        
        <div className="space-y-2 text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">→</span>
            <span>{isDE ? 'Prüfe Abhängigkeiten...' : 'Checking dependencies...'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">→</span>
            <span>{isDE ? 'Lade Build-Informationen...' : 'Fetching build info...'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">→</span>
            <span>{isDE ? 'Lade Paper herunter...' : 'Downloading Paper...'}</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-400">
            <span>✓</span>
            <span className="font-bold">{isDE ? 'Installation abgeschlossen!' : 'Installation complete!'}</span>
          </div>
          <div className="text-zinc-400 mt-2 text-xs space-y-1">
            <div><span className="text-zinc-500 font-bold">Server directory:</span> {serverDir}</div>
            <div><span className="text-zinc-500 font-bold">Start server:</span> {startCmd}</div>
            <div><span className="text-zinc-500 font-bold">Port:</span> 25565</div>
            <div><span className="text-zinc-500 font-bold">Minecraft:</span> 1.21.4 (build 232)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
