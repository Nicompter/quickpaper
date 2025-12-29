import { Card, CardContent } from '@/components/ui/card';
import { 
  Terminal, 
  MessageSquare, 
  Zap, 
  Download, 
  Puzzle, 
  Monitor 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Translations } from '@/lib/i18n';

const featureIcons = {
  oneCommand: Terminal,
  interactive: MessageSquare,
  fast: Zap,
  papermc: Download,
  plugins: Puzzle,
  crossPlatform: Monitor,
};

const featureColors = {
  oneCommand: 'from-blue-500 to-cyan-500',
  interactive: 'from-purple-500 to-pink-500',
  fast: 'from-yellow-500 to-orange-500',
  papermc: 'from-green-500 to-emerald-500',
  plugins: 'from-indigo-500 to-purple-500',
  crossPlatform: 'from-rose-500 to-red-500',
};

type FeatureKey = keyof typeof featureIcons;

interface FeaturesSectionProps {
  t: Translations;
}

export function FeaturesSection({ t }: FeaturesSectionProps) {
  const features: { key: FeatureKey; data: { title: string; description: string } }[] = [
    { key: 'oneCommand', data: t.features.oneCommand },
    { key: 'interactive', data: t.features.interactive },
    { key: 'fast', data: t.features.fast },
    { key: 'papermc', data: t.features.papermc },
    { key: 'plugins', data: t.features.plugins },
    { key: 'crossPlatform', data: t.features.crossPlatform },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ key, data }, index) => {
            const Icon = featureIcons[key];
            const colorClass = featureColors[key];

            return (
              <Card
                key={key}
                className={cn(
                  "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-border/50 hover:border-primary/30"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className={cn(
                    "relative w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                    colorClass
                  )}>
                    <Icon className="size-6 text-white" />
                    <div className={cn(
                      "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-20 blur-xl transition-opacity",
                      colorClass
                    )} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">
                    {data.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {data.description}
                  </p>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors pointer-events-none" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
