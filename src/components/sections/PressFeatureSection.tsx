import Image from "next/image";
const PressFeatureSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* UN Today Logo */}
        <div className="text-center">
          <div className="relative inline-block w-96 h-36">
            <Image
              src="/images/untoday-logo.webp"
              alt="UN Today"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">
              International Day of Argania • 10 May
            </p>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Argan oil and the importance of the argan tree to Morocco
            </h3>
            <p className="text-muted-foreground italic">
              Celebrated as "Liquid Gold" for Skin, Hair, and Culinary Excellence
            </p>
          </header>

          <div className="prose prose-lg max-w-none text-foreground/80 font-serif leading-relaxed">
            <p className="mb-6">
              On 10 May, we celebrate the International Day of Argania, a multipurpose tree that produces the world-renowned argan oil. Argan oil, often called 'liquid gold,' has become a renowned beauty and health product worldwide, celebrated for its numerous benefits and versatile uses. Extracted from the nuts of the argan tree (<em>Argania spinosa</em>), native to the southwestern regions of Morocco, this oil has been used for centuries by the Berber people for both culinary and cosmetic purposes. Its rich composition makes it an exceptional natural resource with applications in skin care, hair care, health, and even cooking.
            </p>
            <p className="mb-6">
              There are many benefits of argan oil, as outlined below:
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Skin care</h4>
            <p className="mb-6">
              Argan oil is packed with essential fatty acids, vitamin E, and antioxidants, making it an excellent moisturizer for dry and sensitive skin. Its anti-inflammatory properties and high linoleic acid content help maintain the skin's natural barrier, preventing moisture loss while softening and smoothing the skin. It's also beneficial for reducing wrinkles and fine lines, promoting elasticity, and soothing conditions such as acne, eczema, and psoriasis.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Hair care</h4>
            <p className="mb-6">
              Thanks to its high vitamin E content and antioxidants, argan oil nourishes and repairs hair, improving strength, softness, and shine—especially for dry, damaged, or frizzy hair. Applying a few drops directly to the hair helps reduce split ends, tame frizz, restore moisture, and promote overall scalp health.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Anti-aging</h4>
            <p className="mb-6">
              The potent vitamin E content fights free radicals responsible for the breakdown of skin cells. This keeps the skin youthful and vibrant, minimizing the appearance of fine lines and wrinkles while supporting long-term elasticity.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Health benefits</h4>
            <p className="mb-6">
              Argan oil is also a staple in Moroccan cuisine. Its monounsaturated fats and polyphenols make it heart-healthy, supporting better cholesterol levels, boosting cardiovascular health, and promoting overall well-being. Its anti-inflammatory properties may help reduce the risk of chronic diseases such as diabetes and heart disease.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Nail and cuticle care</h4>
            <p className="mb-6">
              Rich nourishment helps moisturize nails and cuticles, preventing cracking or peeling and improving overall strength and appearance.
            </p>

            <h3 className="text-foreground font-bold text-2xl mb-4 mt-10">The importance of the argan tree to Morocco</h3>
            <p className="mb-6">
              The argan tree is a vital part of Morocco's natural and cultural heritage. It is not only a source of income for many families, but it also plays a key role in the environment and the local economy.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Economic significance</h4>
            <p className="mb-6">
              Argan oil is one of Morocco's most important export products. Its growing popularity in international markets has created new income opportunities for rural communities in southern Morocco. Women-led cooperatives, established in the 1990s, have empowered local communities economically by providing financial independence and access to education and healthcare.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Environmental importance</h4>
            <p className="mb-6">
              The argan tree plays a crucial role in protecting Morocco's ecosystem. These trees are adapted to semi-arid regions, and their deep roots help prevent soil erosion and desertification. Argan forests, covering approximately 800,000 hectares, act as a barrier against the Sahara Desert's expansion, sustain biodiversity, and even provide food for the famous tree-climbing goats.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Cultural and heritage significance</h4>
            <p className="mb-6">
              The argan tree has long been central to Berber culture. Traditional extraction methods, which involve grinding the nuts by hand, have been passed down through generations and remain an essential part of the region's cultural heritage. The production process is often a communal activity led by women, strengthening social bonds.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">Sustainability and conservation</h4>
            <p className="mb-6">
              Rising global demand raised concerns about sustainability, but significant efforts are underway to protect argan forests. UNESCO recognized the argan forest as a biosphere reserve in 1998, encouraging responsible farming and harvesting practices. Many cooperatives now focus on organic and sustainable production to ensure this valuable resource endures.
            </p>

            <h4 className="text-primary font-semibold text-xl mb-3 mt-8">International recognition and preservation</h4>
            <p className="mb-6">
              The International Day of Argania, celebrated on 10 May each year, highlights the economic, social, and environmental importance of the argan tree. It underscores the need to preserve and protect this treasure, whose impact extends far beyond Morocco, enriching global beauty, health, and wellness industries. Argan oil is not just a cosmetic or culinary product; it is a testament to the ingenuity and resilience of the Berber people and a resource that must be preserved for future generations.
            </p>
          </div>

          {/* CTA Footer */}
          <footer className="mt-12 pt-8 border-t border-border text-center">
            <a
              href="https://untoday.org/argan-oil-and-the-importance-of-the-argan-tree-to-morocco/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-lg"
            >
              Read full article on UN Today
              <span className="text-xl">→</span>
            </a>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default PressFeatureSection;
