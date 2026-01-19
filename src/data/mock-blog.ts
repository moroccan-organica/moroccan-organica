import { BlogPostFull, BlogCategory, Author } from '@/types/blog';

export const mockAuthors: Author[] = [
  {
    id: 'author-1',
    name: 'Sofia Alaoui',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop',
    bio: 'Expert in natural beauty and Moroccan traditions.',
  },
  {
    id: 'author-2',
    name: 'Karim Benjelloun',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop',
    bio: 'Specialist in organic agriculture and sustainable farming.',
  }
];

export const mockCategories: BlogCategory[] = [
  {
    id: 'cat-1',
    name: 'Beauty Secrets',
    slug: 'beauty-secrets',
    color: '#D4A373',
    icon: 'sparkles',
  },
  {
    id: 'cat-2',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    color: '#A3B18A',
    icon: 'heart',
  },
  {
    id: 'cat-3',
    name: 'Moroccan Traditions',
    slug: 'moroccan-traditions',
    color: '#BC6C25',
    icon: 'landmark',
  },
  {
    id: 'cat-4',
    name: 'Organic Lifestyle',
    slug: 'organic-lifestyle',
    color: '#606C38',
    icon: 'leaf',
  }
];

export const mockBlogPosts: BlogPostFull[] = [
  {
    id: 'post-1',
    title: 'The Benefits of Pure Argan Oil for Your Skin',
    slug: 'benefits-pure-argan-oil-skin',
    excerpt: 'Discover why Argan oil is known as "Liquid Gold" and how it can transform your daily beauty routine.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'The Golden Secret of Morocco' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Argan oil has been used for centuries by Berber women for its extraordinary nutritional and cosmetic properties...' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Why use it daily?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Rich in vitamin E and essential fatty acids, it deeply hydrates and protects against environmental stressors.' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-1',
    author: mockAuthors[0],
    category_id: 'cat-1',
    category: mockCategories[0],
    tags: ['argan oil', 'beauty', 'natural'],
    status: 'published',
    published_at: '2024-01-10T10:00:00Z',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    view_count: 1540,
    read_time_minutes: 5,
  },
  {
    id: 'post-2',
    title: 'Traditional Moroccan Hamam: A Guide to Detox',
    slug: 'traditional-moroccan-hamam-detox-guide',
    excerpt: 'Learn the steps of an authentic Moroccan Hamam experience and how to replicate it at home.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'The Art of the Hamam' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'More than just a bath, the Hamam is a ritual of purification and relaxation...' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-1',
    author: mockAuthors[0],
    category_id: 'cat-3',
    category: mockCategories[2],
    tags: ['hamam', 'tradition', 'detox'],
    status: 'published',
    published_at: '2024-01-15T09:00:00Z',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
    view_count: 850,
    read_time_minutes: 7,
  },
  {
    id: 'post-3',
    title: 'Sustainable Harvesting of Saffron in the Atlas Mountains',
    slug: 'sustainable-saffron-harvesting-atlas-mountains',
    excerpt: 'An inside look at how we source the highest quality saffron while supporting local communities.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Red Gold of the Atlas' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Each flower is picked by hand at dawn to preserve its precious aroma...' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-2',
    author: mockAuthors[1],
    category_id: 'cat-4',
    category: mockCategories[3],
    tags: ['saffron', 'sustainable', 'agriculture'],
    status: 'published',
    published_at: '2024-01-20T11:00:00Z',
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-01-20T11:00:00Z',
    view_count: 1200,
    read_time_minutes: 6,
  }
  ,
  {
    id: 'post-4',
    title: 'Argan Oil Hair Masks for Deep Nourishment',
    slug: 'argan-oil-hair-masks-deep-nourishment',
    excerpt: 'DIY hair masks with Argan oil to restore shine and strength for dry or treated hair.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Silky hair at home' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Blend Argan oil with honey and yogurt for a rich treatment.' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-1',
    author: mockAuthors[0],
    category_id: 'cat-1',
    category: mockCategories[0],
    tags: ['hair', 'argan oil', 'diy'],
    status: 'published',
    published_at: '2024-02-01T09:00:00Z',
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z',
    view_count: 640,
    read_time_minutes: 4,
  },
  {
    id: 'post-5',
    title: 'Ghassoul Clay: The Moroccan Detox Ritual',
    slug: 'ghassoul-clay-moroccan-detox-ritual',
    excerpt: 'Cleanse your skin with mineral-rich Ghassoul clay straight from the Atlas Mountains.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Gentle detox' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Mix Ghassoul with rose water for a soothing mask.' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-2',
    author: mockAuthors[1],
    category_id: 'cat-2',
    category: mockCategories[1],
    tags: ['ghassoul', 'detox', 'clay'],
    status: 'published',
    published_at: '2024-02-05T10:30:00Z',
    created_at: '2024-02-05T10:30:00Z',
    updated_at: '2024-02-05T10:30:00Z',
    view_count: 720,
    read_time_minutes: 5,
  },
  {
    id: 'post-6',
    title: 'How to Build a Moroccan-Inspired Skincare Routine',
    slug: 'moroccan-inspired-skincare-routine',
    excerpt: 'Layering steps using Argan, cactus seed, and orange blossom for glowing skin.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Routine basics' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Cleanse, tone, nourish, seal with oils for nighttime.' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-1',
    author: mockAuthors[0],
    category_id: 'cat-1',
    category: mockCategories[0],
    tags: ['skincare', 'routine', 'morocco'],
    status: 'published',
    published_at: '2024-02-10T12:00:00Z',
    created_at: '2024-02-10T12:00:00Z',
    updated_at: '2024-02-10T12:00:00Z',
    view_count: 530,
    read_time_minutes: 6,
  },
  {
    id: 'post-7',
    title: 'Organic Farming in the Souss Valley',
    slug: 'organic-farming-souss-valley',
    excerpt: 'Meet the cooperatives behind our organic herbs and learn how they protect biodiversity.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Regenerative practices' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Crop rotation, composting, and water stewardship in arid climates.' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-2',
    author: mockAuthors[1],
    category_id: 'cat-4',
    category: mockCategories[3],
    tags: ['organic', 'farming', 'sustainability'],
    status: 'published',
    published_at: '2024-02-15T08:00:00Z',
    created_at: '2024-02-15T08:00:00Z',
    updated_at: '2024-02-15T08:00:00Z',
    view_count: 480,
    read_time_minutes: 7,
  },
  {
    id: 'post-8',
    title: 'Infused Oils: Orange Blossom & Verbena',
    slug: 'infused-oils-orange-blossom-verbena',
    excerpt: 'Create calming massage oils with Moroccan botanicals for evening relaxation.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Calm rituals' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Steep dried petals in carrier oils over low heat for 2 hours.' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-1',
    author: mockAuthors[0],
    category_id: 'cat-2',
    category: mockCategories[1],
    tags: ['oils', 'aromatherapy', 'relaxation'],
    status: 'published',
    published_at: '2024-02-20T18:00:00Z',
    created_at: '2024-02-20T18:00:00Z',
    updated_at: '2024-02-20T18:00:00Z',
    view_count: 410,
    read_time_minutes: 5,
  },
  {
    id: 'post-9',
    title: 'Culinary Argan: Elevate Your Kitchen',
    slug: 'culinary-argan-elevate-your-kitchen',
    excerpt: 'How to cook with culinary-grade Argan oil for nutty depth in salads and tajines.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Nutty flavor' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Drizzle on couscous or blend into amlou for breakfast.' }] }
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=800&auto=format&fit=crop',
    author_id: 'author-2',
    author: mockAuthors[1],
    category_id: 'cat-3',
    category: mockCategories[2],
    tags: ['culinary', 'argan oil', 'recipe'],
    status: 'published',
    published_at: '2024-02-25T07:30:00Z',
    created_at: '2024-02-25T07:30:00Z',
    updated_at: '2024-02-25T07:30:00Z',
    view_count: 365,
    read_time_minutes: 4,
  },
  {
    id: 'post-10',
    title: 'Trusted Moroccan Beauty Ingredient Supplier for Global Brands (2026 Guide)',
    slug: 'trusted-moroccan-beauty-ingredient-supplier-2026-guide',
    excerpt: 'Why authenticity, traceability, and certified quality make Moroccan suppliers the go-to partners for global beauty brands.',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Why Morocco Leads in Beauty Ingredients' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'As global demand for natural and organic beauty products rises, brands seek Moroccan partners who guarantee authenticity, quality, and traceability.' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Key ingredients include Argan oil, Nila powder, Aker Fassi, Ghassoul clay, Rose water, and Prickly pear seed oil—each rooted in tradition and sustainable sourcing.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'What Makes a Trusted Supplier' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Certified sourcing, compliance with international cosmetic standards, transparent production, batch control, and export experience define reliable partners.' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Suppliers focused on long-term partnerships build stronger credibility than one-off transactions.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Authenticity & Quality Control' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Direct sourcing from origin regions with responsible methods prevents imitation and dilution, while documentation and testing protect purity and safety.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Why Global Brands Choose Moroccan Suppliers' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Blending cultural know-how with modern manufacturing lets Moroccan suppliers support education, formulation guidance, and transparent supply chains.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'How to Choose the Right Partner' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Evaluate origin documentation, capacity, regulatory compliance, export track record, and industry reputation before signing.' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Brands that prioritize transparency gain an edge as 2026 buyers demand proof over promises.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'About Moroccan Organica' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Moroccan Organica supports private label and wholesale projects with certified quality, responsible sourcing, and documentation for global compliance.' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Learn more at https://moroccanorganica.com (example link) for partnership details.' }] },
      ]
    },
    featured_image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=900&auto=format&fit=crop',
    author_id: 'author-1',
    author: mockAuthors[0],
    category_id: 'cat-4',
    category: mockCategories[3],
    tags: ['sourcing', 'ingredients', 'quality', 'traceability'],
    status: 'published',
    published_at: '2024-03-01T10:00:00Z',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
    view_count: 920,
    read_time_minutes: 8,
  }
];
