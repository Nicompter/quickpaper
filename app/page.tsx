import {
  Navbar,
  HeroSection,
  FeaturesSection,
  InstallationSection,
  CtaSection,
  Footer,
} from '@/components/landing';

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <InstallationSection />
      <CtaSection />
      <Footer />
    </main>
  );
}