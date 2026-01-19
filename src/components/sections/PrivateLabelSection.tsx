import Image from "next/image";

const PrivateLabelSection = () => {
    return (
        <section className="section-padding bg-muted/20">
            <div className="container-main">
                {/* Top Section: Discover Services */}
                <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in-up">
                    <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                        Our Services
                    </span>
                    <h2 className="heading-section text-foreground mb-8">
                        Discover our <span className="text-primary">private labelling</span> service
                    </h2>
                    <div className="prose prose-lg text-muted-foreground font-serif leading-relaxed mx-auto">
                        <p className="mb-4">
                            Organica Group offers comprehensive private labeling services for organic beauty products and body care products, supporting brands worldwide in developing high-quality cosmetic lines. We specialize in organic beauty and cosmetic private label solutions, providing end-to-end services tailored to professional brands, distributors, and retailers.
                        </p>
                        <p className="mb-4">
                            Our portfolio includes a wide range of organic body care and cosmetic products, manufactured according to international quality and safety standards. We proudly collaborate with partners across global markets, including the USA, UK, Canada, Malaysia, Japan, South Korea, China, Australia, Qatar, KSA, India, Pakistan, France, Netherlands, and South Africa, ensuring reliable production, compliance, and export capabilities.
                        </p>
                        <p>
                            With proven expertise in private label cosmetics manufacturing, Organica Group helps brands bring authentic organic beauty products to international markets with confidence, consistency, and certified quality.
                        </p>
                    </div>
                </div>

                {/* Bottom Section: Add Your Own Brand */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative animate-fade-in-left lg:order-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-card aspect-square">
                            <Image
                                src="/images/private-label-argan.jpg"
                                alt="Private Label Packaging Solutions"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                        <span className="text-2xl font-serif font-bold text-accent-foreground">50+</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Countries Served</p>
                                        <p className="font-semibold text-foreground">Global Export Ready</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Background */}
                        <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-2xl bg-primary/10" />
                    </div>

                    {/* Content Side */}
                    <div className="animate-fade-in-right lg:order-2">
                        <h2 className="heading-section text-foreground mb-6">
                            Add your own brand to <span className="text-primary">your product</span>
                        </h2>
                        <div className="prose prose-lg text-muted-foreground font-serif leading-relaxed">
                            <p className="mb-4">
                                Organica Group offers comprehensive private label and custom packaging solutions, enabling our clients to develop a fully personalized brand identity. We provide unique packaging options that can be tailored specifically to your brand's vision and market positioning. Through long-standing partnerships with international packaging manufacturers, we design and produce packaging suitable for all product categories. All partner factories are fully approved for the US and European markets, ensuring compliance, safety, and quality standards. In addition, we offer a wide selection of ready-to-use standard packaging, developed to deliver modern, high-performance, and visually appealing packaging solutions.
                            </p>
                            <p className="mb-4">
                                Customize your products by adding your logo and branding to create a distinctive private label line. Whether your project focuses on argan oil, rose water, prickly pear seed oil, Nila powder, Aker Fassi powder, or natural skincare essentials, we provide an end-to-end solution to bring your brand to market with authentic origin. Our professional design team supports you throughout the process, offering expert guidance in developing a unique range of health, beauty, and wellness products aligned with your business goals.
                            </p>
                            <p>
                                Partner with Organica Group, a trusted manufacturer, to enrich your brand with high-quality natural products, combining authenticity, certified quality, and reliable private label production in every item.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrivateLabelSection;
