import Image from "next/image";

interface PrivateLabelData {
    badge: string;
    discoverTitle: string;
    discoverHighlight: string;
    discoverSuffix?: string;
    discoverText1: string;
    discoverText2: string;
    discoverText3: string;
    brandTitle: string;
    brandHighlight: string;
    brandText1: string;
    brandText2: string;
    brandText3: string;
    countriesServed: string;
    globalExport: string;
}

interface PrivateLabelSectionProps {
    data?: PrivateLabelData;
}

const PrivateLabelSection = ({ data }: PrivateLabelSectionProps) => {
    if (!data) return null;

    return (
        <section className="section-padding bg-muted/20">
            <div className="container-main">
                {/* Top Section: Discover Services */}
                <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in-up">
                    <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                        {data.badge}
                    </span>
                    <h2 className="heading-section text-foreground mb-8">
                        {data.discoverTitle} <span className="text-primary">{data.discoverHighlight}</span> {data.discoverSuffix}
                    </h2>
                    <div className="prose prose-lg text-muted-foreground font-serif leading-relaxed mx-auto">
                        <p className="mb-4">
                            {data.discoverText1}
                        </p>
                        {data.discoverText2 && (
                            <p className="mb-4">
                                {data.discoverText2}
                            </p>
                        )}
                        {data.discoverText3 && (
                            <p>
                                {data.discoverText3}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Add Your Own Brand */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative animate-fade-in-left lg:order-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-card aspect-square">
                            <Image
                                src="/images/private-label-argan.jpg"
                                alt={data.discoverHighlight}
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
                                        <p className="text-sm text-muted-foreground">{data.countriesServed}</p>
                                        <p className="font-semibold text-foreground">{data.globalExport}</p>
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
                            {data.brandTitle} <span className="text-primary">{data.brandHighlight}</span>
                        </h2>
                        <div className="prose prose-lg text-muted-foreground font-serif leading-relaxed">
                            <p className="mb-4">
                                {data.brandText1}
                            </p>
                            {data.brandText2 && (
                                <p className="mb-4">
                                    {data.brandText2}
                                </p>
                            )}
                            {data.brandText3 && (
                                <p>
                                    {data.brandText3}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrivateLabelSection;
