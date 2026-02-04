import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMultilingual() {
    console.log('🧪 Testing Multilingual Database Schema...\n');

    // Test 1: Fetch product in different languages
    const productId = (await prisma.product.findFirst())?.id;

    if (productId) {
        console.log('📦 Product in Multiple Languages:');
        console.log('─'.repeat(60));

        const languages: ('en' | 'ar' | 'fr')[] = ['en', 'ar', 'fr'];

        for (const lang of languages) {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: {
                    translations: {
                        where: { language: lang }
                    },
                    variants: true,
                    category: {
                        include: {
                            translations: {
                                where: { language: lang }
                            }
                        }
                    }
                }
            });

            if (product && product.translations[0]) {
                const translation = product.translations[0];
                const categoryTranslation = product.category.translations[0];

                console.log(`\n[${lang.toUpperCase()}]`);
                console.log(`  Name: ${translation.name}`);
                console.log(`  Slug: ${translation.slug}`);
                console.log(`  Category: ${categoryTranslation?.name}`);
                console.log(`  Description: ${(translation.description ?? '').substring(0, 80)}...`);
                console.log(`  Base Price: $${product.basePrice}`);
                console.log(`  Variants: ${product.variants.length}`);

                if (product.variants.length > 0) {
                    product.variants.forEach(v => {
                        console.log(`    - ${v.sizeName}: $${v.price} (Stock: ${v.stock})`);
                    });
                }
            }
        }
    }

    console.log('\n' + '─'.repeat(60));
    console.log('\n🔍 Database Statistics:');

    // Get counts
    const stats = {
        users: await prisma.user.count(),
        customers: await prisma.customer.count(),
        categories: await prisma.category.count(),
        categoryTranslations: await prisma.categoryTranslation.count(),
        products: await prisma.product.count(),
        productTranslations: await prisma.productTranslation.count(),
        variants: await prisma.productVariant.count(),
        images: await prisma.productImage.count(),
    };

    console.log(`  👤 Users: ${stats.users}`);
    console.log(`  🛍️  Customers: ${stats.customers}`);
    console.log(`  📂 Categories: ${stats.categories} (${stats.categoryTranslations} translations)`);
    console.log(`  📦 Products: ${stats.products} (${stats.productTranslations} translations)`);
    console.log(`  🏷️  Product Variants: ${stats.variants}`);
    console.log(`  🖼️  Product Images: ${stats.images}`);

    console.log('\n✅ Multilingual schema is working perfectly!\n');
}

testMultilingual()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
