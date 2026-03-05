import { getProducts } from "@/actions/product.actions";
import { getCategories } from "@/actions/category.actions";
import { ProductsPageClient } from "./ProductsPageClient";
import { shopProducts, shopCategories } from "@/data/shop-products";
import { ShopProductDB, CategoryDB } from "@/types/product";

export default async function ProductsPage() {

    // Fetch from database with fallback to static data
    let products: ShopProductDB[] = [];
    let categories: CategoryDB[] = [];
    let totalProducts = 0;

    try {
        const [productsResult, categoriesResult] = await Promise.all([
            getProducts(),
            getCategories(),
        ]);

        products = productsResult.products;
        totalProducts = productsResult.total;
        categories = categoriesResult;
    } catch (error) {
        console.error('Error fetching from database, using static data:', error);
    }

    // Fallback to static data if DB returns nothing
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
            h1: p.name,
            h1Ar: p.nameAr,
            h1Fr: p.name,
            details: '',
            detailsAr: '',
            detailsFr: '',
            notes: p.notes,
            price: p.price,
            stock: p.stockQuantity || 100,
            isAvailable: true,
            isFeatured: p.badge === 'bestseller',
            isTopSale: false,
            placement: 'shop' as const,
            sku: p.id,
            variants: [],
            metaTitle: '',
            metaDesc: '',
            keywords: '',
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

        totalProducts = products.length;
    }

    return (
        <ProductsPageClient
            initialProducts={products}
            categories={categories}
            totalProducts={totalProducts}
        />
    );
}
