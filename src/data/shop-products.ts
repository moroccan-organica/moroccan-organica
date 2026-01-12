export type ShopProduct = {
    id: string;
    slug: string;
    category: string;
    image: string;
    badge?: string;
    volume: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    notes: string[];
    price: number;
};

export const shopProducts: ShopProduct[] = [
    {
        id: "argan-5l",
        slug: "moroccan-argan-oil-5l",
        category: "Oils",
        image:
            "https://images.unsplash.com/photo-1505576578451-6246cb56199c?auto=format&fit=crop&w=900&q=80",
        badge: "bestseller",
        volume: "5 L - 1.32 GAL",
        name: "Moroccan Argan Oil",
        nameAr: "زيت الأركان المغربي",
        description:
            "Cold-pressed, cosmetic-grade argan oil ideal for hair masks, facial serums, and spa rituals.",
        descriptionAr:
            "زيت أركان مضغوط على البارد بجودة تجميلية مثالي للشعر والبشرة وعلاجات السبا.",
        notes: ["Vitamin E rich", "Fair-trade certified", "Glass packaging"],
        price: 360,
    },
    {
        id: "prickly-pear-5l",
        slug: "prickly-pear-seed-oil-5l",
        category: "Oils",
        image:
            "https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&w=900&q=80",
        volume: "5 L - 1.32 GAL",
        name: "Prickly Pear Seed Oil",
        nameAr: "زيت بذور التين الشوكي",
        description:
            "Ultra-light oil prized for anti-aging facials and luxury skincare formulations.",
        descriptionAr:
            "زيت فائق الخفة مشهور بخصائصه المقاومة لعلامات التقدم في السن ومستحضرات العناية الفاخرة.",
        notes: ["High linoleic acid", "Hand-harvested seeds", "Amber glass"],
        price: 1490,
    },
    {
        id: "argan-10l",
        slug: "moroccan-argan-oil-10l",
        category: "Oils",
        image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
        volume: "10 L - 2.64 GAL",
        name: "Moroccan Argan Oil",
        nameAr: "زيت الأركان المغربي",
        description:
            "Bulk size perfect for spas, hotel amenities, and export distributors.",
        descriptionAr:
            "سعة كبيرة تناسب مراكز السبا والفنادق والموزعين الدوليين.",
        notes: ["Lab-tested purity", "Custom labels available", "MOQ-friendly"],
        price: 663,
    },
    {
        id: "argan-25l",
        slug: "moroccan-argan-oil-25l",
        category: "Oils",
        image:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
        volume: "25 L - 6.60 GAL",
        name: "Moroccan Argan Oil",
        nameAr: "زيت الأركان المغربي",
        description:
            "Industrial volume with batch traceability for cosmetic labs and private labels.",
        descriptionAr:
            "كمية صناعية مع تتبع كامل للدفعات موجهة للمختبرات والعلامات الخاصة.",
        notes: ["Batch certificate", "Export ready", "Eco pallets"],
        price: 1595,
    },
    {
        id: "black-soap-1l",
        slug: "eucalyptus-black-soap",
        category: "Spa Rituals",
        image:
            "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=900&q=80",
        volume: "1 L",
        name: "Eucalyptus Black Soap",
        nameAr: "صابونة سوداء بالأوكالبتوس",
        description:
            "Beldi paste infused with eucalyptus for traditional hammam exfoliation.",
        descriptionAr:
            "عجينة بلدية ممزوجة بالأوكالبتوس لتقشير الحمام المغربي التقليدي.",
        notes: ["100% olive paste", "Steam spa essential", "Vegan"],
        price: 49,
    },
    {
        id: "rose-water",
        slug: "atlas-rose-water",
        category: "Hydrosols",
        image:
            "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80",
        volume: "500 ml",
        name: "Atlas Rose Water",
        nameAr: "ماء الورد الأطلسي",
        description:
            "Steam-distilled petals sourced from Kalaat M'Gouna cooperatives.",
        descriptionAr:
            "ماء مقطر بالبخار من بتلات ورد قلعة مكونة التعاونية.",
        notes: ["Food & cosmetic grade", "UV-protected bottle", "Floral aroma"],
        price: 32,
    },
    {
        id: "ghassoul",
        slug: "atlas-ghassoul-clay",
        category: "Powders",
        image:
            "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=900&q=80",
        volume: "5 kg",
        name: "Atlas Ghassoul Clay",
        nameAr: "طين الغاسول الأطلسي",
        description:
            "Sun-dried clay powder popular for detox masks and scalp rituals.",
        descriptionAr:
            "طين مجفف بالشمس مثالي للأقنعة المزالة للسموم وعلاجات فروة الرأس.",
        notes: ["Micronized texture", "Reusable pouch", "Zero additives"],
        price: 120,
    },
    {
        id: "orange-blossom",
        slug: "orange-blossom-water",
        category: "Hydrosols",
        image:
            "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80",
        volume: "1 L",
        name: "Orange Blossom Water",
        nameAr: "ماء زهر البرتقال",
        description:
            "Fragrant neroli distillate for desserts, toners, and aromatherapy.",
        descriptionAr:
            "ماء زهر عطري يستخدم في الحلويات والتونر والعلاج العطري.",
        notes: ["Chef approved", "Glass carafe", "Harvest 2025"],
        price: 54,
    },
];

export const getProductBySlug = (slug: string) =>
    shopProducts.find((product) => product.slug === slug);
