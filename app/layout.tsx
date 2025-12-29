import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n-context";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quickpaper - Minecraft Server Setup in Seconds",
  description: "Start your Minecraft server with just one command. Quickpaper makes server setup easier than ever – interactive or fully automated.",
  keywords: ["Minecraft", "Server", "PaperMC", "Setup", "CLI", "Tool"],
  authors: [{ name: "Nicompter" }],
  openGraph: {
    title: "Quickpaper - Minecraft Server Setup in Seconds",
    description: "Start your Minecraft server with just one command. Quickpaper makes server setup easier than ever.",
    type: "website",
    siteName: "Quickpaper",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quickpaper - Minecraft Server Setup in Seconds",
    description: "Start your Minecraft server with just one command.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            {children}
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
