import { PrismaClient, LanguageCode } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

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
        const category = await prisma.category.create({
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
        createdCategories.push(category);
        console.log('✅ Category created:', category.translations[0].name);
    }

    // ==========================================
    // 4. Create Products with Translations & Variants (Based on Old Site)
    // ==========================================

    // Product 1: Organic Virgin Argan Oil
    await prisma.product.create({
        data: {
            categoryId: createdCategories[0].id,
            sku: 'ARG-VIRGIN-001',
            basePrice: 35.00,
            stock: 200,
            isAvailable: true,
            isFeatured: true,
            isTopSale: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
    });
    console.log('✅ Product created: Organic Virgin Argan Oil');

    // Product 2: Prickly Pear Seed Oil
    await prisma.product.create({
        data: {
            categoryId: createdCategories[0].id,
            sku: 'PRICKLY-001',
            basePrice: 85.00,
            stock: 50,
            isAvailable: true,
            isFeatured: true,
            isTopSale: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
    });
    console.log('✅ Product created: Prickly Pear Seed Oil');

    // Product 3: Moroccan Black Soap
    await prisma.product.create({
        data: {
            categoryId: createdCategories[1].id,
            sku: 'BLACKSOAP-001',
            basePrice: 12.00,
            stock: 150,
            isAvailable: true,
            isFeatured: true,
            isTopSale: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
    });
    console.log('✅ Product created: Moroccan Black Soap');

    // Product 4: Damascena Rose Water
    await prisma.product.create({
        data: {
            categoryId: createdCategories[1].id,
            sku: 'ROSEWATER-001',
            basePrice: 18.00,
            stock: 120,
            isAvailable: true,
            isFeatured: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
    });
    console.log('✅ Product created: Damascena Rose Water');

    // Product 5: Ghassoul Lava Clay
    await prisma.product.create({
        data: {
            categoryId: createdCategories[1].id,
            sku: 'GHASSOUL-001',
            basePrice: 8.00,
            stock: 200,
            isAvailable: true,
            isFeatured: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
    });
    console.log('✅ Product created: Ghassoul Lava Clay');

    // Product 6: Culinary Argan Oil
    await prisma.product.create({
        data: {
            categoryId: createdCategories[2].id,
            sku: 'ARG-CULINARY-001',
            basePrice: 40.00,
            stock: 100,
            isAvailable: true,
            isFeatured: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
    });
    console.log('✅ Product created: Culinary Argan Oil');

    // Product 7: Rosemary Essential Oil
    await prisma.product.create({
        data: {
            categoryId: createdCategories[1].id,
            sku: 'ESS-ROSEMARY-001',
            basePrice: 25.00,
            stock: 80,
            isAvailable: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
    });
    console.log('✅ Product created: Rosemary Essential Oil');

    // Product 8: Cedarwood Essential Oil
    await prisma.product.create({
        data: {
            categoryId: createdCategories[1].id,
            sku: 'ESS-CEDAR-001',
            basePrice: 22.00,
            stock: 100,
            isAvailable: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1611080511005-4202302484a0?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
    });
    console.log('✅ Product created: Cedarwood Essential Oil');

    // Product 9: Moroccan Blue Tansy
    await prisma.product.create({
        data: {
            categoryId: createdCategories[1].id,
            sku: 'ESS-BLUETANSY-001',
            basePrice: 95.00,
            stock: 30,
            isAvailable: true,
            isFeatured: true,
            translations: {
                create: [
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
            },
            variants: {
                create: [
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
            },
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
                        isPrimary: true,
                    },
                ],
            },
        },
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
    // 6. Create Static Pages (Based on Old Site)
    // ==========================================
    await prisma.staticPage.create({
        data: {
            systemName: 'ABOUT_US',
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'About Organica Group SARL',
                        slug: 'about-organica-group-sarl',
                        content: `# Wholesale of Organic Cosmetics Products

Organica Group is a producer and exporter of organic cosmetics products, operating outside and inside of Morocco, for wholesale of 100% pure organic cosmetic products. Using traditional ingredients and natural products for beauty, skincare, and haircare.

Our company provides different Moroccan organic products and services including **private label** for its worldwide customers. We deal with international countries all over the world, in Europe, Asia, America, Australia, and Africa.

## Produced by Cooperatives

Our products are manufactured by cooperatives of the south-west of Morocco, with traditional techniques and ancestral knowledge in this field. All our cosmetics and culinary products are exported directly from cooperatives to our customers all over the world.

## Fair Trade Principles

The business practices of Organica Group are based on 3 fundamental principles:

1. **Quality**: 100% organic cosmetics
2. **Ethics**: Fair Trade Practices
3. **Authenticity**: Guaranteed by a personal relationship with the women of the cooperatives

## Our Mission

To share the natural wealth of Morocco while supporting local communities and sustainable practices. We work directly with Berber women's cooperatives to ensure authenticity and fair compensation.

## Our Values

- 🌿 100% Organic and Natural Products
- 🤝 Fair Trade and Ethical Sourcing
- 👥 Support for Local Artisans and Women's Cooperatives
- 🌍 Environmental Sustainability
- ✅ Certified Quality (CCPB, USDA NOP, ECOCERT)

Every product we offer is carefully selected, authenticated, and sourced from trusted partners across Morocco, particularly from the Atlas Mountains region and traditional cooperatives.`,
                        metaTitle: 'About Organica Group SARL - Wholesale Organic Cosmetics from Morocco',
                        metaDesc: 'Learn about Organica Group SARL, producer and exporter of 100% organic Moroccan cosmetic products. Fair trade, certified quality, direct from cooperatives.',
                        keywords: 'organica group, moroccan cosmetics wholesale, organic beauty products, fair trade morocco, argan oil producer',
                        ogImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
                        canonical: 'https://moroccanorganica.com/about-us',
                    },
                    {
                        language: 'ar',
                        title: 'عن مجموعة أورجانيكا',
                        slug: 'من-نحن',
                        content: `# بيع منتجات التجميل العضوية بالجملة

مجموعة أورجانيكا هي منتج ومصدر لمنتجات التجميل العضوية، تعمل داخل وخارج المغرب، لبيع منتجات التجميل العضوية النقية 100% بالجملة. نستخدم المكونات التقليدية والمنتجات الطبيعية للجمال والعناية بالبشرة والشعر.

تقدم شركتنا منتجات مغربية عضوية مختلفة وخدمات تشمل **العلامة التجارية الخاصة** لعملائها في جميع أنحاء العالم. نتعامل مع دول في جميع أنحاء العالم، في أوروبا وآسيا وأمريكا وأستراليا وأفريقيا.

## إنتاج التعاونيات

يتم تصنيع منتجاتنا من قبل تعاونيات جنوب غرب المغرب، بتقنيات تقليدية ومعرفة موروثة في هذا المجال. يتم تصدير جميع منتجاتنا التجميلية والطهوية مباشرة من التعاونيات إلى عملائنا في جميع أنحاء العالم.

## مبادئ التجارة العادلة

تستند الممارسات التجارية لمجموعة أورجانيكا على 3 مبادئ أساسية:

1. **الجودة**: مستحضرات تجميل عضوية 100%
2. **الأخلاقيات**: ممارسات التجارة العادلة
3. **الأصالة**: مضمونة من خلال علاقة شخصية مع نساء التعاونيات

## قيمنا

- 🌿 منتجات عضوية وطبيعية 100%
- 🤝 مصادر أخلاقية وتجارة عادلة
- 👥 دعم الحرفيين المحليين والتعاونيات النسائية
- 🌍 الاستدامة البيئية
- ✅ جودة معتمدة (CCPB، USDA NOP، ECOCERT)`,
                        metaTitle: 'عن مجموعة أورجانيكا - مستحضرات تجميل عضوية بالجملة من المغرب',
                        metaDesc: 'تعرف على مجموعة أورجانيكا، منتج ومصدر منتجات التجميل المغربية العضوية 100%. تجارة عادلة، جودة معتمدة.',
                        keywords: 'مجموعة أورجانيكا، مستحضرات تجميل مغربية، منتجات عضوية، تجارة عادلة',
                    },
                    {
                        language: 'fr',
                        title: 'À Propos d\'Organica Group SARL',
                        slug: 'a-propos',
                        content: `# Grossiste de Produits Cosmétiques Biologiques

Organica Group est un producteur et exportateur de produits cosmétiques biologiques, opérant à l'intérieur et à l'extérieur du Maroc, pour la vente en gros de produits cosmétiques biologiques 100% purs. Utilisant des ingrédients traditionnels et des produits naturels pour la beauté, les soins de la peau et des cheveux.

Notre entreprise fournit différents produits biologiques marocains et services, y compris la **marque privée** pour ses clients du monde entier. Nous traitons avec des pays internationaux partout dans le monde, en Europe, en Asie, en Amérique, en Australie et en Afrique.

## Produit par des Coopératives

Nos produits sont fabriqués par des coopératives du sud-ouest du Maroc, avec des techniques traditionnelles et un savoir ancestral dans ce domaine. Tous nos produits cosmétiques et culinaires sont exportés directement des coopératives vers nos clients du monde entier.

## Principes du Commerce Équitable

Les pratiques commerciales d'Organica Group sont basées sur 3 principes fondamentaux :

1. **Qualité** : Cosmétiques biologiques 100%
2. **Éthique** : Pratiques de Commerce Équitable
3. **Authenticité** : Garantie par une relation personnelle avec les femmes des coopératives

## Nos Valeurs

- 🌿 Produits 100% Bio et Naturels
- 🤝 Commerce Équitable et Approvisionnement Éthique
- 👥 Soutien aux Artisans Locaux et Coopératives Féminines
- 🌍 Durabilité Environnementale
- ✅ Qualité Certifiée (CCPB, USDA NOP, ECOCERT)`,
                        metaTitle: 'À Propos d\'Organica Group SARL - Cosmétiques Bio en Gros du Maroc',
                        metaDesc: 'Découvrez Organica Group SARL, producteur et exportateur de produits cosmétiques marocains 100% bio. Commerce équitable, qualité certifiée.',
                        keywords: 'organica group, cosmétiques marocains, produits bio, commerce équitable maroc',
                    },
                ],
            },
        },
    });
    console.log('✅ Static page created: About Us');

    await prisma.staticPage.create({
        data: {
            systemName: 'CONTACT',
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'Contact Us - Get in Touch',
                        slug: 'contact',
                        content: `# Get in Touch

Wholesale suppliers of organic cosmetic products | Organica Group

## Contact Information

**Phone:** [+212 648-273228](tel:+212648273228)

**Email:** [inquiry@moroccanorganica.com](mailto:inquiry@moroccanorganica.com)

**Office Address:**
Lot 377 N°3/6 Sidi Ghanem Industrial Zone
40110 Marrakesh, Morocco

## Business Hours

**Monday - Friday:** 9:00 AM - 6:00 PM (GMT+1)
**Saturday:** 10:00 AM - 2:00 PM
**Sunday:** Closed

## Follow Us

Stay connected with us on social media:

- Facebook: [@moroccanorganica](https://www.facebook.com/moroccanorganica/)
- Instagram: [@moroccanorganic](https://www.instagram.com/moroccanorganic/)
- Twitter: [@morocanorganica](https://twitter.com/morocanorganica)
- Pinterest: [@moroccano](https://www.pinterest.com/moroccano/)
- LinkedIn: [Organica Moroccan Organica](https://www.linkedin.com/in/organicamoroccanorganica/)

## Send Us a Message

For wholesale inquiries, private label services, or any questions about our organic products, please use the contact form or reach out directly via email or phone.

We respond to all inquiries within 24-48 hours during business days.

### Services Available:

- Wholesale/Bulk Orders
- Private Label Manufacturing
- Custom Formulations
- International Shipping
- Product Certifications (CCPB, USDA, ECOCERT)
- Quality Assurance Documentation`,
                        metaTitle: 'Contact Moroccan Organica - Wholesale Organic Products Supplier',
                        metaDesc: 'Contact Organica Group for wholesale organic cosmetic products from Morocco. Phone: +212 648-273228. Email: inquiry@moroccanorganica.com',
                        keywords: 'contact moroccan organica, wholesale inquiry, organic products supplier, marrakesh morocco',
                        ogImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80',
                        canonical: 'https://moroccanorganica.com/contact',
                    },
                    {
                        language: 'ar',
                        title: 'اتصل بنا - تواصل معنا',
                        slug: 'اتصل-بنا',
                        content: `# تواصل معنا

موردو منتجات التجميل العضوية بالجملة | مجموعة أورجانيكا

## معلومات الاتصال

**الهاتف:** [+212 648-273228](tel:+212648273228)

**البريد الإلكتروني:** [inquiry@moroccanorganica.com](mailto:inquiry@moroccanorganica.com)

**عنوان المكتب:**
القطعة 377 رقم 3/6 المنطقة الصناعية سيدي غانم
40110 مراكش، المغرب

## ساعات العمل

**الإثنين - الجمعة:** 9:00 صباحاً - 6:00 مساءً (GMT+1)
**السبت:** 10:00 صباحاً - 2:00 مساءً
**الأحد:** مغلق

## تابعنا

ابق على اتصال معنا على وسائل التواصل الاجتماعي

### الخدمات المتاحة:

- طلبات الجملة/الكميات الكبيرة
- تصنيع العلامات التجارية الخاصة
- تركيبات مخصصة
- الشحن الدولي
- شهادات المنتجات (CCPB، USDA، ECOCERT)`,
                        metaTitle: 'اتصل بـمغربية أورجانيكا - مورد منتجات عضوية بالجملة',
                        metaDesc: 'اتصل بمجموعة أورجانيكا لمنتجات التجميل العضوية بالجملة من المغرب. هاتف: +212 648-273228',
                        keywords: 'اتصل مغربية أورجانيكا، استفسار جملة، مورد منتجات عضوية، مراكش',
                    },
                    {
                        language: 'fr',
                        title: 'Contactez-Nous - Prenez Contact',
                        slug: 'contact',
                        content: `# Prenez Contact

Fournisseurs en gros de produits cosmétiques biologiques | Organica Group

## Informations de Contact

**Téléphone:** [+212 648-273228](tel:+212648273228)

**Email:** [inquiry@moroccanorganica.com](mailto:inquiry@moroccanorganica.com)

**Adresse du Bureau:**
Lot 377 N°3/6 Zone Industrielle Sidi Ghanem
40110 Marrakech, Maroc

## Heures d'Ouverture

**Lundi - Vendredi:** 9h00 - 18h00 (GMT+1)
**Samedi:** 10h00 - 14h00
**Dimanche:** Fermé

## Suivez-Nous

Restez connectés avec nous sur les réseaux sociaux

### Services Disponibles:

- Commandes en Gros/Bulk
- Fabrication de Marque Privée
- Formulations Personnalisées
- Expédition Internationale
- Certifications de Produits (CCPB, USDA, ECOCERT)`,
                        metaTitle: 'Contactez Moroccan Organica - Fournisseur de Produits Bio en Gros',
                        metaDesc: 'Contactez Organica Group pour des produits cosmétiques bio en gros du Maroc. Tél: +212 648-273228',
                        keywords: 'contact moroccan organica, demande grossiste, fournisseur bio, marrakech',
                    },
                ],
            },
        },
    });
    console.log('✅ Static page created: Contact');

    await prisma.staticPage.create({
        data: {
            systemName: 'PRIVACY_POLICY',
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'Privacy Policy',
                        slug: 'privacy-policy',
                        content: `# Privacy Policy

**Last Updated:** January 2026

At Moroccan Organica (Organica Group SARL), we respect your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and safeguard your data.

## Information We Collect

We collect information that you provide directly to us when you:

- Request a quote or make an inquiry
- Place an order for wholesale products
- Subscribe to our newsletter
- Create an account on our website
- Contact us via email, phone, or contact form

### Types of Information:

- **Personal Information**: Name, email address, phone number
- **Business Information**: Company name, tax ID (ICE), business address
- **Shipping Information**: Delivery addresses and contact details
- **Order Information**: Product selections, quantities, order history
- **Communication Preferences**: Marketing opt-in/opt-out preferences

## How We Use Your Information

We use the collected information to:

1. **Process and Fulfill Orders**: Handle your wholesale orders and shipments
2. **Communication**: Send order confirmations, shipping updates, and respond to inquiries
3. **Customer Service**: Provide support and address your concerns
4. **Business Relationships**: Maintain B2B relationships with wholesale clients
5. **Improve Services**: Enhance our products, services, and website experience
6. **Marketing**: Send promotional communications (only with your consent)
7. **Legal Compliance**: Meet regulatory requirements and legal obligations

## Data Security

We implement industry-standard security measures to protect your personal information:

- Secure SSL encryption for data transmission
- Restricted access to personal information
- Regular security audits and updates
- Secure storage systems
- Employee training on data protection

## Data Sharing

We do not sell your personal information to third parties. We may share your information only with:

- **Shipping Partners**: To deliver your orders
- **Payment Processors**: To process transactions securely
- **Business Partners**: For legitimate business purposes (with your consent)
- **Legal Authorities**: When required by law

## Your Rights

You have the right to:

- Access your personal data
- Correct inaccurate information
- Request deletion of your data
- Opt-out of marketing communications
- Withdraw consent at any time

## Cookies

Our website uses cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.

## International Transfers

As we operate internationally, your data may be transferred to and processed in different countries. We ensure appropriate safeguards are in place.

## Data Retention

We retain your information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.

## Contact Us

For privacy-related questions or to exercise your rights, please contact us:

**Email:** inquiry@moroccanorganica.com
**Phone:** +212 648-273228
**Address:** Lot 377 N°3/6 Sidi Ghanem, 40110 Marrakesh, Morocco

## Changes to This Policy

We may update this privacy policy periodically. We will notify you of significant changes via email or website notice.

## Compliance

This privacy policy complies with GDPR (General Data Protection Regulation) and applicable Moroccan data protection laws.`,
                        metaTitle: 'Privacy Policy - Moroccan Organica',
                        metaDesc: 'Read our privacy policy to learn how Moroccan Organica collects, uses, and protects your personal information. GDPR compliant.',
                        keywords: 'privacy policy, data protection, gdpr, moroccan organica privacy',
                        canonical: 'https://moroccanorganica.com/privacy-policy',
                    },
                    {
                        language: 'ar',
                        title: 'سياسة الخصوصية',
                        slug: 'سياسة-الخصوصية',
                        content: `# سياسة الخصوصية

**آخر تحديث:** يناير 2026

في Moroccan Organica (مجموعة أورجانيكا)، نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية.

## المعلومات التي نجمعها

نجمع المعلومات التي تقدمها لنا مباشرة عند:

- طلب عرض أسعار أو الاستفسار
- تقديم طلب لمنتجات الجملة
- الاشتراك في نشرتنا الإخبارية
- إنشاء حساب على موقعنا
- الاتصال بنا

### أنواع المعلومات:

- **معلومات شخصية**: الاسم، البريد الإلكتروني، رقم الهاتف
- **معلومات تجارية**: اسم الشركة، الرقم الضريبي، عنوان العمل
- **معلومات الشحن**: عناوين التسليم وتفاصيل الاتصال
- **معلومات الطلب**: اختيارات المنتجات، الكميات، سجل الطلبات

## كيف نستخدم معلوماتك

نستخدم المعلومات المجمعة لـ:

1. **معالجة الطلبات**: التعامل مع طلبات الجملة والشحنات
2. **الاتصال**: إرسال تأكيدات الطلبات وتحديثات الشحن
3. **خدمة العملاء**: تقديم الدعم ومعالجة المخاوف
4. **تحسين الخدمات**: تحسين منتجاتنا وخدماتنا
5. **التسويق**: إرسال اتصالات ترويجية (بموافقتك فقط)

## أمان البيانات

نطبق تدابير أمنية قياسية لحماية معلوماتك الشخصية.

## حقوقك

لديك الحق في:

- الوصول إلى بياناتك الشخصية
- تصحيح المعلومات غير الدقيقة
- طلب حذف بياناتك
- إلغاء الاشتراك في الاتصالات التسويقية

## اتصل بنا

البريد الإلكتروني: inquiry@moroccanorganica.com
الهاتف: +212 648-273228`,
                        metaTitle: 'سياسة الخصوصية - مغربية أورجانيكا',
                        metaDesc: 'اقرأ سياسة الخصوصية الخاصة بنا لمعرفة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.',
                    },
                    {
                        language: 'fr',
                        title: 'Politique de Confidentialité',
                        slug: 'politique-confidentialite',
                        content: `# Politique de Confidentialité

**Dernière mise à jour:** Janvier 2026

Chez Moroccan Organica (Organica Group SARL), nous respectons votre vie privée et nous nous engageons à protéger vos informations personnelles.

## Informations que Nous Collectons

Nous collectons les informations que vous nous fournissez directement lorsque vous:

- Demandez un devis ou faites une demande
- Passez une commande en gros
- Vous abonnez à notre newsletter
- Créez un compte sur notre site web
- Nous contactez

### Types d'Informations:

- **Informations Personnelles**: Nom, email, téléphone
- **Informations Commerciales**: Nom de l'entreprise, numéro fiscal, adresse professionnelle
- **Informations de Livraison**: Adresses de livraison et coordonnées
- **Informations de Commande**: Sélections de produits, quantités, historique

## Comment Nous Utilisons Vos Informations

Nous utilisons les informations collectées pour:

1. **Traiter les Commandes**: Gérer vos commandes en gros et expéditions
2. **Communication**: Envoyer des confirmations et mises à jour
3. **Service Client**: Fournir un support et répondre aux préoccupations
4. **Améliorer les Services**: Améliorer nos produits et services
5. **Marketing**: Envoyer des communications promotionnelles (avec votre consentement)

## Sécurité des Données

Nous mettons en œuvre des mesures de sécurité standard pour protéger vos informations personnelles.

## Vos Droits

Vous avez le droit de:

- Accéder à vos données personnelles
- Corriger les informations inexactes
- Demander la suppression de vos données
- Vous désabonner des communications marketing

## Contactez-Nous

Email: inquiry@moroccanorganica.com
Téléphone: +212 648-273228`,
                        metaTitle: 'Politique de Confidentialité - Moroccan Organica',
                        metaDesc: 'Lisez notre politique de confidentialité pour savoir comment nous collectons, utilisons et protégeons vos informations personnelles.',
                    },
                ],
            },
        },
    });
    console.log('✅ Static page created: Privacy Policy');

    await prisma.staticPage.create({
        data: {
            systemName: 'DELIVERY_INFO',
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'Delivery Information',
                        slug: 'delivery-Information',
                        content: `# Delivery Information

## General Information
All orders are subject to product availability. If an item is not in stock at the time you place your order, we will notify you and refund the total amount of your order, using the original method of payment. Please note, that all products are sold “as is”. You assume the responsibility for your purchase, and no returns or refunds will be issued, once the order is processed and payment done.

## Delivery Location
Items offered on our website are available for Worldwide delivery.

## Delivery Time
An estimated delivery time will be provided to you once you place your order. It starts from the date of shipping, rather than the date of order. Delivery times are to be used as an indication only and are subject to the acceptance and approval of your order. Unless there are exceptional circumstances, we make every effort to fulfill your order within [3] business days (from Monday to Friday except holidays) of the date of your order. Please note we do not ship on weekends.

## Shipping Costs
Shipping costs are based on the weight of your order and the delivery method. Additional shipping charges may apply to remote areas or for large or heavy items.

## Damaged Items in Transport
If there is any damage to the packaging on delivery, contact us immediately on Whatsapp at +212 648-273228.

## Questions
If you have any questions about the order, the delivery or shipment, please contact us at [inquiry@moroccanorganica.com](mailto:inquiry@moroccanorganica.com)`,
                        metaTitle: 'Delivery Information - Moroccan Organica',
                        metaDesc: 'Worldwide delivery information for Moroccan Organica wholesale products. Shipping times and costs.',
                    },
                    {
                        language: 'ar',
                        title: 'معلومات التوصيل',
                        slug: 'معلومات-التوصيل',
                        content: `# معلومات التوصيل

## معلومات عامة
تخضع جميع الطلبات لتوفر المنتج. يتم شحن الطلبات في غضون 3 أيام عمل.

## الشحن الدولي
نحن نشحن في جميع أنحاء العالم.`,
                    },
                    {
                        language: 'fr',
                        title: 'Informations de Livraison',
                        slug: 'informations-livraison',
                        content: `# Informations de Livraison

## Informations Générales
Toutes les commandes sont sujettes à la disponibilité des produits. Expédition sous 3 jours ouvrables.`,
                    },
                ],
            },
        },
    });
    console.log('✅ Static page created: Delivery Information');

    await prisma.staticPage.create({
        data: {
            systemName: 'TERMS_CONDITIONS',
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'Terms & Conditions',
                        slug: 'terms-conditions',
                        content: `# Terms & Conditions

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
                        title: 'الشروط والأحكام',
                        slug: 'الشروط-والأحكام',
                        content: `# الشروط والأحكام
تخضع هذه الشروط لقوانين المملكة المغربية.`,
                    },
                    {
                        language: 'fr',
                        title: 'Termes et Conditions',
                        slug: 'termes-et-conditions',
                        content: `# Termes et Conditions
Ces conditions sont régies par les lois du Maroc.`,
                    },
                ],
            },
        },
    });
    console.log('✅ Static page created: Terms & Conditions');

    await prisma.staticPage.create({
        data: {
            systemName: 'HOME',
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'Moroccan Organica - Wholesale Suppliers of Argan Oil',
                        slug: '/',
                        content: `# Moroccan Wholesale of Argan Oil

Trusted Wholesale Suppliers of Argan Oil and different cosmetics products based on **organic oils** in Morocco.

## Pure Organic Argan and Prickly Pear Oil
Organica Group is a specialist of pure organic argan and prickly pear oil distributed and packaged in bulk.

## Worldwide Distribution
We can ship our organic products to Europe and worldwide by air cargo with a short transit time.

## Premium Moroccan Beauty Products
- **Ghassoul Clay**: Mineral-rich solution for clean and soft skin.
- **Black Soap**: Traditional soap with vitamin E for deep cleansing.
- **Essential Oils**: 100% pure and therapeutic grade.

Explore our collection of authentic Moroccan treasures, sourced directly from cooperatives to ensure the highest quality and fair trade practices.`,
                        metaTitle: 'Moroccan Organica | Wholesale Argan Oil & Organic Cosmetics Suppliers',
                        metaDesc: 'Leading wholesale suppliers of organic argan oil, prickly pear oil, and Moroccan beauty products. Certified quality, worldwide shipping, private label available.',
                        keywords: 'wholesale argan oil, prickly pear oil supplier, moroccan cosmetics wholesale, organic oils morocco',
                    },
                    {
                        language: 'ar',
                        title: 'مغربية أورجانيكا - موردي زيت الأركان بالجملة',
                        slug: '/',
                        content: `# بيع زيت الأركان المغربي بالجملة

موردو جملة موثوقون لزيت الأركان ومنتجات التجميل المختلفة القائمة على **الزيوت العضوية** في المغرب.

## زيت الأركان وزيت التين الشوكي العضوي النقي
مجموعة أورجانيكا متخصصة في زيت الأركان وزيت التين الشوكي العضوي النقي الموزع والمعبأ بكميات كبيرة.

## التوزيع العالمي
يمكننا شحن منتجاتنا العضوية إلى أوروبا وجميع أنحاء العالم عن طريق الشحن الجوي في وقت قصير.`,
                        metaTitle: 'مغربية أورجانيكا | مورد زيت الأركان ومستحضرات التجميل العضوية بالجملة',
                        metaDesc: 'الموردون الرئيسيون لزيت الأركان العضوي وزيت التين الشوكي ومنتجات التجميل المغربية بالجملة. جودة معتمدة وشحن عالمي.',
                    },
                    {
                        language: 'fr',
                        title: 'Moroccan Organica - Grossiste d\'Huile d\'Argan',
                        slug: '/',
                        content: `# Vente en Gros d'Huile d'Argan du Maroc

Fournisseurs en gros de confiance d'huile d'argan et de différents produits cosmétiques à base de **huiles biologiques** au Maroc.

## Huile d'Argan et de Figue de Barbarie Bio Pure
Organica Group est spécialiste de l'huile d'argan et de figue de barbarie bio pure, distribuée et conditionnée en vrac.

## Distribution Mondiale
Nous pouvons expédier nos produits bio en Europe et dans le monde entier par fret aérien avec un délai de transit court.`,
                        metaTitle: 'Moroccan Organica | Grossiste d\'Huile d\'Argan et Cosmétiques Bio',
                        metaDesc: 'Principaux fournisseurs en gros d\'huile d\'argan bio, d\'huile de figue de barbarie et de produits de beauté marocains. Qualité certifiée, expédition mondiale.',
                    },
                ],
            },
        },
    });
    console.log('✅ Static page created: Home Page');

    await prisma.staticPage.create({
        data: {
            systemName: 'PRIVATE_LABEL',
            translations: {
                create: [
                    {
                        language: 'en',
                        title: 'Private Label & White Label Services',
                        slug: 'argan-oil-private-label-manufacturer',
                        content: `# Private Labeling Services

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
                        title: 'خدمات العلامة التجارية الخاصة',
                        slug: 'العلامة-التجارية-الخاصة',
                        content: `# خدمات العلامة التجارية الخاصة

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
                        title: 'Services de Marque Privée',
                        slug: 'marque-privee',
                        content: `# Services de Marque Privée (Private Label)

Organica Group est le partenaire de fabrication idéal pour la Marque Privée. Avec une large gamme de catégories de produits cosmétiques bio, nous sommes très flexibles.

## Ajoutez Votre Propre Marque

Nous offrons à nos clients des emballages uniques personnalisables. Nous collaborons avec des usines spécialisées dans la conception d'emballages.

### Quantités Minimales de Commande (MOQ)
- **Tubes (T5)** : 2 500 unités
- **Boîtes** : 1 000 unités
- **Étiquettes Personnalisées** : Minimum 100 unités seulement

### Langues d'Étiquetage
Nous fournissons des étiquettes en **anglais, arabe, français** ou autres langues sans supplément de prix.`,
                    },
                ],
            },
        },
    });
    console.log('✅ Static page created: Private Label');

    console.log('');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Admin users: 1`);
    console.log(`   - Customers: 1`);
    console.log(`   - Categories: ${categories.length} (with multilingual translations)`);
    console.log(`   - Products: 9 (based on old site, with variants and translations)`);
    console.log(`   - Blog posts: 2 (multilingual)`);
    console.log(`   - Static pages: 7 (Home, About, Contact, Privacy, Delivery, Terms, Private Label)`);
    console.log(`   - Total variants: 19`);
    console.log('');
    console.log('🔑 Admin Login:');
    console.log('   Email: admin@moroccan-organica.com');
    console.log('   Password: admin123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
