export type ProductDescription = {
    label: string;
    labelAr: string;
    description: string;
    descriptionAr: string;
};

export type ShopProduct = {
    id: string;
    slug: string;
    category: string;
    image: string;
    gallery?: string[];
    badge?: string;
    volume: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    notes: string[];
    price: number;
    stockQuantity?: number;
    productDescriptions?: ProductDescription[];
};

export interface ShopCategory {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
}

export const shopCategories: ShopCategory[] = [
    {
        id: 'cat-oils',
        name: 'Oils',
        slug: 'oils',
        color: '#D4A373',
        icon: 'droplet',
    },
    {
        id: 'cat-hydrosols',
        name: 'Hydrosols',
        slug: 'hydrosols',
        color: '#A3B18A',
        icon: 'flower',
    },
    {
        id: 'cat-spa',
        name: 'Spa Rituals',
        slug: 'spa-rituals',
        color: '#BC6C25',
        icon: 'sparkles',
    },
    {
        id: 'cat-powders',
        name: 'Powders',
        slug: 'powders',
        color: '#606C38',
        icon: 'leaf',
    },
];

export const shopProducts: ShopProduct[] = [
    {
        id: "argan-5l",
        slug: "moroccan-argan-oil-5l",
        category: "Oils",
        image: "/images/slider/slide_1.webp",
        gallery: [
            "/images/slider/slide_1.webp",
            "/images/slider/slide_2.webp",
            "/images/slider/slide_5.webp",
        ],
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
        image: "/images/slider/slide_5.webp",
        gallery: [
            "/images/slider/slide_5.webp",
            "/images/slider/slide_1.webp",
            "/images/slider/slide_4.webp",
        ],
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
        image: "/images/slider/slide_2.webp",
        gallery: [
            "/images/slider/slide_2.webp",
            "/images/slider/slide_1.webp",
            "/images/slider/slide_3.webp",
        ],
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
        image: "/images/slider/slide_6.webp",
        gallery: [
            "/images/slider/slide_6.webp",
            "/images/slider/slide_2.webp",
            "/images/slider/slide_5.webp",
        ],
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
        image: "/images/slider/slide_4.webp",
        gallery: [
            "/images/slider/slide_4.webp",
            "/images/slider/slide_6.webp",
            "/images/slider/slide_3.webp",
        ],
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
        image: "/images/slider/slide_3.webp",
        gallery: [
            "/images/slider/slide_3.webp",
            "/images/slider/slide_1.webp",
            "/images/slider/slide_5.webp",
        ],
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
        image: "/images/slider/slide_6.webp",
        gallery: [
            "/images/slider/slide_6.webp",
            "/images/slider/slide_4.webp",
            "/images/slider/slide_2.webp",
        ],
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
        image: "/images/slider/slide_4.webp",
        gallery: [
            "/images/slider/slide_4.webp",
            "/images/slider/slide_3.webp",
            "/images/slider/slide_1.webp",
        ],
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
