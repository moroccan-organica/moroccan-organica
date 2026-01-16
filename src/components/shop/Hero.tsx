import HeroCarousel from "./HeroCarousel";

const Hero = ({ data, lang }: { data: any, lang: string }) => {
    return (
        <HeroCarousel
            slides={data.slides}
            trust={data.trust}
            cta={data.cta}
            lang={lang}
        />
    );
};

export default Hero;
