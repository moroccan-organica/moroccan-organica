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
