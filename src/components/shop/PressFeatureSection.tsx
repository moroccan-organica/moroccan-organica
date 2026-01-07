const PressFeatureSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* UN Today Logo */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-primary">UN</span>
              <span className="text-foreground">today</span>
            </h2>
            <div className="h-1 w-full bg-primary mt-2"></div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
              United Nations Media
            </p>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Sustainability Report • January 2024
            </p>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Moroccan Organic Exports: A Model for Sustainable Global Trade
            </h3>
            <p className="text-muted-foreground italic">
              How traditional farming practices are shaping the future of ethical commerce
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="font-serif text-lg text-foreground leading-relaxed mb-6">
              In an era where sustainability is no longer optional but essential, Morocco has emerged as 
              a beacon of hope for environmentally conscious trade. The North African nation&apos;s commitment 
              to organic farming and fair trade practices has positioned it as a leader in the global 
              movement toward ethical commerce.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-4 mt-8">
              Empowering Rural Communities
            </h4>
            <p className="font-serif text-lg text-foreground leading-relaxed mb-6">
              At the heart of Morocco&apos;s success story are the women&apos;s cooperatives that produce 
              the world-renowned Argan oil. These cooperatives not only preserve traditional extraction 
              methods but also provide economic independence to thousands of women in rural areas. The 
              impact extends beyond individual families, revitalizing entire communities and creating 
              sustainable livelihoods for future generations.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-4 mt-8">
              Environmental Stewardship
            </h4>
            <p className="font-serif text-lg text-foreground leading-relaxed mb-6">
              The organic certification process in Morocco goes beyond mere compliance. Farmers are 
              actively engaged in soil regeneration, water conservation, and biodiversity preservation. 
              The Argan forests, recognized by UNESCO as a Biosphere Reserve, serve as carbon sinks 
              while providing habitat for countless species. This holistic approach demonstrates that 
              profitable agriculture and environmental protection can coexist harmoniously.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-4 mt-8">
              Global Impact and Recognition
            </h4>
            <p className="font-serif text-lg text-foreground leading-relaxed mb-6">
              International buyers are increasingly seeking suppliers who align with the UN Sustainable 
              Development Goals. Moroccan exporters, with their transparent supply chains and commitment 
              to fair wages, are meeting this demand head-on. From saffron harvested in the highlands of 
              Taliouine to the mineral-rich Ghassoul clay of the Atlas Mountains, each product tells a 
              story of environmental responsibility and social equity.
            </p>

            <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 bg-muted/50 rounded-r-lg">
              <p className="font-serif text-xl italic text-foreground mb-2">
                &ldquo;Morocco&apos;s organic sector represents the future of global trade—where quality, 
                sustainability, and human dignity converge.&rdquo;
              </p>
              <cite className="text-sm text-muted-foreground not-italic">
                — Dr. Amina Benkhadra, UN Trade & Development Advisor
              </cite>
            </blockquote>

            <p className="font-serif text-lg text-foreground leading-relaxed mb-6">
              As the world navigates the challenges of climate change and economic inequality, Morocco&apos;s 
              organic export industry offers a compelling blueprint. It proves that businesses can thrive 
              while honoring both people and planet—a message that resonates now more than ever.
            </p>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              This article was originally published in UN Today Magazine, highlighting global sustainability initiatives.
            </p>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default PressFeatureSection;
