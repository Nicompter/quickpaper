'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Terminal, 
  Settings, 
  Zap, 
  Server, 
  Shield, 
  Globe,
  Monitor,
  Apple,
  Laptop,
  ChevronRight,
  BookOpen
} from 'lucide-react';

type ParameterInfo = {
  name: string;
  shortName?: string;
  type: string;
  default: string;
  description: {
    de: string;
    en: string;
  };
};

const bashParameters: ParameterInfo[] = [
  {
    name: '--dir',
    type: 'PATH',
    default: '~/paper-server',
    description: {
      de: 'Installationsverzeichnis für den Server',
      en: 'Installation directory for the server',
    },
  },
  {
    name: '--version',
    type: 'VERSION',
    default: 'latest',
    description: {
      de: 'Minecraft-Version (z.B. 1.21.4, 1.20.4)',
      en: 'Minecraft version (e.g. 1.21.4, 1.20.4)',
    },
  },
  {
    name: '--min-ram',
    type: 'SIZE',
    default: '2G',
    description: {
      de: 'Minimaler RAM für die JVM (-Xms)',
      en: 'Minimum RAM for JVM (-Xms)',
    },
  },
  {
    name: '--max-ram',
    type: 'SIZE',
    default: '4G',
    description: {
      de: 'Maximaler RAM für die JVM (-Xmx)',
      en: 'Maximum RAM for JVM (-Xmx)',
    },
  },
  {
    name: '--port',
    type: 'PORT',
    default: '25565',
    description: {
      de: 'Server-Port für Minecraft',
      en: 'Server port for Minecraft',
    },
  },
  {
    name: '--op',
    type: 'PLAYER',
    default: '-',
    description: {
      de: 'Spielername, der automatisch Operator wird',
      en: 'Player name that will automatically become operator',
    },
  },
  {
    name: '--auto-update',
    type: 'FLAG',
    default: 'false',
    description: {
      de: 'Aktiviert automatische Updates auf die neueste Paper-Version',
      en: 'Enables automatic updates to the latest Paper version',
    },
  },
  {
    name: '--dashboard',
    type: 'FLAG',
    default: 'false',
    description: {
      de: 'Installiert TheDashboard Web-Panel Plugin (nur 1.21+)',
      en: 'Installs TheDashboard web panel plugin (1.21+ only)',
    },
  },
  {
    name: '--accept-eula',
    type: 'FLAG',
    default: 'false',
    description: {
      de: 'Akzeptiert die Minecraft EULA automatisch (erforderlich für non-interactive)',
      en: 'Automatically accepts the Minecraft EULA (required for non-interactive)',
    },
  },
  {
    name: '--yes',
    type: 'FLAG',
    default: 'false',
    description: {
      de: 'Installiert fehlende Abhängigkeiten automatisch ohne Nachfrage',
      en: 'Automatically installs missing dependencies without prompting',
    },
  },
  {
    name: '--non-interactive',
    type: 'FLAG',
    default: 'false',
    description: {
      de: 'Keine Eingabeaufforderungen, verwendet Standardwerte',
      en: 'No prompts, uses default values',
    },
  },
  {
    name: '--lang',
    shortName: 'de|en',
    type: 'LANG',
    default: 'auto',
    description: {
      de: 'Sprache für Ausgaben (de oder en)',
      en: 'Language for output (de or en)',
    },
  },
  {
    name: '-h, --help',
    type: 'FLAG',
    default: '-',
    description: {
      de: 'Zeigt die Hilfe an',
      en: 'Shows help',
    },
  },
];

