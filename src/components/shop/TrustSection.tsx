import Image from "next/image";
import warehouseImage from "@/assets/warehouse.jpg";
import bulkIngredientsImage from "@/assets/bulk-ingredients.jpg";

const TrustSection = ({ dict }: { dict: any }) => {
  const content = dict.trustSection;

  return (
    <section id="trust" className="section-padding bg-background">
      <div className="container-main">
        {/* Manufacturing Scale Images */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {content.badge}
          </span>
          <h2 className="heading-section text-foreground">
            {content.title} <span className="text-primary">{content.highlight}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-card animate-fade-in-left">
            <Image
              src={warehouseImage}
              alt={content.warehouse.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-serif text-xl font-semibold text-primary-foreground mb-1">
                {content.warehouse.title}
              </h3>
              <p className="text-sm text-primary-foreground/80">
                {content.warehouse.desc}
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-card animate-fade-in-right">
            <Image
              src={bulkIngredientsImage}
              alt={content.bulk.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-serif text-xl font-semibold text-primary-foreground mb-1">
                {content.bulk.title}
              </h3>
              <p className="text-sm text-primary-foreground/80">
                {content.bulk.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-primary rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.stats.map((stat: any, index: number) => (
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
