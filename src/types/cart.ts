export interface CartProduct {
    id: string;
    slug: string;
    category: string;
    image: string;
    gallery?: string[];
    badge?: string;
    volume: string;
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    notes?: string[];
    price: number;
    sizeName?: string;
    stock?: number;
}

export interface CartItem {
    product: CartProduct;
    quantity: number;
}