const powershellParameters: ParameterInfo[] = [
  {
    name: '-Dir',
    type: 'String',
    default: '~\\paper-server',
    description: {
      de: 'Installationsverzeichnis für den Server',
      en: 'Installation directory for the server',
    },
  },
  {
    name: '-MCVersion',
    type: 'String',
    default: 'latest',
    description: {
      de: 'Minecraft-Version (z.B. 1.21.4, 1.20.4)',
      en: 'Minecraft version (e.g. 1.21.4, 1.20.4)',
    },
  },
  {
    name: '-MinRam',
    type: 'String',
    default: '2G',
    description: {
      de: 'Minimaler RAM für die JVM (-Xms)',
      en: 'Minimum RAM for JVM (-Xms)',
    },
  },
  {
    name: '-MaxRam',
    type: 'String',
    default: '4G',
    description: {
      de: 'Maximaler RAM für die JVM (-Xmx)',
      en: 'Maximum RAM for JVM (-Xmx)',
    },
  },
  {
    name: '-Port',
    type: 'Int',
    default: '25565',
    description: {
      de: 'Server-Port für Minecraft',
      en: 'Server port for Minecraft',
    },
  },
  {
    name: '-Op',
    type: 'String',
    default: '-',
    description: {
      de: 'Spielername, der automatisch Operator wird',
      en: 'Player name that will automatically become operator',
    },
  },
  {
    name: '-AutoUpdate',
    type: 'Switch',
    default: 'false',
    description: {
      de: 'Aktiviert automatische Updates auf die neueste Paper-Version',
      en: 'Enables automatic updates to the latest Paper version',
    },
  },
  {
    name: '-Dashboard',
    type: 'Switch',
    default: 'false',
    description: {
      de: 'Installiert TheDashboard Web-Panel Plugin (nur 1.21+)',
      en: 'Installs TheDashboard web panel plugin (1.21+ only)',
    },
  },
  {
    name: '-AcceptEula',
    type: 'Switch',
    default: 'false',
    description: {
      de: 'Akzeptiert die Minecraft EULA automatisch',
      en: 'Automatically accepts the Minecraft EULA',
    },
  },
  {
    name: '-Yes',
    type: 'Switch',
    default: 'false',
    description: {
      de: 'Installiert fehlende Abhängigkeiten automatisch',
      en: 'Automatically installs missing dependencies',
    },
  },
  {
    name: '-NonInteractive',
    type: 'Switch',
    default: 'false',
    description: {
      de: 'Keine Eingabeaufforderungen, verwendet Standardwerte',
      en: 'No prompts, uses default values',
    },
  },
  {
    name: '-Lang',
    type: 'String',
    default: 'auto',
    description: {
      de: 'Sprache für Ausgaben (de oder en)',
      en: 'Language for output (de or en)',
    },
  },
  {
    name: '-Help',
    type: 'Switch',
    default: '-',
    description: {
      de: 'Zeigt die Hilfe an',
      en: 'Shows help',
    },
  },
];

const supportedPlatforms = [
  {
    name: 'Linux',
    icon: Laptop,
    distros: ['Ubuntu/Debian (apt)', 'Fedora/RHEL (dnf)', 'Arch Linux (pacman)', 'Alpine (apk)', 'openSUSE (zypper)', 'Gentoo (emerge)'],
  },
  {
    name: 'macOS',
    icon: Apple,
    distros: ['macOS 10.15+ (Homebrew)'],
  },
  {
    name: 'Windows',
    icon: Monitor,
    distros: ['Windows 10/11 (PowerShell 5.1+)', 'Windows Server 2016+'],
  },
  {
    name: 'FreeBSD',
    icon: Server,
    distros: ['FreeBSD 12+ (pkg)'],
  },
];

