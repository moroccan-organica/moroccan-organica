import { PrismaClient, LanguageCode } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to upsert products
async function upsertProduct(productData: {
    sku: string;
    categoryId: string;
    basePrice: number;
    stock: number;
    isAvailable: boolean;
    isFeatured: boolean;
    isTopSale: boolean;
    translations: Array<{
        language: LanguageCode;
        name: string;
        slug: string;
        description?: string;
        metaTitle?: string;
        metaDesc?: string;
        keywords?: string;
        ogImage?: string;
    }>;
    variants: Array<{
        sku: string;
        sizeName: string;
        price: number;
        stock: number;
    }>;
    images: Array<{
        url: string;
        isPrimary: boolean;
    }>;
}) {
    const existingProduct = await prisma.product.findUnique({
        where: { sku: productData.sku },
        include: { translations: true, variants: true, images: true },
    });

    if (existingProduct) {
        // Update existing product
        return await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
                categoryId: productData.categoryId,
            basePrice: productData.basePrice,
            stock: productData.stock,
            isAvailable: productData.isAvailable,
                isFeatured: productData.isFeatured,
                isTopSale: productData.isTopSale,
                translations: {
                    deleteMany: {},
                    create: productData.translations,
                },
                variants: {
                    deleteMany: {},
                    create: productData.variants,
                },
                images: {
                    deleteMany: {},
                    create: productData.images,
                },
            },
            include: {
                translations: true,
                variants: true,
                images: true,
            },
        });
    } else {
        // Create new product
        return await prisma.product.create({
            data: {
                sku: productData.sku,
                categoryId: productData.categoryId,
            basePrice: productData.basePrice,
            stock: productData.stock,
            isAvailable: productData.isAvailable,
                isFeatured: productData.isFeatured,
                isTopSale: productData.isTopSale,
                translations: {
                    create: productData.translations,
                },
                variants: {
                    create: productData.variants,
                },
                images: {
                    create: productData.images,
                },
            },
            include: {
                translations: true,
                variants: true,
                images: true,
            },
        });
    }
}

