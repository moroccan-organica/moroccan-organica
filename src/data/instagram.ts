export interface InstagramPost {
  id: string;
  type: "reel" | "post";
  image: string;
  url: string;
  caption: string;
  likes?: string;
}

export const instagramPosts: InstagramPost[] = [
  {
    id: "1",
    type: "reel",
    image: "/images/products/cosmetic-argan-oil-handmade.webp",
    url: "https://www.instagram.com/reel/DIZ8E-wiTa1/",
    caption: "100% Pure Organic Moroccan Argan Oil • Liquid Gold",
    likes: "1.2k",
  },
  {
    id: "2",
    type: "post",
    image: "/images/products/blue-nila-powder.webp",
    url: "https://www.instagram.com/p/DQppdpaDFsv/",
    caption: "Authentic Moroccan Blue Nila Powder for glowing skin",
    likes: "856",
  },
  {
    id: "3",
    type: "reel",
    image: "/images/products/prickly-pear-cactus-scrub.webp",
    url: "https://www.instagram.com/reel/DIeyk5qMkUn/",
    caption: "Cold-Pressed Prickly Pear Seed Oil • Ultimate Anti-Aging",
    likes: "2.1k",
  },
  {
    id: "4",
    type: "reel",
    image: "/images/products/kessa-exfoliating-glove.webp",
    url: "https://www.instagram.com/moroccanorganic/reel/DHmgxwMCN8O/",
    caption: "Traditional Moroccan Hammam Ritual with Kessa Glove",
    likes: "1.5k",
  },
  {
    id: "5",
    type: "post",
    image: "/images/products/black-soap-argan-oil.webp",
    url: "https://www.instagram.com/p/DSZaQc7jNwM/",
    caption: "Organic Beldi Black Soap with Pure Argan & Olive Oil",
    likes: "940",
  },
  {
    id: "6",
    type: "post",
    image: "/images/products/pure-natural-rose-water.webp",
    url: "https://www.instagram.com/p/DQ_mI8kCFaH/",
    caption: "Pure Moroccan Rose Water distilled in Kelaat M'Gouna",
    likes: "1.1k",
  },
  {
    id: "7",
    type: "post",
    image: "/images/products/aker-fassi-powder.webp",
    url: "https://www.instagram.com/moroccanorganic/p/DHmXECqC9vb/",
    caption: "Natural Moroccan Aker Fassi Clay Pot for Lips & Cheeks",
    likes: "780",
  },
  {
    id: "8",
    type: "reel",
    image: "/images/moroccan-organic-cosmetics-private-label.jpg",
    url: "https://www.instagram.com/reel/DTONNiiDCSQ/",
    caption: "Sustainable Sourcing directly from Moroccan Cooperatives",
    likes: "3.4k",
  },
];

