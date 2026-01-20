import { getDictionary } from "@/lib/dictionaries";
import { getProducts } from "@/actions/product.actions";
import { getCategories } from "@/actions/category.actions";
import { ShopPageClient } from "./ShopPageClient";
import { shopProducts, shopCategories } from "@/data/shop-products";
import { ShopProductDB, CategoryDB } from "@/types/product";

type Params = Promise<{ lang: string }>;

export default async function ShopPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang, 'shop');
    
    // Try to fetch from database first, fallback to static data
    let products: ShopProductDB[] = [];
    let categories: CategoryDB[] = [];
    
    try {
        const [productsResult, categoriesResult] = await Promise.all([
            getProducts({ isAvailable: true }),
            getCategories(),
        ]);
        
        products = productsResult.products;
        categories = categoriesResult;
    } catch (error) {
        console.error('Error fetching from database, using static data:', error);
    }
    
    // If no products from DB, use static data as fallback
    if (products.length === 0) {
        products = shopProducts.map(p => ({
            id: p.id,
            slug: p.slug,
            category: p.category,
            categorySlug: p.category.toLowerCase().replace(/\s+/g, '-'),
            image: p.image,
            gallery: p.gallery || [],
            badge: p.badge,
            volume: p.volume,
            name: p.name,
            nameAr: p.nameAr,
            nameFr: p.name,
            description: p.description,
            descriptionAr: p.descriptionAr,
            descriptionFr: p.description,
            notes: p.notes,
            price: p.price,
            stock: p.stockQuantity || 100,
            isAvailable: true,
            isFeatured: p.badge === 'bestseller',
            isTopSale: false,
            sku: p.id,
            variants: [],
        }));
        
        categories = shopCategories.map(c => ({
            id: c.id,
            image: null,
            name: c.name,
            nameAr: c.name,
            nameFr: c.name,
            slug: c.slug,
            slugAr: c.slug,
            slugFr: c.slug,
        }));
    }

    return (
        <ShopPageClient 
            lang={lang}
            initialProducts={products}
            categories={categories}
            dict={dict as Record<string, unknown>}
        />
    );
}
