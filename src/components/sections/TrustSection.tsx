import Image from "next/image";

interface TrustStat {
  value: string;
  label: string;
}

interface TrustContent {
  badge: string;
  title: string;
  highlight: string;
  warehouse: { title: string; desc: string; image: string };
  bulk: { title: string; desc: string; image: string };
  stats: TrustStat[];
}

const TrustSection = ({ data }: { data: TrustContent }) => {
  const content = data;

  return (
    <section id="trust" className="section-padding bg-background pt-1 md:pt-3 pb-6 md:pb-8">
      <div className="container-main">
        {/* Manufacturing Scale Images - header intentionally hidden */}
        <div className="sr-only">
          <span>{content.badge}</span>
          <p>
            {content.title} {content.highlight}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8 md:mb-10">
          <div className="relative rounded-2xl overflow-hidden shadow-card animate-fade-in-left">
            <Image
              src={content.warehouse.image}
              alt={content.warehouse.title}
              width={800}
              height={600}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-secondary/80 to-transparent" />
            <div className="sr-only">
              <p>{content.warehouse.title}</p>
              <p>{content.warehouse.desc}</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-card animate-fade-in-right">
            <Image
              src={content.bulk.image}
              alt={content.bulk.title}
              width={800}
              height={600}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-secondary/80 to-transparent" />
            <div className="sr-only">
              <p>{content.bulk.title}</p>
              <p>{content.bulk.desc}</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-primary rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.stats.map((stat: TrustStat, index: number) => (
              <div key={index}>
                <p className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-2">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
