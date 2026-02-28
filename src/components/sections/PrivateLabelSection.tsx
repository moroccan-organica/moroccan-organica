import Image from "next/image";
import { ReactNode } from "react";

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

    const highlightKeywords = (text: string, keywords: string[]): ReactNode => {
        let parts: Array<string | ReactNode> = [text];

        keywords.forEach((keyword, keywordIndex) => {
            parts = parts.flatMap((part) => {
                if (typeof part !== "string") return part;
                const segments = part.split(new RegExp(`(${keyword})`, "gi"));
                return segments.map((segment, segmentIndex) => {
                    if (segment.toLowerCase() === keyword.toLowerCase()) {
                        return (
                            <strong
                                key={`${keyword}-${keywordIndex}-${segmentIndex}`}
                                className="text-foreground font-semibold"
                            >
                                {segment}
                            </strong>
                        );
                    }
                    return segment;
                });
            });
        });

        return parts;
    };

    return (
        <section className="bg-muted/20 pt-0 md:pt-4 lg:pt-6 pb-6 md:pb-10 lg:pb-12">
            <div className="container-main">
                {/* Top Section: Discover Services */}
                <div className="text-center max-w-5xl mx-auto mb-14 animate-fade-in-up">
                    <p className="heading-section text-foreground text-4xl md:text-5xl lg:text-6xl mb-8">
                        {data.discoverTitle} <span className="text-primary">{data.discoverHighlight}</span> {data.discoverSuffix}
                    </p>
                    <div className="mx-auto space-y-4 text-lg md:text-xl leading-8 text-muted-foreground/90">
                        <p>
                            {highlightKeywords(data.discoverText1, ["private labeling", "cosmetic products"])}
                        </p>
                        {data.discoverText2 && (
                            <p>
                                {highlightKeywords(data.discoverText2, ["private labeling", "cosmetic products"])}
                            </p>
                        )}
                        {data.discoverText3 && (
                            <p>
                                {highlightKeywords(data.discoverText3, ["private labeling", "cosmetic products"])}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Add Your Own Brand */}
                <div className="text-center mb-10">
                    <p className="heading-section uppercase text-foreground text-3xl md:text-4xl lg:text-[40px] leading-tight">
                        {data.brandTitle} <span className="text-primary">{data.brandHighlight}</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">
                    {/* Image Side */}
                    <div className="relative animate-fade-in-left lg:order-1 w-full max-w-xl mx-auto md:mx-0 md:justify-self-start flex flex-col gap-4">
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-card aspect-square">
                            <Image
                                src="/images/private-label-argan.jpg"
                                alt={data.discoverHighlight}
                                width={720}
                                height={720}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        </div>
                        <div className="p-4 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-muted flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                <span className="text-2xl font-serif font-bold text-accent-foreground">50+</span>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{data.countriesServed}</p>
                                <p className="font-semibold text-foreground">{data.globalExport}</p>
                            </div>
                        </div>
                        {/* Decorative Background */}
                        <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-2xl bg-primary/10" />
                    </div>

                    {/* Content Side */}
                    <div className="animate-fade-in-right lg:order-2 flex flex-col justify-start gap-4 lg:pl-6 xl:pl-10 max-w-2xl mx-auto md:mx-0 text-left">
                        <div className="space-y-4 text-muted-foreground/90 leading-7 md:leading-8 max-w-3xl">
                            <p>
                                {highlightKeywords(data.brandText1, ["private label"])}
                            </p>
                            {data.brandText2 && (
                                <p>
                                    {highlightKeywords(data.brandText2, ["private label"])}
                                </p>
                            )}
                            {data.brandText3 && (
                                <p>
                                    {highlightKeywords(data.brandText3, ["high-quality natural"])}
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