async function main() {
    console.log('🌱 Starting database seeding...');

    // ==========================================
    // 0. Cleanup Database
    // ==========================================
    console.log('🧹 Cleaning database...');
    // Delete in order of dependency (children first)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();

    await prisma.productImage.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productTranslation.deleteMany();
    // Delete products before categories to avoid FK issues
    await prisma.product.deleteMany();

    await prisma.categoryTranslation.deleteMany();
    await prisma.category.deleteMany();

    await prisma.postTranslation.deleteMany();
    await prisma.post.deleteMany();

    await prisma.staticPageTranslation.deleteMany();
    await prisma.staticPage.deleteMany();

    await prisma.globalSeoTranslation.deleteMany();
    await prisma.globalSeoSetting.deleteMany();

    // Optionally clear customers if not needed, but code upserts specific one.
    // await prisma.customer.deleteMany(); // Keeping existing customer logic or upserting

    console.log('✨ Database cleaned');

    // ==========================================
    // 1. Create Admin User
    // ==========================================
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@moroccan-organica.com' },
        update: {},
        create: {
            email: 'admin@moroccan-organica.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // ==========================================
    // 2. Create Sample Customer
    // ==========================================
    const customer = await prisma.customer.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            phone: '+212612345678',
            firstName: 'Ahmed',
            lastName: 'Benali',
            isWholesale: false,
            marketingOptIn: true,
        },
    });
    console.log('✅ Customer created:', customer.email);

    // Create customer address
    await prisma.address.create({
        data: {
            customerId: customer.id,
            label: 'Home',
            addressLine1: '123 Rue Mohammed V',
            city: 'Casablanca',
            postalCode: '20000',
            country: 'Morocco',
            phone: '+212612345678',
        },
    });
    console.log('✅ Address created for customer');

    // ==========================================
    // 3. Create Categories with Translations
    // ==========================================
    const categories: {
        image: string;
        translations: {
            language: LanguageCode;
            name: string;
            slug: string;
            metaTitle?: string;
            metaDesc?: string;
        }[];
    }[] = [
            {
                image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                translations: [
                    {
                        language: 'en',
                        name: 'Argan Oil',
                        slug: 'argan-oil',
                        metaTitle: 'Pure Moroccan Argan Oil',
                        metaDesc: 'Discover our premium selection of authentic Moroccan argan oil',
                    },
                    {
                        language: 'ar',
                        name: 'زيت الأركان',
                        slug: 'زيت-الأركان',
                        metaTitle: 'زيت الأركان المغربي النقي',
                        metaDesc: 'اكتشف مجموعتنا المتميزة من زيت الأركان المغربي الأصيل',
                    },
                    {
                        language: 'fr',
                        name: 'Huile d\'Argan',
                        slug: 'huile-argan',
                        metaTitle: 'Huile d\'Argan Marocaine Pure',
                        metaDesc: 'Découvrez notre sélection premium d\'huile d\'argan marocaine authentique',
                    },
                ],
            },
            {
                image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                translations: [
                    {
                        language: 'en',
                        name: 'Essential Oils',
                        slug: 'essential-oils',
                        metaTitle: 'Moroccan Essential Oils',
                        metaDesc: 'Organic essential oils from Morocco',
                    },
                    {
                        language: 'ar',
                        name: 'الزيوت الأساسية',
                        slug: 'الزيوت-الأساسية',
                        metaTitle: 'الزيوت الأساسية المغربية',
                        metaDesc: 'زيوت أساسية عضوية من المغرب',
                    },
                    {
                        language: 'fr',
                        name: 'Huiles Essentielles',
                        slug: 'huiles-essentielles',
                        metaTitle: 'Huiles Essentielles Marocaines',
                        metaDesc: 'Huiles essentielles biologiques du Maroc',
                    },
                ],
            },
            {
                image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                translations: [
                    {
                        language: 'en',
                        name: 'Spices',
                        slug: 'spices',
                        metaTitle: 'Authentic Moroccan Spices',
                        metaDesc: 'Traditional Moroccan spices and blends',
                    },
                    {
                        language: 'ar',
                        name: 'التوابل',
                        slug: 'التوابل',
                        metaTitle: 'التوابل المغربية الأصيلة',
                        metaDesc: 'التوابل والخلطات المغربية التقليدية',
                    },
                    {
                        language: 'fr',
                        name: 'Épices',
                        slug: 'epices',
                        metaTitle: 'Épices Marocaines Authentiques',
                        metaDesc: 'Épices et mélanges marocains traditionnels',
                    },
                ],
            },
        ];

    const createdCategories = [];
    for (const categoryData of categories) {
        // Find existing category by English slug
        const enTranslation = categoryData.translations.find(t => t.language === 'en');
        if (!enTranslation) continue;

        const existingCategory = await prisma.category.findFirst({
            where: {
                translations: {
                    some: {
                        language: 'en',
                        slug: enTranslation.slug,
                    },
                },
            },
            include: { translations: true },
        });

        let category;
        if (existingCategory) {
            // Update existing category
            category = await prisma.category.update({
                where: { id: existingCategory.id },
                data: {
                    image: categoryData.image,
                    translations: {
                        deleteMany: {},
                        create: categoryData.translations.map((t) => ({
                            language: t.language as LanguageCode,
                            name: t.name,
                            slug: t.slug,
                    metaTitle: t.metaTitle,
                    metaDesc: t.metaDesc,
                        })),
                    },
                },
                include: {
                    translations: true,
                },
            });
            console.log('✅ Category updated:', category.translations[0].name);
        } else {
            // Create new category
            category = await prisma.category.create({
                data: {
                    image: categoryData.image,
                    translations: {
                        create: categoryData.translations.map((t) => ({
                            language: t.language as LanguageCode,
                            name: t.name,
                            slug: t.slug,
                    metaTitle: t.metaTitle,
                    metaDesc: t.metaDesc,
                        })),
                    },
                },
                include: {
                    translations: true,
                },
            });
            console.log('✅ Category created:', category.translations[0].name);
        }
        createdCategories.push(category);
    }

    // ==========================================
    // 4. Create Products with Translations & Variants (Based on Old Site)
    // ==========================================

    // Product 1: Organic Virgin Argan Oil
    await upsertProduct({
        categoryId: createdCategories[0].id,
        sku: 'ARG-VIRGIN-001',
        basePrice: 35.00,
        stock: 200,
        isAvailable: true,
        isFeatured: true,
        isTopSale: true,
        translations: [
            {
                language: 'en',
                name: 'Organic Virgin Argan Oil',
                        slug: 'moroccan-wholesale-suppliers-of-argan-oil',
                description: 'Buy Organic argan oil 100% pure in bulk, certified direct from Morocco. Cold-pressed from Atlas Mountain kernels. Fights against aging skin, restores vital functions, and protects against dehydration. Rich in Vitamin E and essential fatty acids. Certified CCPB/USDA NOP/ECOCERT.',
                metaTitle: 'Organic Virgin Argan Oil - 100% Pure Certified | Wholesale',
                metaDesc: 'Premium organic argan oil wholesale from Morocco. CCPB/USDA certified. Cold-pressed, rich in Vitamin E. Bulk quantities available.',
                        keywords: 'argan oil, organic argan oil, virgin argan oil, wholesale argan oil, certified argan oil',
                        ogImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
            },
            {
                language: 'ar',
                name: 'زيت الأركان العضوي البكر',
                        slug: 'زيت-الأركان-العضوي-البكر',
                description: 'زيت الأركان العضوي 100% نقي معتمد من المغرب. معصور على البارد من نوى جبال الأطلس. يحارب شيخوخة البشرة ويحمي من الجفاف. غني بفيتامين E.',
                metaTitle: 'زيت الأركان العضوي البكر - 100% نقي معتمد',
                metaDesc: 'زيت الأركان المغربي بالجملة. معتمد CCPB/USDA. معصور على البارد.',
            },
            {
                language: 'fr',
                name: 'Huile d\'Argan Vierge Bio',
                        slug: 'huile-argan-vierge-bio',
                description: 'Huile d\'argan bio 100% pure certifiée du Maroc. Pressée à froid. Lutte contre le vieillissement cutané. Riche en vitamine E. Certifiée CCPB/USDA/ECOCERT.',
                metaTitle: 'Huile d\'Argan Vierge Bio - 100% Pure Certifiée',
                metaDesc: 'Huile d\'argan marocaine en gros. Certifiée CCPB/USDA. Pressée à froid.',
                    },
                ],
        variants: [
            {
                sku: 'ARG-VIRGIN-1L',
                sizeName: '1 Liter',
                price: 35.00,
            stock: 100,
            },
            {
                sku: 'ARG-VIRGIN-5L',
                sizeName: '5 Liters',
                price: 160.00,
            stock: 50,
            },
            {
                sku: 'ARG-VIRGIN-10L',
                sizeName: '10 Liters',
                price: 300.00,
            stock: 30,
            },
        ],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                isPrimary: true,
            },
        ],
    });
    console.log('✅ Product created: Organic Virgin Argan Oil');

    // Product 2: Prickly Pear Seed Oil
    await upsertProduct({
        categoryId: createdCategories[0].id,
        sku: 'PRICKLY-001',
        basePrice: 85.00,
        stock: 50,
        isAvailable: true,
        isFeatured: true,
        isTopSale: true,
        translations: [
            {
                language: 'en',
                name: 'Organic Prickly Pear Seed Oil',
                slug: 'organic-prickly-pear-seed-oil-wholesale',
                description: 'Prickly pear seed oil in bulk - 100% Pure & Certified Organic. Takes almost a ton of prickly pears to get 1 liter. Powerful anti-wrinkle and firming. Rich in Vitamin E, tocopherols. Perfect for anti-aging formulations. Certified Ecocert/USDA NOP.',
                metaTitle: 'Prickly Pear Seed Oil - Organic Wholesale | Anti-Aging',
                metaDesc: 'Premium prickly pear seed oil from Morocco. 100% organic certified. Anti-wrinkle properties. Wholesale bulk quantities.',
                keywords: 'prickly pear oil, cactus seed oil, anti-aging oil, organic beauty oil',
                ogImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
            },
            {
                language: 'ar',
                name: 'زيت بذور التين الشوكي العضوي',
                slug: 'زيت-بذور-التين-الشوكي',
                description: 'زيت بذور التين الشوكي 100% عضوي معتمد. قوي ضد التجاعيد ومشد للبشرة. غني بفيتامين E.',
                metaTitle: 'زيت بذور التين الشوكي العضوي - مضاد للشيخوخة',
                metaDesc: 'زيت التين الشوكي المغربي. عضوي معتمد. خصائص مضادة للتجاعيد.',
            },
            {
                language: 'fr',
                name: 'Huile de Graines de Figue de Barbarie Bio',
                slug: 'huile-graines-figue-barbarie-bio',
                description: 'Huile de graines de figue de barbarie 100% pure et bio certifiée. Anti-rides puissant et raffermissant. Riche en vitamine E.',
                metaTitle: 'Huile de Figue de Barbarie Bio - Anti-Âge',
                metaDesc: 'Huile de figue de barbarie marocaine. Bio certifiée. Propriétés anti-rides.',
            },
        ],
        variants: [
            {
                sku: 'PRICKLY-1L',
                sizeName: '1 Liter',
                price: 850.00,
            stock: 20,
            },
            {
                sku: 'PRICKLY-500ML',
                sizeName: '500ml',
                price: 450.00,
            stock: 30,
            },
        ],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                isPrimary: true,
            },
        ],
    });
    console.log('✅ Product created: Prickly Pear Seed Oil');

    // Product 3: Moroccan Black Soap
    await upsertProduct({
        categoryId: createdCategories[1].id,
        sku: 'BLACKSOAP-001',
        basePrice: 12.00,
        stock: 150,
        isAvailable: true,
        isFeatured: true,
        isTopSale: true,
        translations: [
            {
                language: 'en',
                name: 'Organic Moroccan Black Soap',
                slug: 'moroccan-black-soap-suppliers-wholesale-africa-benefits',
                description: 'Extra Moroccan Black Soap 100% Organic. Traditional hammam beauty secret. Deep cleanses, exfoliates, and purifies skin. Made with olive oil and eucalyptus. Wholesale bulk available.',
                metaTitle: 'Moroccan Black Soap Wholesale - 100% Organic',
                metaDesc: 'Authentic Moroccan black soap. 100% organic. Traditional hammam product. Bulk wholesale from Morocco.',
                keywords: 'moroccan black soap, beldi soap, hammam soap, organic black soap',
            },
            {
                language: 'ar',
                name: 'الصابون البلدي المغربي العضوي',
                slug: 'الصابون-البلدي-المغربي',
                description: 'الصابون البلدي المغربي 100% عضوي. سر الجمال التقليدي للحمام. ينظف ويقشر البشرة.',
                metaTitle: 'الصابون البلدي المغربي - 100% عضوي',
                metaDesc: 'صابون مغربي أصيل. عضوي 100%. منتج حمام تقليدي.',
            },
            {
                language: 'fr',
                name: 'Savon Noir Marocain Bio',
                slug: 'savon-noir-marocain-bio',
                description: 'Savon noir marocain extra 100% bio. Secret de beauté traditionnel du hammam. Nettoie et exfolie en profondeur.',
                metaTitle: 'Savon Noir Marocain Bio - En Gros',
                metaDesc: 'Savon noir marocain authentique. 100% bio. Produit hammam traditionnel.',
            },
        ],
        variants: [
            {
                sku: 'BLACKSOAP-1KG',
                sizeName: '1 Kg',
                price: 12.00,
            stock: 100,
            },
            {
                sku: 'BLACKSOAP-5KG',
                sizeName: '5 Kg',
                price: 55.00,
            stock: 50,
            },
        ],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                isPrimary: true,
            },
        ],
    });
    console.log('✅ Product created: Moroccan Black Soap');

    // Product 4: Damascena Rose Water
    await upsertProduct({
        categoryId: createdCategories[1].id,
        sku: 'ROSEWATER-001',
        basePrice: 18.00,
        stock: 120,
        isAvailable: true,
        isFeatured: true,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Pure Damascena Rose Water',
                        slug: 'wholesale-pure-rosewater-from-morocco-organic-natural',
                description: 'Pure natural organic Damascena rose water. Traditional Moroccan beauty product. Tones, refreshes, and hydrates skin. 100% natural with no additives. Wholesale available.',
                metaTitle: 'Damascena Rose Water - Pure Organic Wholesale',
                metaDesc: 'Pure Moroccan rose water. 100% natural and organic. Traditional beauty product. Bulk wholesale.',
            },
            {
                language: 'ar',
                name: 'ماء الورد الدمشقي النقي',
                        slug: 'ماء-الورد-الدمشقي',
                description: 'ماء الورد الدمشقي الطبيعي العضوي. منتج جمال مغربي تقليدي. ينعش ويرطب البشرة.',
                metaTitle: 'ماء الورد الدمشقي - عضوي نقي',
                metaDesc: 'ماء ورد مغربي نقي. طبيعي وعضوي 100%. منتج جمال تقليدي.',
            },
            {
                language: 'fr',
                name: 'Eau de Rose Damascena Pure',
                        slug: 'eau-rose-damascena-pure',
                description: 'Eau de rose damascena pure naturelle bio. Produit de beauté marocain traditionnel. Tonifie et hydrate la peau.',
                metaTitle: 'Eau de Rose Damascena - Bio Pure',
                metaDesc: 'Eau de rose marocaine pure. 100% naturelle et bio. Produit beauté traditionnel.',
                    },
                ],
        variants: [
            {
                sku: 'ROSEWATER-1L',
                sizeName: '1 Liter',
                price: 18.00,
            stock: 80,
            },
            {
                sku: 'ROSEWATER-10L',
                sizeName: '10 Liters',
                price: 160.00,
            stock: 40,
            },
        ],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                isPrimary: true,
            },
        ],
    });
    console.log('✅ Product created: Damascena Rose Water');

    // Product 5: Ghassoul Lava Clay
    await upsertProduct({
        categoryId: createdCategories[1].id,
        sku: 'GHASSOUL-001',
        basePrice: 8.00,
        stock: 200,
        isAvailable: true,
        isFeatured: true,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Moroccan Ghassoul Lava Clay Powder',
                        slug: 'moroccan-rhassoul-clay-powder-bulk-wholesale-suppliers',
                description: 'Moroccan Rhassoul (Ghassoul) clay powder 100% organic. Natural mineral-rich clay from Atlas Mountains. Deep cleanses, detoxifies, and purifies. Available in brown, green, and red varieties. Bulk wholesale.',
                metaTitle: 'Ghassoul Lava Clay Powder - Wholesale Organic',
                metaDesc: 'Authentic Moroccan ghassoul clay. 100% organic mineral clay. Bulk wholesale from Morocco.',
                        keywords: 'ghassoul clay, rhassoul clay, moroccan clay, lava clay',
            },
            {
                language: 'ar',
                name: 'طين الغسول المغربي البركاني',
                        slug: 'طين-الغسول-المغربي',
                description: 'مسحوق طين الغسول المغربي 100% عضوي. طين طبيعي غني بالمعادن من جبال الأطلس.',
                metaTitle: 'طين الغسول المغربي - عضوي بالجملة',
                metaDesc: 'طين غسول مغربي أصيل. طين معدني عضوي 100%.',
            },
            {
                language: 'fr',
                name: 'Poudre d\'Argile Ghassoul Marocaine',
                        slug: 'argile-ghassoul-marocaine',
                description: 'Poudre d\'argile Rhassoul (Ghassoul) marocaine 100% bio. Argile minérale naturelle des montagnes de l\'Atlas.',
                metaTitle: 'Argile Ghassoul Marocaine - Bio En Gros',
                metaDesc: 'Argile ghassoul marocaine authentique. Argile minérale bio 100%.',
                    },
                ],
        variants: [
            {
                sku: 'GHASSOUL-1KG',
                sizeName: '1 Kg',
                price: 8.00,
            stock: 150,
            },
            {
                sku: 'GHASSOUL-25KG',
                sizeName: '25 Kg',
                price: 180.00,
            stock: 50,
            },
        ],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80',
                isPrimary: true,
            },
        ],
    });
    console.log('✅ Product created: Ghassoul Lava Clay');

    // Product 6: Culinary Argan Oil
    await upsertProduct({
        categoryId: createdCategories[2].id,
        sku: 'ARG-CULINARY-001',
        basePrice: 40.00,
        stock: 100,
        isAvailable: true,
        isFeatured: true,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Organic Culinary Argan Oil',
                        slug: 'culinary-argan-oil-of-morocco',
                description: 'Argan oil for culinary use - the miracle oil from Morocco. Made from roasted argan seeds. Rich in Vitamin E and antioxidants. Perfect for Moroccan recipes, tajines, couscous. CCPB Organic certified. Wholesale bulk available.',
                metaTitle: 'Culinary Argan Oil of Morocco - Organic Certified',
                metaDesc: 'Organic culinary argan oil from Morocco. CCPB certified. Perfect for cooking. Wholesale bulk available.',
                        keywords: 'culinary argan oil, cooking argan oil, edible argan oil, moroccan cooking oil',
            },
            {
                language: 'ar',
                name: 'زيت الأركان الطهوي العضوي',
                        slug: 'زيت-الأركان-الطهوي',
                description: 'زيت الأركان للطبخ - الزيت المعجزة من المغرب. مصنوع من بذور الأركان المحمصة. غني بفيتامين E.',
                metaTitle: 'زيت الأركان الطهوي المغربي - عضوي معتمد',
                metaDesc: 'زيت أركان طهوي عضوي من المغرب. معتمد CCPB. مثالي للطبخ.',
            },
            {
                language: 'fr',
                name: 'Huile d\'Argan Culinaire Bio',
                        slug: 'huile-argan-culinaire-bio',
                description: 'Huile d\'argan culinaire - l\'huile miracle du Maroc. Fabriquée à partir de graines d\'argan torréfiées. Riche en vitamine E.',
                metaTitle: 'Huile d\'Argan Culinaire du Maroc - Bio Certifiée',
                metaDesc: 'Huile d\'argan culinaire bio du Maroc. Certifiée CCPB. Parfaite pour la cuisine.',
                    },
                ],
        variants: [
            {
                        sku: 'ARG-CULINARY-1L',
                        sizeName: '1 Liter',
                        price: 40.00,
                    stock: 60,
                    },
                    {
                        sku: 'ARG-CULINARY-5L',
                        sizeName: '5 Liters',
                        price: 185.00,
                    stock: 40,
                    },
                ],
        images: [
            {
                        url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
                        isPrimary: true,
                    },
                ],
    });
    console.log('✅ Product created: Culinary Argan Oil');

    // Product 7: Rosemary Essential Oil
    await upsertProduct({
        categoryId: createdCategories[1].id,
        sku: 'ESS-ROSEMARY-001',
        basePrice: 25.00,
        stock: 80,
        isAvailable: true,
        isFeatured: false,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Organic Rosemary Essential Oil',
                slug: 'rosemary-essential-oil',
                description: '100% pure and natural Rosemary essential oil from Morocco. Free of pesticides and synthetic fertilizers. Perfect for aromatherapy and hair care. Stimulates circulation and improves focus.',
                metaTitle: 'Rosemary Essential Oil Wholesale - Pure & Natural',
                metaDesc: 'Premium Moroccan Rosemary essential oil. 100% pure and organic certified. Wholesale suppliers.',
            },
            {
                language: 'ar',
                name: 'زيت إكليل الجبل الأساسي العضوي',
                        slug: 'زيت-إكليل-الجبل',
                description: 'زيت إكليل الجبل الأساسي نقي وطبيعي 100% من المغرب. مثالي للعلاج العطري والعناية بالشعر.',
            },
            {
                language: 'fr',
                name: 'Huile Essentielle de Romarin Bio',
                        slug: 'huile-essentielle-romarin',
                description: 'Huile essentielle de romarin 100% pure et naturelle du Maroc. Idéal pour l\'aromathérapie et les soins capillaires.',
                    },
                ],
        variants: [
            {
                        sku: 'ROSEMARY-100ML',
                        sizeName: '100ml',
                        price: 25.00,
                    stock: 50,
                    },
                    {
                        sku: 'ROSEMARY-1L',
                        sizeName: '1 Liter',
                        price: 180.00,
                    stock: 30,
                    },
                ],
        images: [
            {
                        url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80',
                        isPrimary: true,
                    },
                ],
    });
    console.log('✅ Product created: Rosemary Essential Oil');

    // Product 8: Cedarwood Essential Oil
    await upsertProduct({
        categoryId: createdCategories[1].id,
        sku: 'ESS-CEDAR-001',
        basePrice: 22.00,
        stock: 100,
        isAvailable: true,
        isFeatured: false,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Organic Atlas Cedarwood Essential Oil',
                        slug: 'cedarwood-essential-oil',
                description: 'Authentic Atlas Cedarwood oil from the Moroccan mountains. Warm, woody aroma. Excellent for grounding, skin health, and natural pest repellent.',
                metaTitle: 'Atlas Cedarwood Essential Oil - Moroccan Wholesale',
                metaDesc: 'Pure Atlas Cedarwood oil from Morocco. Traditional extraction, organic certified.',
            },
            {
                language: 'ar',
                name: 'زيت خشب الأرز الأطلسي الأساسي',
                        slug: 'زيت-خشب-الأرز',
                description: 'زيت خشب الأرز الأطلسي الأصيل من جبال المغرب. رائحة خشبية دافئة.',
            },
            {
                language: 'fr',
                name: 'Huile Essentielle de Cèdre de l\'Atlas Bio',
                        slug: 'huile-essentielle-cedre',
                description: 'Huile de cèdre de l\'Atlas authentique des montagnes marocaines. Arôme boisé et chaud.',
                    },
                ],
        variants: [
            {
                        sku: 'CEDAR-100ML',
                        sizeName: '100ml',
                        price: 22.00,
                    stock: 60,
                    },
                    {
                        sku: 'CEDAR-1L',
                        sizeName: '1 Liter',
                        price: 150.00,
                    stock: 40,
                    },
                ],
        images: [
            {
                        url: 'https://images.unsplash.com/photo-1611080511005-4202302484a0?w=800&q=80',
                        isPrimary: true,
                    },
                ],
    });
    console.log('✅ Product created: Cedarwood Essential Oil');

    // Product 9: Moroccan Blue Tansy
    await upsertProduct({
        categoryId: createdCategories[1].id,
        sku: 'ESS-BLUETANSY-001',
        basePrice: 95.00,
        stock: 30,
        isAvailable: true,
        isFeatured: true,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Organic Moroccan Blue Tansy Oil',
                        slug: 'moroccan-blue-tansy-essential-oil',
                description: 'Rare and precious Moroccan Blue Tansy oil. Famous for its vibrant blue color and powerful anti-inflammatory properties. Calms troubled skin and provides emotional balance.',
                metaTitle: 'Blue Tansy Essential Oil - Rare Moroccan Wholesale',
                metaDesc: 'Rare Blue Tansy oil from Morocco. Anti-inflammatory, premium quality.',
            },
            {
                language: 'ar',
                name: 'زيت التانسي الأزرق المغربي',
                        slug: 'زيت-التانسي-الأزرق',
                description: 'زيت التانسي الأزرق المغربي النادر والثمين. مشهور بلونه الأزرق النابض بالحياة.',
            },
            {
                language: 'fr',
                name: 'Huile de Tanaisie Bleue du Maroc Bio',
                        slug: 'huile-tanaisie-bleue',
                description: 'Huile de Tanaisie Bleue rare et précieuse. Célèbre pour sa couleur bleue vibrante.',
                    },
                ],
        variants: [
            {
                        sku: 'BLUETANSY-15ML',
                        sizeName: '15ml',
                        price: 95.00,
                    stock: 20,
                    },
                    {
                        sku: 'BLUETANSY-50ML',
                        sizeName: '50ml',
                        price: 280.00,
                    stock: 10,
                    },
                ],
        images: [
            {
                        url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                        isPrimary: true,
                    },
                ],
    });
    console.log('✅ Product created: Moroccan Blue Tansy Oil');

    // ==========================================
    // 5. Create Blog Posts
    // ==========================================
    await prisma.post.create({
        data: {
            published: true,
            authorName: 'Admin User',
            publishedAt: new Date('2025-01-15'),
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'The Benefits of Moroccan Argan Oil',
                        slug: 'benefits-moroccan-argan-oil',
                        content: `Moroccan argan oil has been used for centuries by Berber women for its incredible beauty and health benefits. Known as "liquid gold," this precious oil is extracted from the kernels of the argan tree, which grows exclusively in Morocco.

**Beauty Benefits:**
- Deep moisturization for skin and hair
- Anti-aging properties rich in Vitamin E
- Helps reduce acne and heal skin
- Strengthens hair and adds shine

**Health Benefits:**
- Rich in antioxidants
- Supports heart health
- May help regulate cholesterol
- Anti-inflammatory properties

Discover our premium selection of 100% pure argan oil, cold-pressed and organic.`,
                metaTitle: 'The Amazing Benefits of Moroccan Argan Oil | Moroccan Organica',
                metaDesc: 'Discover the incredible beauty and health benefits of authentic Moroccan argan oil. Learn why it\'s called liquid gold.',
                        ogImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
                    },
                    {
                        language: 'ar',
                        title: 'فوائد زيت الأركان المغربي',
                        slug: 'فوائد-زيت-الأركان-المغربي',
                        content: 'يستخدم زيت الأركان المغربي منذ قرون من قبل النساء البربريات لفوائده الجمالية والصحية المذهلة. يُعرف بـ "الذهب السائل"، ويتم استخراج هذا الزيت الثمين من نوى شجرة الأركان التي تنمو حصرياً في المغرب.',
                metaTitle: 'فوائد زيت الأركان المغربي المذهلة',
                metaDesc: 'اكتشف الفوائد الجمالية والصحية المذهلة لزيت الأركان المغربي الأصيل.',
                    },
                    {
                        language: 'fr',
                        title: 'Les Bienfaits de l\'Huile d\'Argan Marocaine',
                        slug: 'bienfaits-huile-argan-marocaine',
                        content: 'L\'huile d\'argan marocaine est utilisée depuis des siècles par les femmes berbères pour ses incroyables bienfaits beauté et santé. Connue comme "l\'or liquide", cette huile précieuse est extraite des amandons de l\'arganier, qui pousse exclusivement au Maroc.',
                metaTitle: 'Les Bienfaits Incroyables de l\'Huile d\'Argan Marocaine',
                metaDesc: 'Découvrez les incroyables bienfaits beauté et santé de l\'huile d\'argan marocaine authentique.',
                    },
                ],
            },
        },
    });
    console.log('✅ Blog post created: Benefits of Argan Oil');

    await prisma.post.create({
        data: {
            published: true,
            authorName: 'Admin User',
            publishedAt: new Date('2025-01-10'),
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'Traditional Moroccan Spices: A Culinary Journey',
                        slug: 'traditional-moroccan-spices',
                        content: `Moroccan cuisine is renowned worldwide for its rich flavors and aromatic spices. The secret lies in the unique blend of spices that have been used for generations. From the famous Ras el Hanout to saffron, Moroccan spices tell a story of tradition and culture.`,
                metaTitle: 'Traditional Moroccan Spices Guide | Moroccan Organica',
                metaDesc: 'Explore the world of traditional Moroccan spices. Learn about authentic blends and their culinary uses.',
                    },
                    {
                        language: 'ar',
                        title: 'التوابل المغربية التقليدية: رحلة طهوية',
                        slug: 'التوابل-المغربية-التقليدية',
                        content: 'يشتهر المطبخ المغربي في جميع أنحاء العالم بنكهاته الغنية وتوابله العطرية.',
                    },
                    {
                        language: 'fr',
                        title: 'Épices Marocaines Traditionnelles: Un Voyage Culinaire',
                        slug: 'epices-marocaines-traditionnelles',
                        content: 'La cuisine marocaine est réputée dans le monde entier pour ses saveurs riches et ses épices aromatiques.',
                    },
                ],
            },
        },
    });
    console.log('✅ Blog post created: Moroccan Spices');

    // ==========================================
    // 6. Global SEO Settings
    // ==========================================
    // Clear existing settings to ensure clean state
    await prisma.globalSeoSetting.deleteMany({});

    await prisma.globalSeoSetting.create({
        data: {
            ogImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
            twitterHandle: '@moroccanorganica',
            facebookPage: 'https://facebook.com/moroccanorganica',
            translations: {
                create: [
                    {
                        language: 'en',
                        siteName: 'Moroccan Organica',
                        titleSuffix: ' | Premium Wholesale Supplier',
                        defaultMetaDesc: 'Your trusted source for premium organic oils and natural beauty products from Morocco.',
                        defaultKeywords: 'argan oil, wholesale, organic, morocco, supplier',
                    },
                    {
                        language: 'fr',
                        siteName: 'Moroccan Organica',
                        titleSuffix: ' | Fournisseur Grossiste Premium',
                        defaultMetaDesc: 'Votre source de confiance pour des huiles biologiques premium et produits de beauté naturels du Maroc.',
                        defaultKeywords: 'huile d\'argan, gros, bio, maroc, fournisseur',
                    },
                    {
                        language: 'ar',
                        siteName: 'موروكان أورجانيكا',
                        titleSuffix: ' | مورد الجملة الممتاز',
                        defaultMetaDesc: 'مصدرك الموثوق للزيوت العضوية الممتازة ومنتجات التجميل الطبيعية من المغرب.',
                        defaultKeywords: 'زيت الأركان, جملة, عضوي, المغرب, مورد',
                    },
                ],
            },
        },
    });
    console.log('✅ Global SEO settings created');


    // ==========================================
    // 7. Static Pages
    // ==========================================

    const staticPagesData = [
        {
            systemName: 'HOME',
            translations: [
                {
                    language: 'en',
                    slug: '',
                    h1: 'Authentic Moroccan Organic Products Wholesale',
                    metaTitle: 'Moroccan Organica - Premium Wholesale Supplier',
                    description: 'We supply high-quality organic Argan oil, Prickly Pear oil, and more directly from Morocco.'
                },
                {
                    language: 'fr',
                    slug: '',
                    h1: 'Produits Bio Marocains Authentiques en Gros',
                    metaTitle: 'Moroccan Organica - Fournisseur Grossiste Premium',
                    description: 'Nous fournissons de l\'huile d\'Argan bio de haute qualité, de l\'huile de Figue de Barbarie et plus encore directement du Maroc.'
                },
                {
                    language: 'ar',
                    slug: '',
                    h1: 'منتجات عضوية مغربية أصيلة بالجملة',
                    metaTitle: 'موروكان أورجانيكا - مورد جملة ممتاز',
                    description: 'نحن نورد زيت الأركان العضوي عالي الجودة، وزيت التين الشوكي، والمزيد مباشرة من المغرب.'
                }
            ]
        },
        {
            systemName: 'ABOUT_US',
            translations: [
                {
                    language: 'en',
                    h1: 'About Organica Group SARL',
                    slug: 'about-organica-group-sarl',
                    description: `# Wholesale of Organic Cosmetics Products\n\nOrganica Group is a producer and exporter of organic cosmetics products, operating outside and inside of Morocco, for wholesale of 100% pure organic cosmetic products. Using traditional ingredients and natural products for beauty, skincare, and haircare.\n\nOur company provides different Moroccan organic products and services including **private label** for its worldwide customers. We deal with international countries all over the world, in Europe, Asia, America, Australia, and Africa.\n\n## Produced by Cooperatives\n\nOur products are manufactured by cooperatives of the south-west of Morocco, with traditional techniques and ancestral knowledge in this field. All our cosmetics and culinary products are exported directly from cooperatives to our customers all over the world.\n\n## Fair Trade Principles\n\nThe business practices of Organica Group are based on 3 fundamental principles:\n\n1. **Quality**: 100% organic cosmetics\n2. **Ethics**: Fair Trade Practices\n3. **Authenticity**: Guaranteed by a personal relationship with the women of the cooperatives\n\n## Our Mission\n\nTo share the natural wealth of Morocco while supporting local communities and sustainable practices. We work directly with Berber women's cooperatives to ensure authenticity and fair compensation.\n\n## Our Values\n\n- 🌿 100% Organic and Natural Products\n- 🤝 Fair Trade and Ethical Sourcing\n- 👥 Support for Local Artisans and Women's Cooperatives\n- 🌍 Environmental Sustainability\n- ✅ Certified Quality (CCPB, USDA NOP, ECOCERT)\n\nEvery product we offer is carefully selected, authenticated, and sourced from trusted partners across Morocco, particularly from the Atlas Mountains region and traditional cooperatives.`,
                    metaTitle: 'About Organica Group SARL - Wholesale Organic Cosmetics from Morocco',
                    metaDesc: 'Learn about Organica Group SARL, producer and exporter of 100% organic Moroccan cosmetic products. Fair trade, certified quality, direct from cooperatives.',
                    keywords: 'organica group, moroccan cosmetics wholesale, organic beauty products, fair trade morocco, argan oil producer',
                    ogImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
                    canonical: 'https://moroccanorganica.com/about-us',
                },
                {
                    language: 'ar',
                    h1: 'عن مجموعة أورجانيكا',
                    slug: 'من-نحن',
                    description: `# بيع منتجات التجميل العضوية بالجملة\n\nمجموعة أورجانيكا هي منتج ومصدر لمنتجات التجميل العضوية، تعمل داخل وخارج المغرب، لبيع منتجات التجميل العضوية النقية 100% بالجملة. نستخدم المكونات التقليدية والمنتجات الطبيعية للجمال والعناية بالبشرة والشعر.\n\nتقدم شركتنا منتجات مغربية عضوية مختلفة وخدمات تشمل **العلامة التجارية الخاصة** لعملائها في جميع أنحاء العالم. نتعامل مع دول في جميع أنحاء العالم، في أوروبا وآسيا وأمريكا وأستراليا وأفريقيا.\n\n## إنتاج التعاونيات\n\nيتم تصنيع منتجاتنا من قبل تعاونيات جنوب غرب المغرب، بتقنيات تقليدية ومعرفة موروثة في هذا المجال. يتم تصدير جميع منتجاتنا التجميلية والطهوية مباشرة من التعاونيات إلى عملائنا في جميع أنحاء العالم.\n\n## مبادئ التجارة العادلة\n\nتستند الممارسات التجارية لمجموعة أورجانيكا على 3 مبادئ أساسية:\n\n1. **الجودة**: مستحضرات تجميل عضوية 100%\n2. **الأخلاقيات**: ممارسات التجارة العادلة\n3. **الأصالة**: مضمونة من خلال علاقة شخصية مع نساء التعاونيات\n\n## قيمنا\n\n- 🌿 منتجات عضوية وطبيعية 100%\n- 🤝 مصادر أخلاقية وتجارة عادلة\n- 👥 دعم الحرفيين المحليين والتعاونيات النسائية\n- 🌍 الاستدامة البيئية\n- ✅ جودة معتمدة (CCPB، USDA NOP، ECOCERT)`,
                    metaTitle: 'عن مجموعة أورجانيكا - مستحضرات تجميل عضوية بالجملة من المغرب',
                    metaDesc: 'تعرف على مجموعة أورجانيكا، منتج ومصدر منتجات التجميل المغربية العضوية 100%. تجارة عادلة، جودة معتمدة.',
                    keywords: 'مجموعة أورجانيكا، مستحضرات تجميل مغربية، منتجات عضوية، تجارة عادلة',
                },
                {
                    language: 'fr',
                    h1: 'À Propos d\'Organica Group SARL',
                    slug: 'a-propos',
                    description: `# Grossiste de Produits Cosmétiques Biologiques\n\nOrganica Group est un producteur et exportateur de produits cosmétiques biologiques, opérant à l'intérieur et à l'extérieur du Maroc, pour la vente en gros de produits cosmétiques biologiques 100% purs. Utilisant des ingrédients traditionnels et des produits naturels pour la beauté, les soins de la peau et des cheveux.\n\nNotre entreprise fournit différents produits biologiques marocains et services, y compris la **marque privée** pour ses clients du monde entier. Nous traitons avec des pays internationaux partout dans le monde, en Europe, en Asie, en Amérique, en Australie et en Afrique.\n\n## Produit par des Coopératives\n\nNos produits sont fabriqués par des coopératives du sud-ouest du Maroc, avec des techniques traditionnelles et un savoir ancestral dans ce domaine. Tous nos produits cosmétiques et culinaires sont exportés directement des coopératives vers nos clients du monde entier.\n\n## Principes du Commerce Équitable\n\nLes pratiques commerciales d'Organica Group sont basées sur 3 principes fondamentaux :\n\n1. **Qualité** : Cosmétiques biologiques 100%\n2. **Éthique** : Pratiques de Commerce Équitable\n3. **Authenticité** : Garantie par une relation personnelle avec les femmes des coopératives\n\n## Nos Valeurs\n\n- 🌿 Produits 100% Bio et Naturels\n- 🤝 Commerce Équitable et Approvisionnement Éthique\n- 👥 Soutien aux Artisans Locaux et Coopératives Féminines\n- 🌍 Durabilité Environnementale\n- ✅ Qualité Certifiée (CCPB, USDA NOP, ECOCERT)`,
                    metaTitle: 'À Propos d\'Organica Group SARL - Cosmétiques Bio en Gros du Maroc',
                    metaDesc: 'Découvrez Organica Group SARL, producteur et exportateur de produits cosmétiques marocains 100% bio. Commerce équitable, qualité certifiée.',
                    keywords: 'organica group, cosmétiques marocains, produits bio, commerce équitable maroc',
                },
            ]
        },
        {
            systemName: 'CONTACT',
            translations: [
                {
                    language: 'en',
                    h1: 'Contact Us - Get in Touch',
                    slug: 'contact',
                    description: `# Get in Touch\n\nWholesale suppliers of organic cosmetic products | Organica Group\n\n## Contact Information\n\n**Phone:** [+212 648-273228](tel:+212648273228)\n\n**Email:** [inquiry@moroccanorganica.com](mailto:inquiry@moroccanorganica.com)\n\n**Office Address:**\nLot 377 N°3/6 Sidi Ghanem Industrial Zone\n40110 Marrakesh, Morocco\n\n## Business Hours\n\n**Monday - Friday:** 9:00 AM - 6:00 PM (GMT+1)\n**Saturday:** 10:00 AM - 2:00 PM\n**Sunday:** Closed\n\n## Follow Us\n\nStay connected with us on social media:\n\n- Facebook: [@moroccanorganica](https://www.facebook.com/moroccanorganica/)\n- Instagram: [@moroccanorganic](https://www.instagram.com/moroccanorganic/)\n- Twitter: [@morocanorganica](https://twitter.com/morocanorganica)\n- Pinterest: [@moroccano](https://www.pinterest.com/moroccano/)\n- LinkedIn: [Organica Moroccan Organica](https://www.linkedin.com/in/organicamoroccanorganica/)\n\n## Send Us a Message\n\nFor wholesale inquiries, private label services, or any questions about our organic products, please use the contact form or reach out directly via email or phone.\n\nWe respond to all inquiries within 24-48 hours during business days.\n\n### Services Available:\n\n- Wholesale/Bulk Orders\n- Private Label Manufacturing\n- Custom Formulations\n- International Shipping\n- Product Certifications (CCPB, USDA, ECOCERT)\n- Quality Assurance Documentation`,
                    metaTitle: 'Contact Moroccan Organica - Wholesale Organic Products Supplier',
                    metaDesc: 'Contact Organica Group for wholesale organic cosmetic products from Morocco. Phone: +212 648-273228. Email: inquiry@moroccanorganica.com',
                    keywords: 'contact moroccan organica, wholesale inquiry, organic products supplier, marrakesh morocco',
                    ogImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80',
                    canonical: 'https://moroccanorganica.com/contact',
                },
                {
                    language: 'ar',
                    h1: 'اتصل بنا - تواصل معنا',
                    slug: 'اتصل-بنا',
                    description: `# تواصل معنا\n\nموردو منتجات التجميل العضوية بالجملة | مجموعة أورجانيكا\n\n## معلومات الاتصال\n\n**الهاتف:** [+212 648-273228](tel:+212648273228)\n\n**البريد الإلكتروني:** [inquiry@moroccanorganica.com](mailto:inquiry@moroccanorganica.com)\n\n**عنوان المكتب:**\nالقطعة 377 رقم 3/6 المنطقة الصناعية سيدي غانم\n40110 مراكش، المغرب\n\n## ساعات العمل\n\n**الإثنين - الجمعة:** 9:00 صباحاً - 6:00 مساءً (GMT+1)\n**السبت:** 10:00 صباحاً - 2:00 مساءً\n**الأحد:** مغلق\n\n## تابعنا\n\n### الخدمات المتاحة:\n\n- طلبات الجملة/الكميات الكبيرة\n- تصنيع العلامات التجارية الخاصة\n- تركيبات مخصصة\n- الشحن الدولي\n- شهادات المنتجات (CCPB، USDA، ECOCERT)`,
                    metaTitle: 'اتصل بـمغربية أورجانيكا - مورد منتجات عضوية بالجملة',
                    metaDesc: 'اتصل بمجموعة أورجانيكا لمنتجات التجميل العضوية بالجملة من المغرب. هاتف: +212 648-273228',
                    keywords: 'اتصل مغربية أورجانيكا، استفسار جملة، مورد منتجات عضوية، مراكش',
                },
                {
                    language: 'fr',
                    h1: 'Contactez-Nous - Prenez Contact',
                    slug: 'contact',
                    description: `# Prenez Contact\n\nFournisseurs en gros de produits cosmétiques biologiques | Organica Group\n\n## Informations de Contact\n\n**Téléphone:** [+212 648-273228](tel:+212648273228)\n\n**Email:** [inquiry@moroccanorganica.com](mailto:inquiry@moroccanorganica.com)\n\n**Adresse du Bureau:**\nLot 377 N°3/6 Zone Industrielle Sidi Ghanem\n40110 Marrakech, Maroc\n\n## Heures d'Ouverture\n\n**Lundi - Vendredi:** 9h00 - 18h00 (GMT+1)\n**Samedi:** 10h00 - 14h00\n**Dimanche:** Fermé\n\n## Suivez-Nous\n\n### Services Disponibles:\n\n- Commandes en Gros/Bulk\n- Fabrication de Marque Privée\n- Formulations Personnalisées\n- Expédition Internationale\n- Certifications de Produits (CCPB, USDA, ECOCERT)`,
                    metaTitle: 'Contactez Moroccan Organica - Fournisseur de Produits Bio en Gros',
                    metaDesc: 'Contactez Organica Group pour des produits cosmétiques bio en gros du Maroc. Tél: +212 648-273228',
                    keywords: 'contact moroccan organica, demande grossiste, fournisseur bio, marrakech',
                },
            ]
        },
        {
            systemName: 'PRIVACY_POLICY',
            translations: [
                {
                    language: 'en',
                    h1: 'Privacy Policy',
                    slug: 'privacy-policy',
                    description: `# Privacy Policy\n\n**Last Updated:** January 2026\n\nAt Moroccan Organica (Organica Group SARL), we respect your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and safeguard your data.\n\n## Information We Collect\n\nWe collect information that you provide directly to us when you:\n\n- Request a quote or make an inquiry\n- Place an order for wholesale products\n- Subscribe to our newsletter\n- Create an account on our website\n- Contact us via email, phone, or contact form\n\n### Types of Information:\n\n- **Personal Information**: Name, email address, phone number\n- **Business Information**: Company name, tax ID (ICE), business address\n- **Shipping Information**: Delivery addresses and contact details\n- **Order Information**: Product selections, quantities, order history\n- **Communication Preferences**: Marketing opt-in/opt-out preferences\n\n## How We Use Your Information\n\nWe use the collected information to:\n\n1. **Process and Fulfill Orders**: Handle your wholesale orders and shipments\n2. **Communication**: Send order confirmations, shipping updates, and respond to inquiries\n3. **Customer Service**: Provide support and address your concerns\n4. **Business Relationships**: Maintain B2B relationships with wholesale clients\n5. **Improve Services**: Enhance our products, services, and website experience\n6. **Marketing**: Send promotional communications (only with your consent)\n7. **Legal Compliance**: Meet regulatory requirements and legal obligations\n\n## Data Security\n\nWe implement industry-standard security measures to protect your personal information:\n\n- Secure SSL encryption for data transmission\n- Restricted access to personal information\n- Regular security audits and updates\n- Secure storage systems\n- Employee training on data protection\n\n## Data Sharing\n\nWe do not sell your personal information to third parties. We may share your information only with:\n\n- **Shipping Partners**: To deliver your orders\n- **Payment Processors**: To process transactions securely\n- **Business Partners**: For legitimate business purposes (with your consent)\n- **Legal Authorities**: When required by law\n\n## Your Rights\n\nYou have the right to:\n\n- Access your personal data\n- Correct inaccurate information\n- Request deletion of your data\n- Opt-out of marketing communications\n- Withdraw consent at any time\n\n## Contact Us\n\n**Email:** inquiry@moroccanorganica.com\n**Phone:** +212 648-273228`,
                    metaTitle: 'Privacy Policy - Moroccan Organica',
                    metaDesc: 'Read our privacy policy to learn how Moroccan Organica collects, uses, and protects your personal information. GDPR compliant.',
                    keywords: 'privacy policy, data protection, gdpr, moroccan organica privacy',
                    canonical: 'https://moroccanorganica.com/privacy-policy',
                },
                {
                    language: 'ar',
                    h1: 'سياسة الخصوصية',
                    slug: 'سياسة-الخصوصية',
                    description: `# سياسة الخصوصية\n\n**آخر تحديث:** يناير 2026\n\nفي Moroccan Organica (مجموعة أورجانيكا)، نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية.\n\n## المعلومات التي نجمعها\n\nنجمع المعلومات التي تقدمها لنا مباشرة.\n\n## كيف نستخدم معلوماتك\n\nنستخدم المعلومات لمعالجة الطلبات وتحسين خدماتنا.\n\n## حقوقك\n\nلديك الحق في الوصول إلى بياناتك وتصحيحها.\n\n## اتصل بنا\n\nالبريد الإلكتروني: inquiry@moroccanorganica.com`,
                    metaTitle: 'سياسة الخصوصية - مغربية أورجانيكا',
                    metaDesc: 'اقرأ سياسة الخصوصية الخاصة بنا لمعرفة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.',
                },
                {
                    language: 'fr',
                    h1: 'Politique de Confidentialité',
                    slug: 'politique-confidentialite',
                    description: `# Politique de Confidentialité\n\n**Dernière mise à jour:** Janvier 2026\n\nChez Moroccan Organica (Organica Group SARL), nous respectons votre vie privée et nous nous engageons à protéger vos informations personnelles.\n\n## Informations que Nous Collectons\n\nNous collectons les informations que vous nous fournissez directement.\n\n## Comment Nous Utilisons Vos Informations\n\nNous utilisons les informations pour traiter les commandes et améliorer nos services.\n\n## Vos Droits\n\nVous avez le droit d'accéder à vos données et de les corriger.\n\n## Contactez-Nous\n\nEmail: inquiry@moroccanorganica.com`,
                    metaTitle: 'Politique de Confidentialité - Moroccan Organica',
                    metaDesc: 'Lisez notre politique de confidentialité pour savoir comment nous collectons, utilisons et protégeons vos informations personnelles.',
                },
            ]
        },
        {
            systemName: 'DELIVERY_INFO',
            translations: [
                {
                    language: 'en',
                    h1: 'Delivery Information',
                    slug: 'delivery-Information',
                    description: `# Delivery Information\n\n## General Information\nAll orders are subject to product availability. If an item is not in stock at the time you place your order, we will notify you and refund the total amount of your order.\n\n## Delivery Time\nAn estimated delivery time will be provided to you once you place your order. Delivery times are estimates and commence from the date of shipping.\n\n## Shipping Costs\nShipping costs are based on the weight of your order and the delivery method.`,
                    metaTitle: 'Delivery Information - Moroccan Organica',
                    metaDesc: 'Worldwide delivery information for Moroccan Organica wholesale products. Shipping times and costs.',
                },
                {
                    language: 'ar',
                    h1: 'معلومات التوصيل',
                    slug: 'معلومات-التوصيل',
                    description: `# معلومات التوصيل\n\n## معلومات عامة\nتخضع جميع الطلبات لتوفر المنتج.\n\n## الشحن الدولي\nنحن نشحن في جميع أنحاء العالم.`,
                },
                {
                    language: 'fr',
                    h1: 'Informations de Livraison',
                    slug: 'informations-livraison',
                    description: `# Informations de Livraison\n\n## Informations Générales\nToutes les commandes sont sujettes à la disponibilité des produits.`,
                },
            ]
        },
        {
            systemName: 'TERMS_CONDITIONS',
            translations: [
                {
                    language: 'en',
                    h1: 'Terms & Conditions',
                    slug: 'terms-conditions',
                    description: `# Terms & Conditions

**Last Updated:** February 2026

## Statement of Rights and Responsibilities
This Statement of Rights and Responsibilities ("Statement," "Terms," or "SRR") derives from Moroccan Organica, and is our terms of service that governs our relationship with users and others who interact with moroccanorganica.com.

## Copyright
All content included on this website, such as text, graphics, logos, images, digital downloads, and data compilations, is the property of Organica Group SARL protected by international copyright laws.

## License and Site Access
Organica Group SARL grants you a limited license to access and make personal use of this site. This license does not include any resale or commercial use of this site or its contents without express written consent.

## Applicable Law
By visiting moroccanorganica.com, you agree that the laws of Morocco will govern these Conditions of Use.`,
                    metaTitle: 'Terms & Conditions - Moroccan Organica',
                    metaDesc: 'Terms and conditions for using the Moroccan Organica website and purchasing wholesale products.',
                },
                {
                    language: 'ar',
                    h1: 'الشروط والأحكام',
                    slug: 'الشروط-والأحكام',
                    description: `# الشروط والأحكام
تخضع هذه الشروط لقوانين المملكة المغربية.`,
                },
                {
                    language: 'fr',
                    h1: 'Termes et Conditions',
                    slug: 'termes-et-conditions',
                    description: `# Termes et Conditions
Ces conditions sont régies par les lois du Maroc.`,
                }
            ]
        },
        {
            systemName: 'PRIVATE_LABEL',
            translations: [
                {
                    language: 'en',
                    h1: 'Private Label & White Label Services',
                    slug: 'argan-oil-private-label-manufacturer',
                    description: `# Private Labeling Services

Organica Group is the ideal manufacturing partner for Private Label. With a wide range of organic skincare product categories, we are very flexible, supplying you with the highest level products at the best price.

## Add Your Own Brand to Your Product

Organica Group has the ability to provide our customers with unique packaging that can be customized for your brand. We have partnered with many specialized factories around the world that design and manufacture packaging for all product types.

## Our Private Label Solutions

We can provide a significant selection of pre-set products, sizes, and packaging types, but also entirely unique products customized for sale by your business only.

### Design Services
You can either provide your own design (we will provide measurements), or we can offer professional design services (additional surcharge applies).

### Minimum Order Quantities (MOQ)
- **Tubes (T5)**: 2,500 units
- **Boxes**: 1,000 units
- **Custom Labels & Stickers**: Only 100 units minimum

### Product Labeling
Customs regulations require all cosmetic products to be labeled. We provide labels in **English, Arabic, French** or other languages containing essential product information at no further surcharge.

## Why Choose Us?
- 🌿 100% Organic certified ingredients
- 🤝 Flexibility for small and large businesses
- 🌍 Worldwide shipping and logistics support
- ✅ Full documentation (COA, MSDS, Organic Certificates)`,
                    metaTitle: 'Private Label Moroccan Organic Cosmetics - White Label Manufacturing',
                    metaDesc: 'Looking for private label argan oil or cosmetics? Organica Group offers custom branding, unique packaging, and organic certified products from Morocco.',
                    keywords: 'private label argan oil, white label cosmetics morocco, custom branding beauty products, organic cosmetics manufacturer',
                },
                {
                    language: 'ar',
                    h1: 'خدمات العلامة التجارية الخاصة',
                    slug: 'العلامة-التجارية-الخاصة',
                    description: `# خدمات العلامة التجارية الخاصة

تعد مجموعة أورجانيكا الشريك المثالي للتصنيع بالعلامة التجارية الخاصة. مع مجموعة واسعة من فئات منتجات العناية بالبشرة العضوية، نحن مرنون للغاية في تزويدك بمنتجات عالية المستوى بأفضل الأسعار.

## أضف علامتك التجارية الخاصة إلى منتجك

تمتلك مجموعة أورجانيكا القدرة على تزويد عملائنا بتغليف فريد يمكن تخصيصه لعلامتكم التجارية.

### الحد الأدنى لكمية الطلب (MOQ)
- **الأنابيب (T5)**: 2500 وحدة
- **الصناديق**: 1000 وحدة
- **الملصقات المخصصة**: ابتداءً من 100 ملصق فقط

### لغات الملصقات
نحن نوفر ملصقات باللغات **الإنجليزية والعربية والفرنسية** دون أي رسوم إضافية.`,
                },
                {
                    language: 'fr',
                    h1: 'Services de Marque Privée',
                    slug: 'marque-privee',
                    description: `# Services de Marque Privée (Private Label)

Organica Group est le partenaire de fabrication idéal pour la Marque Privée. Avec une large gamme de catégories de produits cosmétiques bio, nous sommes très flexibles.

## Ajoutez Votre Propre Marque

Nous offrons à nos clients des emballages uniques personnalisables. Nous collaborons avec des usines spécialisées dans la conception d'emballages.

### Quantités Minimales de Commande (MOQ)
- **Tubes (T5)** : 2 500 unités
- **Boîtes** : 1 000 unités
- **Étiquettes Personnalisées** : Minimum 100 unités seulement

### Langues d'Étiquetage
Nous fournissons des étiquettes en **anglais, arabe, français** ou autres langues sans supplément de prix.`,
                }
            ]
        }
    ];

    for (const pageData of staticPagesData) {
        await prisma.staticPage.upsert({
            where: { systemName: pageData.systemName },
            update: {
                translations: {
                    deleteMany: {},
                    create: pageData.translations.map((t: any) => ({
                        language: t.language as LanguageCode,
                        slug: t.slug,
                        h1: t.h1,
                        description: t.description,
                        metaTitle: t.metaTitle,
                        metaDesc: t.metaDesc,
                        keywords: t.keywords,
                        ogImage: t.ogImage,
                        canonical: t.canonical
                    }))
                }
            },
            create: {
                systemName: pageData.systemName,
                translations: {
                    create: pageData.translations.map((t: any) => ({
                        language: t.language as LanguageCode,
                        slug: t.slug,
                        h1: t.h1,
                        description: t.description,
                        metaTitle: t.metaTitle,
                        metaDesc: t.metaDesc,
                        keywords: t.keywords,
                        ogImage: t.ogImage,
                        canonical: t.canonical
                    }))
                }
            }
        });
        console.log(`✅ Static page upserted: ${pageData.systemName}`);
    }

    console.log('');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Admin users: 1`);
    console.log(`   - Customers: 1`);
    console.log(`   - Categories: ${createdCategories.length} (with multilingual translations)`);
    console.log(`   - Products: 9 (based on old site, with variants and translations)`);
    console.log(`   - Blog posts: 2 (multilingual)`);
    console.log(`   - Static pages: ${staticPagesData.length} (Home, About, Contact, Privacy, Delivery, Terms, Private Label)`);
    console.log(`   - Total variants: 19`);
    console.log('');
    console.log('🔑 Admin Login:');
    console.log('   Email: admin@moroccan-organica.com');
    // Removed duplicate Global SEO and Static Page creation
    console.log('🌱 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during database seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
