import ProductCard from "./ProductCard";
const ProductsSection = ({ data }: { data: any }) => {
  const content = data;
  const products = content.items.map((item: any) => ({
    ...item,
    description: item.desc,
    badgeVariant: item.badge.toLowerCase() === 'bulk' ? 'bulk' : (item.badge.toLowerCase() === 'premium' ? 'premium' : 'organic')
  }));

  return (
    <section id="products" className="section-padding bg-muted">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {content.badge}
          </span>
          <h2 className="heading-section text-foreground mb-4">
            {content.title} <span className="text-primary">{content.highlight}</span>
          </h2>
          <p className="text-body text-muted-foreground">
            {content.description}
          </p>
        </div>

        {/* Product Grid - 3 columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product: any, index: number) => (
            <div
              key={product.title}
              className="animate-fade-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            {content.cta}
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
