export type Locale = 'de' | 'en';

export const translations = {
  de: {
    nav: {
      features: 'Features',
      installation: 'Installation',
      docs: 'Dokumentation',
      github: 'GitHub',
    },
    hero: {
      badge: 'Open Source',
      title: 'Minecraft Server Setup',
      titleHighlight: 'in Sekunden',
      description: 'Starte deinen Minecraft Server mit nur einem Befehl. Quickpaper macht Server-Setup so einfach wie nie zuvor – interaktiv oder vollautomatisch.',
      cta: 'Jetzt starten',
      ctaSecondary: 'Auf GitHub ansehen',
      installCommand: 'curl -fsSL https://quickpaper.nicompter.de/install | bash',
      copied: 'Kopiert!',
      copy: 'Kopieren',
    },
    features: {
      title: 'Warum Quickpaper?',
      subtitle: 'Alles was du brauchst, um deinen perfekten Minecraft Server zu starten',
      oneCommand: {
        title: 'Ein Befehl',
        description: 'Kein kompliziertes Setup mehr. Ein einziger Befehl und dein Server läuft.',
      },
      interactive: {
        title: 'Interaktiver Modus',
        description: 'Wähle Version, Speicher und Einstellungen in einem geführten Setup-Prozess.',
      },
      fast: {
        title: 'Blitzschnell',
        description: 'Optimiert für Geschwindigkeit. Dein Server startet in weniger als 60 Sekunden.',
      },
      papermc: {
        title: 'PaperMC Integration',
        description: 'Automatischer Download der neuesten Paper-Version mit optimaler Konfiguration.',
      },
      plugins: {
        title: 'Plugin Support',
        description: 'Einfache Integration von Plugins direkt beim Setup.',
      },
      crossPlatform: {
        title: 'Cross-Platform',
        description: 'Funktioniert auf Linux, macOS und Windows ohne Probleme.',
      },
    },
    installation: {
      title: 'Installation',
      subtitle: 'Wähle deinen Weg zum perfekten Minecraft Server',
      interactive: {
        title: 'Interaktiver Modus',
        description: 'Perfekt für Einsteiger. Werde durch alle Optionen geführt.',
        command: 'curl -fsSL https://quickpaper.nicompter.de/install | bash',
      },
      quick: {
        title: 'Schnellstart',
        description: 'Für Profis. Standardeinstellungen mit automatischen Updates auf die neueste Paper-Version.',
        command: 'curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --non-interactive --yes --accept-eula --auto-update',
      },
      custom: {
        title: 'Benutzerdefiniert',
        description: 'Volle Kontrolle über alle Parameter mit Auto-Update auf die neueste Version.',
        command: 'curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --version 1.21.4 --min-ram 2G --max-ram 4G --port 25565 --accept-eula --auto-update',
      },
    },
    demo: {
      title: 'So einfach geht\'s',
      step1: 'Befehl ausführen',
      step2: 'Optionen wählen',
      step3: 'Und spielen!',
    },
    cta: {
      title: 'Bereit für deinen eigenen Minecraft Server?',
      description: 'Starte jetzt in weniger als einer Minute. Kostenlos und Open Source.',
      button: 'Jetzt installieren',
    },
    footer: {
      description: 'Der einfachste Weg, einen Minecraft Server zu starten.',
      links: 'Links',
      legal: 'Rechtliches',
      privacy: 'Datenschutz',
      imprint: 'Impressum',
      madeWith: 'Erstellt mit',
      by: 'von',
    },
  },
  en: {
    nav: {
      features: 'Features',
      installation: 'Installation',
      docs: 'Documentation',
      github: 'GitHub',
    },
    hero: {
      badge: 'Open Source',
      title: 'Minecraft Server Setup',
      titleHighlight: 'in Seconds',
      description: 'Launch your Minecraft server with just one command. Quickpaper makes server setup easier than ever – interactive or fully automated.',
      cta: 'Get Started',
      ctaSecondary: 'View on GitHub',
      installCommand: 'curl -fsSL https://quickpaper.nicompter.de/install | bash',
      copied: 'Copied!',
      copy: 'Copy',
    },
    features: {
      title: 'Why Quickpaper?',
      subtitle: 'Everything you need to launch your perfect Minecraft server',
      oneCommand: {
        title: 'One Command',
        description: 'No more complicated setup. Just one command and your server is running.',
      },
      interactive: {
        title: 'Interactive Mode',
        description: 'Choose version, memory and settings in a guided setup process.',
      },
      fast: {
        title: 'Lightning Fast',
        description: 'Optimized for speed. Your server starts in less than 60 seconds.',
      },
      papermc: {
        title: 'PaperMC Integration',
        description: 'Automatic download of the latest Paper version with optimal configuration.',
      },
      plugins: {
        title: 'Plugin Support',
        description: 'Easy plugin integration right during setup.',
      },
      crossPlatform: {
        title: 'Cross-Platform',
        description: 'Works flawlessly on Linux, macOS and Windows.',
      },
    },
    installation: {
      title: 'Installation',
      subtitle: 'Choose your path to the perfect Minecraft server',
      interactive: {
        title: 'Interactive Mode',
        description: 'Perfect for beginners. Get guided through all options.',
        command: 'curl -fsSL https://quickpaper.nicompter.de/install | bash',
      },
      quick: {
        title: 'Quick Start',
        description: 'For pros. Default settings with automatic updates to the latest Paper version.',
        command: 'curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --non-interactive --yes --accept-eula --auto-update',
      },
      custom: {
        title: 'Custom',
        description: 'Full control over all parameters with auto-update to the latest version.',
        command: 'curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --version 1.21.4 --min-ram 2G --max-ram 4G --port 25565 --accept-eula --auto-update',
      },
    },
    demo: {
      title: 'It\'s That Easy',
      step1: 'Run command',
      step2: 'Choose options',
      step3: 'And play!',
    },
    cta: {
      title: 'Ready for your own Minecraft server?',
      description: 'Get started in less than a minute. Free and Open Source.',
      button: 'Install Now',
    },
    footer: {
      description: 'The easiest way to start a Minecraft server.',
      links: 'Links',
      legal: 'Legal',
      privacy: 'Privacy',
      imprint: 'Imprint',
      madeWith: 'Made with',
      by: 'by',
    },
  },
} as const;

export type Translations = typeof translations.de | typeof translations.en;

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('de')) {
    return 'de';
  }
  
  return 'en';
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}
