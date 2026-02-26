import Image from "next/image";

interface PressFeatureData {
  date: string;
  title: string;
  subtitle: string;
  intro1: string;
  intro2: string;
  benefits: {
    title: string;
    description: string;
  }[];
  importanceTitle: string;
  importanceIntro: string;
  importancePoints: {
    title: string;
    description: string;
  }[];
  cta: string;
}

interface PressFeatureSectionProps {
  data?: PressFeatureData;
}

const PressFeatureSection = ({ data }: PressFeatureSectionProps) => {
  if (!data) return null;

  return (
    <section className="section-padding bg-background pt-0 md:pt-2">
      <div className="container mx-auto px-4">
        {/* UN Today Logo */}
        <div className="text-center">
          <div className="relative inline-block w-full max-w-4xl h-52 md:h-64">
            <Image
              src="/images/untoday-logo.webp"
              alt="UN Today - Argan oil and the importance of the Argan tree to Morocco"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-5xl mx-auto">
          <header className="mb-8 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">
              {data.date}
            </p>
            <p className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {data.title}
            </p>
            <p className="text-muted-foreground italic">
              {data.subtitle}
            </p>
          </header>

          <div className="prose prose-lg max-w-none text-foreground/80 font-serif leading-relaxed">
            <p
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: `${data.intro1} ${data.intro2}` }}
            />

            {data.benefits.map((benefit, index) => (
              <div key={index}>
                <p className="text-primary font-semibold text-xl mb-3 mt-8">{benefit.title}</p>
                <p className="mb-6">{benefit.description}</p>
              </div>
            ))}

            <p className="text-foreground font-bold text-2xl mb-4 mt-10">{data.importanceTitle}</p>
            <p className="mb-6">
              {data.importanceIntro}
            </p>

            {data.importancePoints.map((point, index) => (
              <div key={index}>
                <p className="text-primary font-semibold text-xl mb-3 mt-8">{point.title}</p>
                <p className="mb-6">{point.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <footer className="mt-4 pt-3 border-t border-border text-center">
            <a
              href="https://untoday.org/argan-oil-and-the-importance-of-the-argan-tree-to-morocco/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-primary font-semibold text-3xl md:text-4xl underline underline-offset-8 decoration-4"
            >
              {data.cta}
              <span className="text-2xl md:text-3xl">→</span>
            </a>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default PressFeatureSection;
