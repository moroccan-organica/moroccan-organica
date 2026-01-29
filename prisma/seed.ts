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
            {
                image: 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80',
                translations: [
                    {
                        language: 'en',
                        name: 'Powders & Herbs',
                        slug: 'powders-herbs',
                        metaTitle: 'Moroccan Organic Powders & Herbs',
                        metaDesc: 'Authentic Moroccan beauty powders including Nila, Aker Fassi, and Sidr.',
                    },
                    {
                        language: 'ar',
                        name: 'البودرة والأعشاب',
                        slug: 'بودرة-وأعشاب',
                        metaTitle: 'بودرة وأعشاب مغربية عضوية',
                        metaDesc: 'مساحيق التجميل المغربية الأصيلة بما في ذلك النيلة والعكر الفاسي والسدر.',
                    },
                    {
                        language: 'fr',
                        name: 'Poudres & Herbes',
                        slug: 'poudres-herbes',
                        metaTitle: 'Poudres et Herbes Bio du Maroc',
                        metaDesc: 'Poudres de beauté marocaines authentiques : Nila, Aker Fassi, Sidr.',
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

    // Product 10: Aker Fassi Powder
    await upsertProduct({
        categoryId: createdCategories[3].id, // Powders & Herbs
        sku: 'POWDER-AKER-001',
        basePrice: 15.00,
        stock: 200,
        isAvailable: true,
        isFeatured: true,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Organic Aker Fassi Powder',
                slug: 'aker-fassi-powder-benefits',
                description: '100% natural Moroccan Aker Fassi powder, made from dried poppy petals and pomegranate bark. Known for its brightening and antioxidant properties. Traditional Moroccan blush and lip stain.',
                metaTitle: 'Organic Aker Fassi Powder - Moroccan Beauty Secret',
                metaDesc: 'Pure Aker Fassi powder from Morocco. Natural brightening and antioxidant. Traditional beauty product.',
            },
            {
                language: 'ar',
                name: 'مسحوق العكر الفاسي العضوي',
                slug: 'عكر-فاسي',
                description: 'بودرة العكر الفاسي هي من أسرار الجمال المغربي التقليدي. تُستخدم لتفتيح البشرة، إزالة التصبغات، ومنح الوجه إشراقة طبيعية.',
            },
            {
                language: 'fr',
                name: 'Poudre Aker Fassi Bio',
                slug: 'poudre-aker-fassi',
                description: 'Poudre d\'Aker Fassi 100% naturelle. Secret de beauté traditionnel marocain pour l\'éclat du teint et des lèvres.',
            },
        ],
        variants: [
            { sku: 'AKER-50G', sizeName: '50g', price: 15.00, stock: 100 },
            { sku: 'AKER-100G', sizeName: '100g', price: 28.00, stock: 100 },
        ],
        images: [{ url: 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', isPrimary: true }],
    });
    console.log('✅ Product created: Aker Fassi Powder');

    // Product 11: Nila (Indigo) Powder
    await upsertProduct({
        categoryId: createdCategories[3].id, // Powders & Herbs
        sku: 'POWDER-NILA-001',
        basePrice: 18.00,
        stock: 150,
        isAvailable: true,
        isFeatured: true,
        isTopSale: true,
        translations: [
            {
                language: 'en',
                name: 'Organic Moroccan Nila Powder',
                slug: 'moroccan-indigo-powder-benefits',
                description: 'Authentic Moroccan Nila (Indigo) powder. Famous for its skin-lightening and purifying properties. Traditionally used by Sahrawi women for glowing, even skin tone.',
                metaTitle: 'Moroccan Nila Powder - Natural Skin Whitening',
                metaDesc: 'Discover the power of Moroccan Nila powder. Natural skin lightening and purification. Authentic Sahrawi beauty secret.',
            },
            {
                language: 'ar',
                name: 'مسحوق النيلة الزرقاء المغربية',
                slug: 'نيلة-زرقاء',
                description: 'مسحوق النيلة المغربية طبيعي 100% ومثالي للبشرة. يساعد على تفتيح البشرة وإزالة التصبغات وتنقية الوجه.',
            },
            {
                language: 'fr',
                name: 'Poudre de Nila Bleue du Maroc',
                slug: 'poudre-nila-bleue',
                description: 'Poudre de Nila bleue authentique du Maroc. Reconnue pour ses propriétés éclaircissantes et purifiantes pour la peau.',
            },
        ],
        variants: [
            { sku: 'NILA-100G', sizeName: '100g', price: 18.00, stock: 80 },
            { sku: 'NILA-250G', sizeName: '250g', price: 40.00, stock: 70 },
        ],
        images: [{ url: 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', isPrimary: true }],
    });
    console.log('✅ Product created: Nila Powder');

    // Product 12: Sidr Powder
    await upsertProduct({
        categoryId: createdCategories[3].id, // Powders & Herbs
        sku: 'POWDER-SIDR-001',
        basePrice: 10.00,
        stock: 180,
        isAvailable: true,
        isFeatured: false,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Organic Moroccan Sidr Powder',
                slug: 'sidr-powder-benefits',
                description: '100% pure Sidr (Lote tree) powder from Morocco. Excellent for hair growth, treating scalp issues, and deep cleansing skin. A natural alternative to shampoo.',
                metaTitle: 'Sidr Powder Morocco - Hair & Skin Care',
                metaDesc: 'Pure Sidr powder for healthy hair and skin. Natural shampoo alternative. Moroccan organic quality.',
            },
            {
                language: 'ar',
                name: 'مسحوق السدر المغربي العضوي',
                slug: 'سدر-مغربي',
                description: 'مسحوق السدر المغربي الطبيعي 100%. يساعد على تنظيف المسام، تعزيز نمو الشعر، ومنحه اللمعان والحيوية.',
            },
            {
                language: 'fr',
                name: 'Poudre de Sidr Bio du Maroc',
                slug: 'poudre-sidr-bio',
                description: 'Poudre de Sidr pure du Maroc. Idéale pour la croissance des cheveux et le soin du cuir chevelu.',
            },
        ],
        variants: [
            { sku: 'SIDR-250G', sizeName: '250g', price: 10.00, stock: 100 },
            { sku: 'SIDR-1KG', sizeName: '1kg', price: 35.00, stock: 80 },
        ],
        images: [{ url: 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', isPrimary: true }],
    });
    console.log('✅ Product created: Sidr Powder');

    // Product 13: Tabrima Powder
    await upsertProduct({
        categoryId: createdCategories[3].id, // Powders & Herbs
        sku: 'POWDER-TABRIMA-001',
        basePrice: 20.00,
        stock: 120,
        isAvailable: true,
        isFeatured: false,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Organic Moroccan Tabrima Powder',
                slug: 'tabrima-powder-benefits',
                description: 'Traditional Moroccan Tabrima is a mixture of several Moroccan herbs and powders. Used in the hammam for skin whitening, unification of skin tone, and deep exfoliation.',
                metaTitle: 'Moroccan Tabrima Powder - Traditional Hammam Herb Blend',
                metaDesc: 'Authentic Moroccan Tabrima herb blend. Traditional hammam treatment for skin whitening and unification.',
            },
            {
                language: 'ar',
                name: 'مسحوق التبريمة المغربية الصحراوية',
                slug: 'تبريمة-مغربية',
                description: 'مزيج التبريمة المغربية التقليدي من الأعشاب. يستخدم في الحمام لتفتيح البشرة وتوحيد لونها.',
            },
            {
                language: 'fr',
                name: 'Poudre de Tabrima Marocaine Traditionnelle',
                slug: 'poudre-tabrima',
                description: 'Mélange traditionnel d\'herbes marocaines pour le hammam. Idéal pour l\'unification du teint et l\'exfoliation.',
            },
        ],
        variants: [
            { sku: 'TABRIMA-200G', sizeName: '200g', price: 20.00, stock: 60 },
            { sku: 'TABRIMA-500G', sizeName: '500g', price: 45.00, stock: 60 },
        ],
        images: [{ url: 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', isPrimary: true }],
    });
    console.log('✅ Product created: Tabrima Powder');

    // Product 14: Clementine Essential Oil (Representative for missing citrus oils)
    await upsertProduct({
        categoryId: createdCategories[1].id, // Essential Oils
        sku: 'ESS-CLEMENTINE-001',
        basePrice: 28.00,
        stock: 60,
        isAvailable: true,
        isFeatured: false,
        isTopSale: false,
        translations: [
            {
                language: 'en',
                name: 'Organic Clementine Essential Oil',
                slug: 'clementine-essential-oil',
                description: '100% pure Moroccan Clementine essential oil. Uplifting, sweet citrus aroma. Rich in antioxidants and perfect for aromatherapy and boosting mood.',
                metaTitle: 'Clementine Essential Oil - Pure Moroccan Wholesale',
                metaDesc: 'Premium Clementine oil from Morocco. Sweet citrus scent, organic certified. Wholesale available.',
            },
            {
                language: 'ar',
                name: 'زيت الكليمنتين الأساسي العضوي',
                slug: 'زيت-الكليمنتين',
                description: 'زيت الكليمنتين الأساسي النقي 100% من المغرب. خيار مثالي للعلاج العطري وتحسين المزاج.',
            },
            {
                language: 'fr',
                name: 'Huile Essentielle de Clémentine Bio',
                slug: 'huile-essentielle-clementine',
                description: 'Huile essentielle de clémentine 100% pure du Maroc. Arôme doux et revitalisant.',
            },
        ],
        variants: [
            { sku: 'CLEM-50ML', sizeName: '50ml', price: 28.00, stock: 30 },
            { sku: 'CLEM-100ML', sizeName: '100ml', price: 50.00, stock: 30 },
        ],
        images: [{ url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80', isPrimary: true }],
    });
    console.log('✅ Product created: Clementine Essential Oil');

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
                        titleSuffix: ' | Argan Oil Wholesale Morocco',
                        defaultMetaDesc: 'Buy Moroccan organic beauty products and cosmetics wholesale. Using natural, 100% pure ingredients and natural, skincare haircare.',
                        defaultKeywords: 'Argan oil, Argan oil benefits for skin, prickly pear oil, argan oil for hair, argan oil for face, pure argan oil, argan oil for skin, argan oil price, 100%pure, bulk, beauty products, argan oil of morocco, beauty products online, beauty, beauty brand, cosmetic',
                    },
                    {
                        language: 'fr',
                        siteName: 'Moroccan Organica',
                        titleSuffix: ' | Vente en Gros Huile d\'Argan',
                        defaultMetaDesc: 'Achetez des produits de beauté bio marocains et des cosmétiques en gros. Ingrédients 100% purs et naturels pour le soin de la peau et des cheveux.',
                        defaultKeywords: 'huile d\'argan, gros, bio, maroc, fournisseur, cosmétiques naturels',
                    },
                    {
                        language: 'ar',
                        siteName: 'موروكان أورجانيكا',
                        titleSuffix: ' | زيت الأرغان المغربي بالجملة',
                        defaultMetaDesc: 'اشترِ شركة مستحضرات التجميل العضوية وزيت الأرغان المغربية بالجملة. باستخدام المكونات التقليدية والمنتجات الطبيعية للعناية بالبشرة والجمال والعناية بالشعر.',
                        defaultKeywords: 'زيت الأرغان ، فوائد زيت الأرغان للبشرة ، زيت التين الشوكي ، زيت الأرغان للشعر ، زيت الأرغان للوجه ، زيت الأرغان النقي ، زيت الأرغان للبشرة ، سعر زيت الأرغان ، منتجات تجميل نقية بنسبة 100٪ ، بكميات كبيرة ، زيت أركان المغربي ، مستحضرات تجميل على الإنترنت ، جمال ، ماركة تجميل ، مستحضرات تجميل ',
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
            systemName: 'BLOG',
            translations: [
                {
                    language: 'en',
                    h1: 'Our Blog',
                    slug: 'blog',
                    metaTitle: 'Our Blog - Organic Beauty Tips & News | Moroccan Organica',
                    metaDesc: 'Stay updated with our blog for organic beauty tips, news about Moroccan argan oil, and benefits of natural skincare.',
                    keywords: 'organic beauty blog, argan oil tips, natural skincare news, morocco beauty trends',
                },
                {
                    language: 'ar',
                    h1: 'مدونتنا',
                    slug: 'المدونة',
                    metaTitle: 'مدونتنا - نصائح وأخبار الجمال العضوي | مغربية أورجانيكا',
                    metaDesc: 'ابق على تواصل مع مدونتنا للحصول على نصائح الجمال العضوي، وأخبار زيت الأركان المغربي، وفوائد العناية الطبيعية بالبشرة.',
                    keywords: 'مدونة الجمال العضوي، نصائح زيت الأركان، أخبار العناية بالبشرة، اتجاهات الجمال في المغرب',
                },
                {
                    language: 'fr',
                    h1: 'Notre Blog',
                    slug: 'blog',
                    metaTitle: 'Notre Blog - Conseils de Beauté Bio & Actualités | Moroccan Organica',
                    metaDesc: 'Restez informé avec notre blog pour des conseils de beauté bio, des actualités sur l\'huile d\'argan marocaine et les bienfaits des soins naturels.',
                    keywords: 'blog beauté bio, conseils huile d\'argan, actualités soins naturels, tendances beauté maroc',
                },
            ]
        },
        {
            systemName: 'SHOP',
            translations: [
                {
                    language: 'en',
                    h1: 'Our Shop',
                    slug: 'shop',
                    metaTitle: 'Shop Moroccan Organica - Premium Organic Cosmetics Wholesale',
                    metaDesc: 'Explore our range of premium organic Moroccan beauty products. Wholesale argan oil, prickly pear oil, black soap, and more.',
                    keywords: 'shop argan oil, wholesale cosmetics morocco, organic beauty products online',
                },
                {
                    language: 'ar',
                    h1: 'متجرنا',
                    slug: 'المتجر',
                    metaTitle: 'متجر مغربية أورجانيكا - مستحضرات تجميل عضوية بالجملة',
                    metaDesc: 'اكتشف مجموعتنا من منتجات التجميل المغربية العضوية الممتازة. زيت الأركان، زيت التين الشوكي، الصابون الأسود والمزيد بالجملة.',
                    keywords: 'متجر زيت أركان، مستحضرات تجميل بالجملة المغرب، منتجات تجميل عضوية',
                },
                {
                    language: 'fr',
                    h1: 'Notre Boutique',
                    slug: 'boutique',
                    metaTitle: 'Boutique Moroccan Organica - Cosmétiques Bio en Gros',
                    metaDesc: 'Découvrez notre gamme de produits de beauté marocains bio de qualité. Huile d\'argan, huile de figue de barbarie, savon noir et plus en gros.',
                    keywords: 'boutique huile d\'argan, cosmétiques en gros maroc, produits de beauté bio en ligne',
                },
            ]
        },
        {
            systemName: 'PRODUCTS',
            translations: [
                {
                    language: 'en',
                    h1: 'Moroccan beauty products wholesale',
                    slug: 'products',
                    metaTitle: 'Moroccan cosmetic wholesale | Moroccan Organica',
                    metaDesc: 'Moroccan beauty cosmetics made with argan oil, ghassoul, and natural ingredients. Shop premium skincare & haircare online.',
                    keywords: 'Argan oil, Argan oil benefits for skin, prickly pear oil, argan oil for hair, argan oil for face, pure argan oil, argan oil for skin, argan oil price, 100%pure, bulk, beauty products, argan oil of morocco, beauty products online, beauty, beauty brand, cosmetic',
                },
                {
                    language: 'ar',
                    h1: 'البيع بالجملة لمستحضرات التجميل المغربية',
                    slug: 'المنتجات',
                    metaTitle: 'زيت الأرغان المغربي الاصلي للشعر | مغربية أورجانيكا',
                    metaDesc: 'اشترِ شركة مستحضرات التجميل العضوية وزيت الأرغان المغربية بالجملة. باستخدام المكونات التقليدية والمنتجات الطبيعية للعناية بالبشرة والجمال والعناية بالشعر.',
                    keywords: 'زيت الأرغان ، فوائد زيت الأرغان للبشرة ، زيت التين الشوكي ، زيت الأرغان للشعر ، زيت الأرغان للوجه ، زيت الأرغان النقي ، زيت الأرغان للبشرة ، سعر زيت الأرغان ، منتجات تجميل نقية بنسبة 100٪ ، بكميات كبيرة ، زيت أركان المغربي ، مستحضرات تجميل على الإنترنت ، جمال ، ماركة تجميل ، مستحضرات تجميل',
                },
                {
                    language: 'fr',
                    h1: 'Cosmétiques marocains en gros',
                    slug: 'produits',
                    metaTitle: 'Vente en gros de cosmétiques marocains | Moroccan Organica',
                    metaDesc: 'Produits de beauté marocains à base d\'huile d\'argan, de ghassoul et d\'ingrédients naturels. Découvrez nos soins premium en ligne.',
                    keywords: 'huile d\'argan, cosmétiques marocains gros, produits de beauté bio, ghassoul, savon noir',
                },
            ]
        },
        {
            systemName: 'HOME',
            translations: [
                {
                    language: 'en',
                    slug: '',
                    h1: 'Moroccan beauty products wholesale',
                    description: 'Trusted Wholesale Suppliers of argan oil and different cosmetics products based on **organic oils** in morocco.',
                    metaTitle: 'Argan oil wholesale company - in Bulk - Morocco',
                    metaDesc: 'Buy Moroccan organic beauty products and cosmetics wholesale. Using natural, 100% pure ingredients and natural, skincare haircare.',
                    keywords: 'Argan oil, Argan oil benefits for skin, prickly pear oil, argan oil for hair, argan oil for face, pure argan oil, argan oil for skin, argan oil price, 100%pure, bulk, beauty products, argan oil of morocco, beauty products online, beauty, beauty brand, cosmetic'
                },
                {
                    language: 'fr',
                    slug: '',
                    h1: 'Vente en gros de produits bio marocains authentiques',
                    description: 'Fournisseurs de gros d\'huile d\'argan et de différents produits cosmétiques basés sur des **huiles biologiques** au Maroc.',
                    metaTitle: 'Moroccan Organica - Fournisseur Premium en Gros',
                    metaDesc: 'Achetez des produits de beauté bio marocains et des cosmétiques en gros. Ingrédients 100% purs et naturels pour le soin de la peau et des cheveux.'
                },
                {
                    language: 'ar',
                    slug: '',
                    h1: 'البيع بالجملة لمنتجات مغربية عضوية أصلية',
                    description: 'موردين الجملة الموثوق بهم لزيت الأرغان ومنتجات التجميل المختلفة القائمة على **الزيوت العضوية** في المغرب.',
                    metaTitle: 'مغربية أورجانيكا - مورد متميز بالجملة',
                    metaDesc: 'اشترِ شركة مستحضرات التجميل العضوية وزيت الأرغان المغربية بالجملة. باستخدام المكونات التقليدية والمنتجات الطبيعية للعناية بالبشرة والجمال والعناية بالشعر.',
                    keywords: 'زيت الأرغان ، فوائد زيت الأرغان للبشرة ، زيت التين الشوكي ، زيت الأرغان للشعر ، زيت الأرغان للوجه ، زيت الأرغان النقي ، زيت الأرغان للبشرة ، سعر زيت الأرغان ، منتجات تجميل نقية بنسبة 100٪ ، بكميات كبيرة ، زيت أركان المغربي ، مستحضرات تجميل على الإنترنت ، جمال ، ماركة تجميل ، مستحضرات تجميل '
                }
            ]
        },
        {
            systemName: 'ABOUT_US',
            translations: [
                {
                    language: 'en',
                    h1: 'Wholesale of organic cosmetics products',
                    slug: 'about-organica-group-sarl',
                    description: 'Our company provides different moroccan organic products, and services including **private label** for its worldwide customers we deals with international countries all over the world, in Europe, Asia, America, Australia and Africa.',
                    metaTitle: 'Wholesale of organic cosmetics beauty products',
                    metaDesc: 'Help re-establish the link between the women Argan oil-cooperatives and Argan oil end customers',
                    keywords: 'Organica Group,Buy organic Oil,About Organica Group,Argan oil-cooperatives',
                    ogImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
                    canonical: 'https://moroccanorganica.com/about-us',
                },
                {
                    language: 'ar',
                    h1: 'منتجات التجميل العضوية بالجملة',
                    slug: 'من-نحن',
                    description: 'تقدم شركتنا منتجات عضوية مغربية مختلفة ، وخدمات بما في ذلك العلامة الخاصة لعملائها في جميع أنحاء العالم ، نتعامل مع دول عالمية في جميع أنحاء العالم ، في أوروبا وآسيا وأمريكا وأستراليا وأفريقيا.',
                    metaTitle: 'بيع منتجات التجميل التجميلية العضوية بالجملة',
                    metaDesc: 'ساعد في إعادة إنشاء الرابط بين تعاونيات زيت أركان النسائية والعملاء النهائيين لزيت أركان',
                    keywords: 'اورجانيكا جروب ، شراء زيت عضوي ، حول اورجانيكا جروب ، زيت الارجان-التعاونيات',
                },
                {
                    language: 'fr',
                    h1: 'Vente en gros de produits cosmétiques biologiques',
                    slug: 'a-propos',
                    description: 'Notre entreprise fournit différents produits biologiques marocains et services, y compris la **marque privée** pour ses clients du monde entier.',
                    metaTitle: 'À propos d\'Organica Group SARL - Grossiste Bio du Maroc',
                    metaDesc: 'Découvrez Organica Group SARL, producteur et exportateur de produits cosmétiques marocains 100% bio. Boutique en gros et marque privée.',
                    keywords: 'organica group, cosmétiques marocains, produits bio, commerce équitable maroc',
                },
            ]
        },

        {
            systemName: 'CONTACT',
            translations: [
                {
                    language: 'en',
                    h1: 'Keep in touch',
                    slug: 'contact',
                    description: 'Wholesale organic cosmetic products suppliers | Organica group',
                    metaTitle: 'Wholesale of organic cosmetic products Organica group',
                    metaDesc: 'Need any help just send a message via our email address',
                    keywords: 'Organica group SARL,contact Organica group',
                    ogImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80',
                    canonical: 'https://moroccanorganica.com/contact',
                },
                {
                    language: 'ar',
                    h1: 'ابقى على تواصل',
                    slug: 'اتصل-بنا',
                    description: 'مورّدو مستحضرات التجميل العضوية بالجملة | مجموعة اورجانيكا',
                    metaTitle: 'Organica بيع منتجات التجميل العضوية مجموعة',
                    metaDesc: 'هل تحتاج إلى أي مساعدة ، فما عليك سوى إرسال رسالة عبر عنوان البريد الإلكتروني الخاص بنا',
                    keywords: 'مجموعة Organica SARL ، اتصل بمجموعة Organica',
                },
                {
                    language: 'fr',
                    h1: 'Contactez-Nous',
                    slug: 'contact',
                    description: 'Fournisseurs en gros de produits cosmétiques biologiques | Organica Group',
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
                    description: 'moroccanorganica.com we,us or the "Company" is committed to guarantee the privacy protection. We understand the importance of keeping personal information private and secure. This policy describes generally how we manage personal information. If you would like more information, please don’t hesitate to contact us. \n\n# Privacy Policy\n\n**Last Updated:** January 2026\n\nAt Moroccan Organica (Organica Group SARL), we respect your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and safeguard your data.\n\n## Information We Collect\n\nWe collect information that you provide directly to us when you:\n\n- Request a quote or make an inquiry\n- Place an order for wholesale products\n- Subscribe to our newsletter\n- Create an account on our website\n- Contact us via email, phone, or contact form\n\n### Types of Information:\n\n- **Personal Information**: Name, email address, phone number\n- **Business Information**: Company name, tax ID (ICE), business address\n- **Shipping Information**: Delivery addresses and contact details\n- **Order Information**: Product selections, quantities, order history\n- **Communication Preferences**: Marketing opt-in/opt-out preferences\n\n## How We Use Your Information\n\nWe use the collected information to:\n\n1. **Process and Fulfill Orders**: Handle your wholesale orders and shipments\n2. **Communication**: Send order confirmations, shipping updates, and respond to inquiries\n3. **Customer Service**: Provide support and address your concerns\n4. **Business Relationships**: Maintain B2B relationships with wholesale clients\n5. **Improve Services**: Enhance our products, services, and website experience\n6. **Marketing**: Send promotional communications (only with your consent)\n7. **Legal Compliance**: Meet regulatory requirements and legal obligations\n\n## Data Security\n\nWe implement industry-standard security measures to protect your personal information:\n\n- Secure SSL encryption for data transmission\n- Restricted access to personal information\n- Regular security audits and updates\n- Secure storage systems\n- Employee training on data protection\n\n## Data Sharing\n\nWe do not sell your personal information to third parties. We may share your information only with:\n\n- **Shipping Partners**: To deliver your orders\n- **Payment Processors**: To process transactions securely\n- **Business Partners**: For legitimate business purposes (with your consent)\n- **Legal Authorities**: When required by law\n\n## Your Rights\n\nYou have the right to:\n\n- Access your personal data\n- Correct inaccurate information\n- Request deletion of your data\n- Opt-out of marketing communications\n- Withdraw consent at any time\n\n## Contact Us\n\n**Email:** inquiry@moroccanorganica.com\n**Phone:** +212 648-273228',
                    metaTitle: 'Organica Group - Privacy policy',
                    metaDesc: 'moroccanorganica.com we,us or the "Company" is committed to guarantee the privacy protection. We understand the importance of keeping personal information private and secure. This policy describes generally how we manage personal information. If you would like more information, please don’t hesitate to contact us.',
                    keywords: 'Organica Group privacy policy,moroccanorganica.com terms',
                    canonical: 'https://moroccanorganica.com/privacy-policy',
                },
                {
                    language: 'ar',
                    h1: 'سياسة الخصوصية',
                    slug: 'سياسة-الخصوصية',
                    description: 'moroccanorganica.com نحن أو "الشركة" ملتزمون بضمان حماية الخصوصية. نحن نتفهم أهمية الحفاظ على خصوصية المعلومات الشخصية وأمانها. تصف هذه السياسة بشكل عام كيفية إدارتنا للمعلومات الشخصية. إذا كنت ترغب في مزيد من المعلومات ، فلا تتردد في الاتصال بنا. \n\n# سياسة الخصوصية\n\n**آخر تحديث:** يناير 2026\n\nفي Moroccan Organica (مجموعة أورجانيكا)، نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية.',
                    metaTitle: 'Organica Group - سياسة الخصوصية',
                    metaDesc: 'moroccanorganica.com نحن أو "الشركة" ملتزمون بضمان حماية الخصوصية. نحن نتفهم أهمية الحفاظ على خصوصية المعلومات الشخصية وأمانها. تصف هذه السياسة بشكل عام كيفية إدارتنا للمعلومات الشخصية. إذا كنت ترغب في مزيد من المعلومات ، فلا تتردد في الاتصال بنا.',
                },
                {
                    language: 'fr',
                    h1: 'Politique de Confidentialité',
                    slug: 'politique-confidentialite',
                    description: 'Chez Moroccan Organica, nous respectons votre vie privée. Découvrez comment nous collectons et protégeons vos données.',
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
                    description: 'Delivery Information terms and conditions for Organica Group SARL . \n\n# Delivery Information\n\n## General Information\nAll orders are subject to product availability. If an item is not in stock at the time you place your order, we will notify you and refund the total amount of your order.\n\n## Delivery Time\nAn estimated delivery time will be provided to you once you place your order. Delivery times are estimates and commence from the date of shipping.\n\n## Shipping Costs\nShipping costs are based on the weight of your order and the delivery method.',
                    metaTitle: 'Organica Group - Delivery Information',
                    metaDesc: 'Delivery Information terms and conditions for Organica Group SARL .',
                    keywords: 'Organica Group SARL Delivery Information,moroccanorganica.com terms',
                },
                {
                    language: 'ar',
                    h1: 'معلومات التوصيل',
                    slug: 'معلومات-التوصيل',
                    description: 'أحكام وشروط معلومات التسليم لشركة Organica Group SARL. \n\n# معلومات التوصيل\n\n## معلومات عامة\nتخضع جميع الطلبات لتوفر المنتج.\n\n## الشحن الدولي\nنحن نشحن في جميع أنحاء العالم.',
                    metaTitle: 'Organica Group - معلومات التسليم',
                    metaDesc: 'أحكام وشروط معلومات التسليم لشركة Organica Group SARL.',
                    keywords: 'معلومات تسليم Organica Group SARL ، شروط moroccanorganica.com',
                },
                {
                    language: 'fr',
                    h1: 'Informations de Livraison',
                    slug: 'informations-livraison',
                    description: 'Toutes les informations sur nos délais et frais de livraison.',
                    metaTitle: 'Informations de Livraison - Moroccan Organica',
                    metaDesc: 'Découvrez nos conditions de livraison pour vos commandes en gros.',
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
                    description: 'Terms & Conditions Organica Group SARL This agreement was written in English. \n\n# Terms & Conditions\n\n**Last Updated:** February 2026\n\n## Statement of Rights and Responsibilities\nThis Statement of Rights and Responsibilities ("Statement," "Terms," or "SRR") derives from Moroccan Organica, and is our terms of service that governs our relationship with users and others who interact with moroccanorganica.com.',
                    metaTitle: 'Organica Group - Terms & Conditions',
                    metaDesc: 'Terms & Conditions Organica Group SARL This agreement was written in English.',
                    keywords: 'Organica Group SARL Terms & Conditions,moroccanorganica.com Terms and Conditions',
                },
                {
                    language: 'ar',
                    h1: 'شروط الاستخدام',
                    slug: 'الشروط-والأحكام',
                    description: 'Terms & Conditions Organica Group SARL تمت كتابة هذه الاتفاقية باللغة الإنجليزية. \n\n# الشروط والأحكام\nتخضع هذه الشروط لقوانين المملكة المغربية.',
                    metaTitle: 'Organica Group - الشروط والأحكام',
                    metaDesc: 'Terms & Conditions Organica Group SARL تمت كتابة هذه الاتفاقية باللغة الإنجليزية.',
                    keywords: 'شروط وأحكام شركة Organica Group SARL ، شروط وأحكام moroccanorganica.com',
                },
                {
                    language: 'fr',
                    h1: 'Termes et Conditions',
                    slug: 'termes-et-conditions',
                    description: 'Nos conditions générales de vente et d\'utilisation.',
                    metaTitle: 'Termes et Conditions - Moroccan Organica',
                    metaDesc: 'Lisez nos conditions générales de vente et d\'utilisation.',
                }
            ]
        },
        {
            systemName: 'PRIVATE_LABEL',
            translations: [
                {
                    language: 'en',
                    h1: 'Private label service for Argan Oil manufacturers',
                    slug: 'argan-oil-private-label-manufacturer',
                    description: 'Organica group is your ideal private label manufacturing partner, with a wide range of organic skin care product categories, we are very flexible, providing you with the highest level of products at the best prices. We can provide a huge variety of pre-defined products, sizes, and packaging types, but also completely unique, custom products for sale through your business alone.',
                    metaTitle: 'Moroccan private label products skincare brands',
                    metaDesc: 'Private labeling is available for all our products, Ready Your Own Brand, Your logo. for moroccan skin care products.',
                    keywords: 'private label products, private label cosmetics, private label wholesale, private label manufacturers, moroccanskinecare, Health, and beauty private label, white label products to sell',
                },
                {
                    language: 'ar',
                    h1: 'خدمة العلامة الخاصة لمصنعي زيت الأرغان',
                    slug: 'العلامة-التجارية-الخاصة',
                    description: 'مجموعة اورجانيكا هي الشريك التصنيعي المثالي للعلامة التجارية الخاصة ، مع مجموعة واسعة من فئات منتجات العناية بالبشرة العضوية ، نحن مرنون للغاية ، ونوفر لك أعلى مستوى من المنتجات بأفضل الأسعار. يمكننا توفير مجموعة كبيرة من المنتجات والأحجام وأنواع التغليف المحددة مسبقًا ، ولكن أيضًا المنتجات الفريدة تمامًا والمخصصة للبيع من خلال عملك فقط.',
                    metaTitle: 'خدمة العلامة الخاصة لمصنعي زيت الأرغان',
                    metaDesc: 'ملصقات جاهزة لجميع المنتجات ، مشهد من صورة رقمية من الصورة الرقمية ، الصورة الخاصة بك ، والملصق الخاص بزيت الأرغان العضوي',
                    keywords: 'ملصقات جاهزة لجميع المنتجات ، مشهد رقمي من الصورة الرقمية ، الصورة الرقمية ، الصورة الأصلية ، الصورة الرمزية الخاصة بزيت الأرغان العضوي',
                },
                {
                    language: 'fr',
                    h1: 'Services de Marque Privée',
                    slug: 'marque-privee',
                    description: 'Votre partenaire idéal pour la fabrication de produits cosmétiques sous votre propre marque.',
                    metaTitle: 'Marque Privée - Moroccan Organica',
                    metaDesc: 'Lancez votre propre marque de cosmétiques bio avec notre service de fabrication sur mesure.',
                }
            ]
        },
        {
            systemName: 'HOW_TO_ORDER',
            translations: [
                {
                    language: 'en',
                    h1: 'How to Order & Payment',
                    slug: 'how-to-order-pay',
                    description: 'Organica group - Paying by Paypal without an account. Simple steps to order your Moroccan organic products wholesale.',
                    metaTitle: 'How to Order Moroccan Products - Payment Options',
                    metaDesc: 'Learn how to order from Moroccan Organica. Payment methods include PayPal, credit card, and bank transfer.',
                    keywords: 'how to order, payment methods, paypal morocco, wholesale ordering',
                },
                {
                    language: 'ar',
                    h1: 'كيفية الطلب والدفع',
                    slug: 'كيفية-الطلب',
                    description: 'مجموعة أورجانيكا - الدفع عن طريق الباي بال بدون حساب. خطوات بسيطة لطلب منتجاتك العضوية المغربية بالجملة.',
                    metaTitle: 'كيفية طلب المنتجات المغربية - خيارات الدفع',
                    metaDesc: 'تعرف على كيفية الطلب من مغربية أورجانيكا. تشمل طرق الدفع PayPal والبطاقة الائتمانية والتحويل البنكي.',
                },
                {
                    language: 'fr',
                    h1: 'Comment Commander & Paiement',
                    slug: 'comment-commander',
                    description: 'Découvrez comment passer commande chez Moroccan Organica et les options de paiement disponibles.',
                }
            ]
        },
        {
            systemName: 'AKER_FASSI_BENEFITS',
            translations: [
                {
                    language: 'en',
                    h1: 'Benefits of Moroccan Aker Fassi Powder',
                    slug: 'aker-fassi-powder-benefits',
                    description: '100% natural Moroccan Aker Fassi powder, ideal for skin and hair. It helps brighten the skin, treat acne, and stimulate hair growth.',
                    metaTitle: 'Benefits of Moroccan Aker Fassi Powder - Natural Glow',
                    metaDesc: 'Discover the amazing benefits of Aker Fassi powder for skin brightening and hair care.',
                },
                {
                    language: 'ar',
                    h1: 'فوائد مسحوق أكر فاسي المغربي',
                    slug: 'فوائد-أكر-فاسي',
                    description: 'مسحوق أكر فاسي المغربي طبيعي 100% ومثالي للبشرة والشعر. يساعد على تفتيح البشرة، علاج حب الشباب، وتحفيز نمو الشعر.',
                },
                {
                    language: 'fr',
                    h1: 'Bienfaits de la Poudre Aker Fassi',
                    slug: 'bienfaits-aker-fassi',
                    description: 'Découvrez les bienfaits de la poudre Aker Fassi pour l\'éclat du teint et le soin des cheveux.',
                }
            ]
        },
        {
            systemName: 'NILA_BENEFITS',
            translations: [
                {
                    language: 'en',
                    h1: 'Moroccan Indigo (Nila) Powder Benefits',
                    slug: 'moroccan-indigo-powder-benefits',
                    description: 'Moroccan Indigo Powder is 100% natural and ideal for skin and hair. It helps lighten the skin, treat acne, and stimulate hair growth.',
                    metaTitle: 'Moroccan Nila Powder Benefits - Skin Lightening',
                    metaDesc: 'Learn about the benefits of Nila powder for skin whitening and treating pigmentation.',
                },
                {
                    language: 'ar',
                    h1: 'فوائد مسحوق النيلة المغربية',
                    slug: 'فوائد-النيلة',
                    description: 'مسحوق النيلة المغربية طبيعي 100% ومثالي للبشرة والشعر. يساعد على تفتيح البشرة، إزالة التصبغات، وتنقية الوجه.',
                },
                {
                    language: 'fr',
                    h1: 'Bienfaits de la Poudre de Nila',
                    slug: 'bienfaits-nila',
                    description: 'Découvrez les propriétés éclaircissantes et purifiantes de la poudre de Nila marocaine.',
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
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: 14 (with variants and translations)`);
    console.log(`   - Blog posts: 2 (multilingual)`);
    console.log(`   - Static pages: ${staticPagesData.length}`);
    console.log('');
    console.log('🔑 Admin Login:');
    console.log('   Email: admin@moroccan-organica.com');
    console.log('🌱 Database seeding session finished!');
}

main()
    .catch((e) => {
        console.error('❌ Error during database seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
