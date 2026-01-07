import HeroCarousel from "./HeroCarousel";

const Hero = ({ dict, lang }: { dict: any, lang: string }) => {
    return (
        <HeroCarousel
            slides={dict.hero.slides}
            trust={dict.hero.trust}
            cta={dict.hero.cta}
            lang={lang}
        />
    );
};

export default Hero;
