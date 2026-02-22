import { getProducts } from "@/actions/product.actions";
import { getCategories } from "@/actions/category.actions";
import { PlacementProductsPageClient } from "@/components/admin/PlacementProductsPageClient";
import { ShopProductDB, CategoryDB } from "@/types/product";

type Params = Promise<{ lang: string }>;

export default async function CatalogueProductsPage({ params }: { params: Params }) {
    await params;

    let products: ShopProductDB[] = [];
    let categories: CategoryDB[] = [];
    let totalProducts = 0;

    try {
        const [productsResult, categoriesResult] = await Promise.all([
            getProducts({ placement: 'catalogue' }),
            getCategories(),
        ]);

        products = productsResult.products;
        totalProducts = productsResult.total;
        categories = categoriesResult;
    } catch (error) {
        console.error('Error fetching catalogue products:', error);
    }

    return (
        <PlacementProductsPageClient
            initialProducts={products}
            categories={categories}
            totalProducts={totalProducts}
            placement="catalogue"
        />
    );
}
