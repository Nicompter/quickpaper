import { getLocale } from '@/lib/get-locale';
import { getTranslations } from '@/lib/i18n';
import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { InstallationSection } from '@/components/landing/installation-section';
import { CtaSection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default async function Page() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <main className="min-h-screen bg-background">
      <Navbar t={t} locale={locale} />
      <HeroSection t={t} />
      <FeaturesSection t={t} />
      <InstallationSection t={t} />
      <CtaSection t={t} />
      <Footer t={t} />
    </main>
  );
}