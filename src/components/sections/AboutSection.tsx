import Image from "next/image";
import { CheckCircle } from "lucide-react";

interface AboutSectionData {
  image: string;
  title: string;
  badge: string;
  highlight: string;
  description: string;
  features: string[];
  stats: {
    tons: { value: string; label: string };
    countries: { value: string; label: string };
    partners: { value: string; label: string };
    badge: { value: string; sub: string; desc: string };
  };
}

interface AboutSectionProps {
  data: AboutSectionData;
}

const AboutSection = ({ data }: AboutSectionProps) => {
  const content = data;

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative animate-fade-in-left" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <Image
                src={content.image}
                alt={content.title}
                width={800}
                height={800}
                className="w-full h-auto object-cover aspect-square"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-2xl font-serif font-bold text-accent-foreground">{content.stats.badge.value}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{content.stats.badge.sub}</p>
                    <p className="font-semibold text-foreground">{content.stats.badge.desc}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-2xl bg-primary/10" />
          </div>

          {/* Content Side */}
          <div className="animate-fade-in-right" style={{ animationDelay: "0.3s" }}>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              {content.badge}
            </span>
            <h2 className="heading-section text-foreground mb-6">
              {content.title} <span className="text-primary">{content.highlight}</span>
            </h2>
            <div
              className="text-body text-muted-foreground mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />

            {/* Feature List */}
            <ul className="space-y-4 mb-8">
              {content.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <p className="text-3xl font-serif font-bold text-primary">{content.stats.tons.value}</p>
                <p className="text-sm text-muted-foreground">{content.stats.tons.label}</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-primary">{content.stats.countries.value}</p>
                <p className="text-sm text-muted-foreground">{content.stats.countries.label}</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-primary">{content.stats.partners.value}</p>
                <p className="text-sm text-muted-foreground">{content.stats.partners.label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