function ParameterTable({ parameters, shell }: { parameters: ParameterInfo[]; shell: 'bash' | 'powershell' }) {
  const { locale } = useI18n();
  const isDE = locale === 'de';

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">{isDE ? 'Parameter' : 'Parameter'}</th>
            <th className="text-left py-3 px-4 font-semibold">{isDE ? 'Typ' : 'Type'}</th>
            <th className="text-left py-3 px-4 font-semibold">{isDE ? 'Standard' : 'Default'}</th>
            <th className="text-left py-3 px-4 font-semibold">{isDE ? 'Beschreibung' : 'Description'}</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, index) => (
            <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <code className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                  {param.name}
                </code>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className="font-mono text-xs">
                  {param.type}
                </Badge>
              </td>
              <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                {param.default}
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {isDE ? param.description.de : param.description.en}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      {title && (
        <div className="bg-muted px-4 py-2 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground">{title}</span>
        </div>
      )}
      <div className="bg-zinc-950 p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-zinc-300">{children}</pre>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const { locale } = useI18n();
  const isDE = locale === 'de';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="size-4" />
              <span>{isDE ? 'Dokumentation' : 'Documentation'}</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  {isDE ? 'Dokumentation' : 'Documentation'}
                </h1>
                <p className="text-muted-foreground">
                  {isDE ? 'Alles was du über Quickpaper wissen musst' : 'Everything you need to know about Quickpaper'}
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="size-5" />
                {isDE ? 'Inhalt' : 'Contents'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a href="#quick-start" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  <Zap className="size-4" />
                  {isDE ? 'Schnellstart' : 'Quick Start'}
                </a>
                <a href="#platforms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  <Globe className="size-4" />
                  {isDE ? 'Unterstützte Plattformen' : 'Supported Platforms'}
                </a>
                <a href="#bash-params" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  <Terminal className="size-4" />
                  {isDE ? 'Bash Parameter' : 'Bash Parameters'}
                </a>
                <a href="#powershell-params" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  <Monitor className="size-4" />
                  {isDE ? 'PowerShell Parameter' : 'PowerShell Parameters'}
                </a>
                <a href="#examples" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  <Server className="size-4" />
                  {isDE ? 'Beispiele' : 'Examples'}
                </a>
                <a href="#auto-update" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  <Shield className="size-4" />
                  {isDE ? 'Auto-Update' : 'Auto-Update'}
                </a>
                <a href="#dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  <Monitor className="size-4" />
                  TheDashboard
                </a>
                <a href="#tmux" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted">
                  <Terminal className="size-4" />
                  tmux
                </a>
              </nav>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <section id="quick-start" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="size-6 text-primary" />
              {isDE ? 'Schnellstart' : 'Quick Start'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isDE 
                ? 'Der schnellste Weg, einen Minecraft Server zu starten:'
                : 'The fastest way to start a Minecraft server:'}
            </p>
            
            <div className="grid gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Laptop className="size-4" />
                  <span className="font-medium">Linux / macOS / FreeBSD</span>
                </div>
                <CodeBlock title="bash">
{`curl -fsSL https://quickpaper.nicompter.de/install | bash`}
                </CodeBlock>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="size-4" />
                  <span className="font-medium">Windows (PowerShell)</span>
                </div>
                <CodeBlock title="PowerShell">
{`irm https://quickpaper.nicompter.de/install?os=win | iex`}
                </CodeBlock>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Supported Platforms */}
          <section id="platforms" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Globe className="size-6 text-primary" />
              {isDE ? 'Unterstützte Plattformen' : 'Supported Platforms'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isDE 
                ? 'Quickpaper unterstützt eine Vielzahl von Betriebssystemen und Paketmanagern:'
                : 'Quickpaper supports a variety of operating systems and package managers:'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supportedPlatforms.map((platform) => (
                <Card key={platform.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <platform.icon className="size-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">{platform.name}</h3>
                    </div>
                    <ul className="space-y-1">
                      {platform.distros.map((distro, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                          {distro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-8" />

          {/* Bash Parameters */}
          <section id="bash-params" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Terminal className="size-6 text-primary" />
              {isDE ? 'Bash Parameter (Linux/macOS/FreeBSD)' : 'Bash Parameters (Linux/macOS/FreeBSD)'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isDE 
                ? 'Diese Parameter können mit dem Bash-Script verwendet werden:'
                : 'These parameters can be used with the Bash script:'}
            </p>
            
            <Card>
              <CardContent className="p-0">
                <ParameterTable parameters={bashParameters} shell="bash" />
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8" />

          {/* PowerShell Parameters */}
          <section id="powershell-params" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Monitor className="size-6 text-primary" />
              {isDE ? 'PowerShell Parameter (Windows)' : 'PowerShell Parameters (Windows)'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isDE 
                ? 'Diese Parameter können mit dem PowerShell-Script verwendet werden:'
                : 'These parameters can be used with the PowerShell script:'}
            </p>
            
            <Card>
              <CardContent className="p-0">
                <ParameterTable parameters={powershellParameters} shell="powershell" />
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8" />

          {/* Examples */}
          <section id="examples" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Server className="size-6 text-primary" />
              {isDE ? 'Beispiele' : 'Examples'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  {isDE ? 'Schnelle Installation ohne Prompts (Linux/macOS)' : 'Quick installation without prompts (Linux/macOS)'}
                </h3>
                <CodeBlock title="bash">
{`curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- \\
  --non-interactive \\
  --yes \\
  --accept-eula \\
  --auto-update`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  {isDE ? 'Benutzerdefinierte Installation (Linux/macOS)' : 'Custom installation (Linux/macOS)'}
                </h3>
                <CodeBlock title="bash">
{`curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- \\
  --dir /opt/minecraft \\
  --version 1.21.4 \\
  --min-ram 4G \\
  --max-ram 8G \\
  --port 25566 \\
  --op MyUsername \\
  --accept-eula \\
  --auto-update`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  {isDE ? 'Windows PowerShell Installation' : 'Windows PowerShell Installation'}
                </h3>
                <CodeBlock title="PowerShell">
{`# Download und Ausführen
irm https://quickpaper.nicompter.de/install?os=win | iex

# Oder mit Parametern
irm https://quickpaper.nicompter.de/install?os=win -OutFile install.ps1
.\\install.ps1 -MCVersion 1.21.4 -MinRam 4G -MaxRam 8G -Port 25566 -AcceptEula -AutoUpdate`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  {isDE ? 'Sprache erzwingen' : 'Force language'}
                </h3>
                <CodeBlock title="bash">
{`# Deutsch
curl -fsSL "https://quickpaper.nicompter.de/install?lang=de" | bash

# English
curl -fsSL "https://quickpaper.nicompter.de/install?lang=en" | bash`}
                </CodeBlock>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Auto-Update */}
          <section id="auto-update" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="size-6 text-primary" />
              Auto-Update
            </h2>
            <p className="text-muted-foreground mb-4">
              {isDE 
                ? 'Wenn Auto-Update aktiviert ist, prüft der Server bei jedem Start auf neue Paper-Versionen und aktualisiert automatisch auf die neueste Version.'
                : 'When Auto-Update is enabled, the server checks for new Paper versions on every start and automatically updates to the latest version.'}
            </p>
            
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-4">
                <p className="text-sm">
                  <strong>{isDE ? 'Hinweis:' : 'Note:'}</strong>{' '}
                  {isDE 
                    ? 'Auto-Update aktualisiert immer auf die neueste Paper-Version, auch wenn du eine spezifische Version installiert hast. Dies kann zu inkompatiblen Plugin-Versionen führen.'
                    : 'Auto-Update always updates to the latest Paper version, even if you installed a specific version. This may lead to incompatible plugin versions.'}
                </p>
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8" />

          {/* TheDashboard */}
          <section id="dashboard" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Monitor className="size-6 text-primary" />
              TheDashboard Plugin
            </h2>
            <p className="text-muted-foreground mb-4">
              {isDE 
                ? 'TheDashboard ist ein Web-Panel, das direkt als Plugin läuft. Verwalte deinen Server bequem über den Browser - keine externe Software nötig.'
                : 'TheDashboard is a web panel that runs directly as a plugin. Manage your server conveniently via browser - no external software required.'}
            </p>
            
            <div className="grid gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">{isDE ? 'Features' : 'Features'}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {isDE ? 'Online-Spieler ansehen und verwalten (Kick, Ban, OP)' : 'View and manage online players (Kick, Ban, OP)'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {isDE ? 'Live-Konsole und Server-Logs im Browser' : 'Live console and server logs in browser'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {isDE ? 'Server stoppen und neu starten' : 'Stop and restart server'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {isDE ? 'Whitelist verwalten' : 'Manage whitelist'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {isDE ? 'Live-TPS-Anzeige' : 'Live TPS display'}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{isDE ? 'Nach der Installation' : 'After Installation'}</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>{isDE ? 'Server starten' : 'Start the server'}</li>
                  <li>{isDE ? 'Im Browser öffnen:' : 'Open in browser:'} <code className="text-primary">http://&lt;server-ip&gt;:4646/</code></li>
                  <li>{isDE ? 'Beim ersten Start Passwort setzen' : 'Set password on first start'}</li>
                  <li>{isDE ? 'Einloggen und loslegen!' : 'Log in and start managing!'}</li>
                </ol>
              </CardContent>
            </Card>

            <div className="mt-4">
              <a 
                href="https://modrinth.com/plugin/thedashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {isDE ? '→ Mehr Infos auf Modrinth' : '→ More info on Modrinth'}
              </a>
            </div>
          </section>

          <Separator className="my-8" />

          {/* tmux Session */}
          <section id="tmux" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Terminal className="size-6 text-primary" />
              tmux {isDE ? 'Session' : 'Session'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isDE 
                ? 'Der Server läuft in einer tmux-Session, damit er auch nach dem Schließen des Terminals weiterläuft.'
                : 'The server runs in a tmux session, so it keeps running even after closing the terminal.'}
            </p>
            
            <div className="grid gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">{isDE ? 'Wichtige Befehle' : 'Important Commands'}</h3>
                  <ul className="space-y-3 text-sm font-mono">
                    <li className="flex flex-col gap-1">
                      <code className="text-primary">tmux attach -t minecraft</code>
                      <span className="text-muted-foreground text-xs font-sans">
                        {isDE ? 'Zur Server-Konsole verbinden' : 'Attach to server console'}
                      </span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <code className="text-primary">Ctrl+B, {isDE ? 'dann' : 'then'} D</code>
                      <span className="text-muted-foreground text-xs font-sans">
                        {isDE ? 'Konsole verlassen (Server läuft weiter)' : 'Detach from console (server keeps running)'}
                      </span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <code className="text-primary">tmux kill-session -t minecraft</code>
                      <span className="text-muted-foreground text-xs font-sans">
                        {isDE ? 'Server stoppen (brutal, lieber "stop" im Spiel eingeben)' : 'Force stop server (use "stop" in-game instead)'}
                      </span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <code className="text-primary">tmux ls</code>
                      <span className="text-muted-foreground text-xs font-sans">
                        {isDE ? 'Alle aktiven Sessions auflisten' : 'List all active sessions'}
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{isDE ? 'Warum tmux?' : 'Why tmux?'}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>{isDE ? 'Server läuft weiter nach SSH-Disconnect' : 'Server keeps running after SSH disconnect'}</li>
                  <li>{isDE ? 'Konsole kann jederzeit wieder geöffnet werden' : 'Console can be reopened anytime'}</li>
                  <li>{isDE ? 'Logs und Ausgaben bleiben erhalten' : 'Logs and outputs are preserved'}</li>
                  <li>{isDE ? 'Mehrere Sessions parallel möglich' : 'Multiple sessions can run in parallel'}</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* API Reference */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">API</h2>
            <p className="text-muted-foreground mb-4">
              {isDE 
                ? 'Der Install-Endpoint erkennt automatisch dein Betriebssystem:'
                : 'The install endpoint automatically detects your operating system:'}
            </p>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">GET</Badge>
                    <div>
                      <code className="text-primary">/install</code>
                      <p className="text-muted-foreground text-xs mt-1">
                        {isDE ? 'Automatische OS-Erkennung' : 'Automatic OS detection'}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">GET</Badge>
                    <div>
                      <code className="text-primary">/install?os=win</code>
                      <p className="text-muted-foreground text-xs mt-1">
                        {isDE ? 'Windows PowerShell Script' : 'Windows PowerShell script'}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">GET</Badge>
                    <div>
                      <code className="text-primary">/install?os=linux</code>
                      <p className="text-muted-foreground text-xs mt-1">
                        {isDE ? 'Bash Script (Linux/macOS/FreeBSD)' : 'Bash script (Linux/macOS/FreeBSD)'}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">GET</Badge>
                    <div>
                      <code className="text-primary">/install?lang=de</code>
                      <p className="text-muted-foreground text-xs mt-1">
                        {isDE ? 'Sprache erzwingen (de/en)' : 'Force language (de/en)'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
