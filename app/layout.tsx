import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getLocale } from "@/lib/get-locale";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  
  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
