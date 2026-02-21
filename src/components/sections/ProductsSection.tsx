import ProductCard from "@/components/shop/ProductCard";

type ProductBadge = "organic" | "bulk" | "premium";

interface ProductItem {
  title: string;
  desc: string;
  badge: string;
  image: string;
  badgeVariant?: ProductBadge;
  description: string;
  id?: string;
  price?: number;
  volume?: string;
  name?: string;
  nameAr?: string;
  descriptionAr?: string;
  slug?: string;
  badgeLabel?: string;
}

interface ProductsContent {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  cta: string;
  ctaButton?: string;
  items: ProductItem[];
}

const ProductsSection = ({ data }: { data: ProductsContent }) => {
  const content = data;
  const products: ProductItem[] = content.items.map((item) => {
    const badgeKey = item.badge || "organic";
    const badgeVariant: ProductBadge = badgeKey.toLowerCase() === "bulk"
      ? "bulk"
      : badgeKey.toLowerCase() === "premium"
        ? "premium"
        : "organic";

    // "Use the EN slug": Generate slug from English title if missing
    // item.title currently holds the English title (from static data) as dictionary uses 'name'
    const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return {
      ...item,
      description: (item.desc as string) ?? (item.description as string) ?? '',
      badgeVariant,
      badge: item.badgeLabel || item.badge || "Organic",
      slug,
      title: item.name || item.title, // Use translated name for display if available
    };
  });

  return (
    <section id="products" className="section-padding bg-muted pt-8 md:pt-10">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
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
          {products.map((product, index) => (
            <div
              key={product.title}
              className="animate-fade-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <ProductCard {...product} addToCartText={content.ctaButton} showAddToCart={false} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductsSection;
