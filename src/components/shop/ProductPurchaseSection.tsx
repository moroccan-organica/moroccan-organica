"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/shop/CartContext";
import type { ShopProductDB } from "@/types/product";
import type { ShopProduct } from "@/data/shop-products";
import { Check, ShoppingCart, MessageCircle } from "lucide-react";

export interface ProductPurchaseTranslations {
  volume: string;
  category: string;
  price: string;
  fulfillment: string;
  fulfillmentValue: string;
  specs: string;
  certificationValue: string;
  addToCart: string;
  whatsapp: string;
}

export interface ProductPurchaseSectionProps {
  product: ShopProductDB;
  lang: string;
  translations: ProductPurchaseTranslations;
}

interface ParsedVariant {
  id: string;
  sku: string;
  sizeName: string;
  displayLabel: string;
  price: number;
  stock: number;
}

function cleanSizeLabel(sizeName: string): string {
  if (!sizeName) return "";
  const lower = sizeName.toLowerCase().trim();

  // Common liquid units
  if (lower.startsWith("100 ml") || lower.startsWith("100ml")) return "100 ml";
  if (lower.startsWith("250 ml") || lower.startsWith("250ml")) return "250 ml";
  if (lower.startsWith("500 ml") || lower.startsWith("500ml")) return "500 ml";
  if (lower.startsWith("1 l") || lower.startsWith("1l")) return "1 L";
  if (lower.startsWith("5 l") || lower.startsWith("5l")) return "5 L";
  if (lower.startsWith("10 l") || lower.startsWith("10l")) return "10 L";
  if (lower.startsWith("25 l") || lower.startsWith("25l")) return "25 L";

  // Common powder / solid units
  if (lower.startsWith("250 g") || lower.startsWith("250g")) return "250 g";
  if (lower.startsWith("500 g") || lower.startsWith("500g")) return "500 g";
  if (lower.startsWith("1 kg") || lower.startsWith("1kg")) return "1 kg";
  if (lower.startsWith("5 kg") || lower.startsWith("5kg")) return "5 kg";
  if (lower.startsWith("10 kg") || lower.startsWith("10kg")) return "10 kg";
  if (lower.startsWith("25 kg") || lower.startsWith("25kg")) return "25 kg";

  // Default clean: take everything before hyphen or gallon
  const parts = sizeName.split("-");
  if (parts.length > 0 && parts[0].trim()) {
    return parts[0].trim();
  }
  return sizeName.trim();
}

const SIZE_SORT_ORDER: Record<string, number> = {
  // Liquids
  "100 ml": 1,
  "250 ml": 2,
  "500 ml": 3,
  "1 l": 4,
  "5 l": 5,
  "10 l": 6,
  "25 l": 7,
  // Powders
  "250 g": 1,
  "500 g": 2,
  "1 kg": 3,
  "5 kg": 4,
  "10 kg": 5,
  "25 kg": 6,
};

export default function ProductPurchaseSection({
  product,
  lang,
  translations: t,
}: ProductPurchaseSectionProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const isRTL = lang === "ar";
  const locale = isRTL ? "ar-MA" : "en-US";

  const priceFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }, [locale]);

  // Build the list of selectable variants (from DB or smart defaults)
  const variants: ParsedVariant[] = useMemo(() => {
    const rawVariants = (product.variants || []).filter(
      (v) => v.sizeName && v.sizeName.trim().toLowerCase() !== "default"
    );

    if (rawVariants.length > 0) {
      return rawVariants
        .map((v) => ({
          id: v.id,
          sku: v.sku,
          sizeName: v.sizeName,
          displayLabel: cleanSizeLabel(v.sizeName),
          price: Number(v.price),
          stock: v.stock,
        }))
        .sort((a, b) => {
          const keyA = a.displayLabel.toLowerCase();
          const keyB = b.displayLabel.toLowerCase();
          const orderA = SIZE_SORT_ORDER[keyA] ?? 99;
          const orderB = SIZE_SORT_ORDER[keyB] ?? 99;
          if (orderA !== orderB) return orderA - orderB;
          return a.price - b.price;
        });
    }

    // Fallback: check if product is a powder product or liquid product
    const textCorpus = `${product.name} ${product.slug} ${product.category || ""} ${product.categorySlug || ""} ${product.nameAr || ""}`.toLowerCase();
    const isPowder =
      textCorpus.includes("powder") ||
      textCorpus.includes("poudre") ||
      textCorpus.includes("nila") ||
      textCorpus.includes("ghassoul") ||
      textCorpus.includes("argile") ||
      textCorpus.includes("clay") ||
      textCorpus.includes("مسحوق") ||
      textCorpus.includes("بودرة") ||
      textCorpus.includes("طين") ||
      textCorpus.includes("غاسول");

    // Check if product is an explicit fixed bulk SKU (e.g. 25L, 10L, 25 Kg)
    const fixedBulkMatch = product.name.match(/\b(25\s*L|10\s*L|25\s*Kg|10\s*Kg)\b/i);
    if (fixedBulkMatch) {
      const fixedSize = fixedBulkMatch[0].trim();
      return [
        {
          id: `${product.id}-fixed`,
          sku: product.sku,
          sizeName: fixedSize,
          displayLabel: fixedSize,
          price: product.price,
          stock: product.stock || 50,
        },
      ];
    }

    const basePrice = Number(product.price) || 120;

    if (isPowder) {
      return [
        {
          id: `${product.id}-250g`,
          sku: `${product.sku}-250G`,
          sizeName: "250 g",
          displayLabel: "250 g",
          price: basePrice,
          stock: product.stock || 100,
        },
        {
          id: `${product.id}-1kg`,
          sku: `${product.sku}-1KG`,
          sizeName: "1 kg",
          displayLabel: "1 kg",
          price: Math.round(basePrice * 3.2),
          stock: product.stock || 50,
        },
        {
          id: `${product.id}-5kg`,
          sku: `${product.sku}-5KG`,
          sizeName: "5 kg",
          displayLabel: "5 kg",
          price: Math.round(basePrice * 12),
          stock: product.stock || 20,
        },
      ];
    }

    // Default liquid sizes: 100 ml, 250 ml, 5 L
    return [
      {
        id: `${product.id}-100ml`,
        sku: `${product.sku}-100ML`,
        sizeName: "100 ml",
        displayLabel: "100 ml",
        price: basePrice,
        stock: product.stock || 100,
      },
      {
        id: `${product.id}-250ml`,
        sku: `${product.sku}-250ML`,
        sizeName: "250 ml",
        displayLabel: "250 ml",
        price: Math.round(basePrice * 2.2),
        stock: product.stock || 50,
      },
      {
        id: `${product.id}-5l`,
        sku: `${product.sku}-5L`,
        sizeName: "5 L - 1.32 GAL",
        displayLabel: "5 L",
        price: Math.round(basePrice * 15),
        stock: product.stock || 20,
      },
    ];
  }, [product]);

  // Selected variant state
  const [selectedVariant, setSelectedVariant] = useState<ParsedVariant>(() => {
    if (product.volume) {
      const match = variants.find(
        (v) =>
          cleanSizeLabel(v.sizeName).toLowerCase() ===
          cleanSizeLabel(product.volume).toLowerCase()
      );
      if (match) return match;
    }
    return variants[0];
  });

  // Keep selected variant in sync if variants list changes
  const activeVariant =
    variants.find((v) => v.id === selectedVariant.id || v.sizeName === selectedVariant.sizeName) ||
    variants[0] ||
    selectedVariant;

  const handleAddToCart = () => {
    const cartProduct: ShopProduct = {
      id: `${product.id}__${activeVariant.id || activeVariant.sizeName}`,
      slug: product.slug,
      category: product.category,
      image: product.image,
      gallery: product.gallery,
      badge: product.badge,
      volume: activeVariant.sizeName,
      name: product.name,
      nameAr: product.nameAr,
      nameFr: product.nameFr,
      description: product.description,
      descriptionAr: product.descriptionAr,
      descriptionFr: product.descriptionFr,
      notes: product.notes || [],
      price: activeVariant.price,
      stockQuantity: activeVariant.stock,
    };

    addItem(cartProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // Localized product name for WhatsApp
  const localizedName = isRTL
    ? product.nameAr || product.name
    : lang === "fr"
    ? product.nameFr || product.name
    : product.name;

  const currentPriceFormatted = priceFormatter.format(activeVariant.price);

  const whatsappMessage = isRTL
    ? `مرحباً، أود الاستفسار عن طلب: ${localizedName} (الحجم: ${activeVariant.displayLabel}) بسعر ${currentPriceFormatted}`
    : lang === "fr"
    ? `Bonjour, je souhaite commander : ${localizedName} (Taille : ${activeVariant.displayLabel}) au prix de ${currentPriceFormatted}`
    : `Hello, I would like to order: ${localizedName} (Size: ${activeVariant.displayLabel}) for ${currentPriceFormatted}`;

  const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Product Spec Card with Interactive Size Selection */}
      <div className="grid gap-5 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 text-sm text-emerald-900 sm:grid-cols-2 shadow-sm">
        {/* Size Selection */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold mb-2.5">
            {t.volume}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {variants.map((v) => {
              const isSelected =
                v.id === activeVariant.id || v.sizeName === activeVariant.sizeName;
              return (
                <button
                  key={v.id || v.sizeName}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  title={v.sizeName}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? "bg-emerald-800 text-white border-emerald-800 shadow-sm shadow-emerald-950/20 ring-2 ring-emerald-600/30 scale-[1.02]"
                      : "bg-white/90 text-emerald-950 border-emerald-200/90 hover:bg-emerald-100/80 hover:border-emerald-400"
                  }`}
                >
                  {v.displayLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold mb-1">
            {t.category}
          </p>
          <p className="text-base sm:text-lg font-semibold text-emerald-950 leading-snug">
            {product.category}
          </p>
        </div>

        {/* Price (Reactive to Selected Size) */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold mb-1">
            {t.price}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-800 tracking-tight transition-all duration-200">
            {currentPriceFormatted}
          </p>
        </div>

        {/* Fulfillment */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold mb-1">
            {t.fulfillment}
          </p>
          <p className="text-base sm:text-lg font-semibold text-emerald-950 leading-snug">
            {t.fulfillmentValue}
          </p>
        </div>
      </div>

      {/* Enlarged Specifications Box */}
      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
        <p className="text-sm md:text-base font-semibold uppercase tracking-[0.25em] text-emerald-600">
          {t.specs}
        </p>
        <p className="mt-2 text-base md:text-lg font-medium text-emerald-950/90 leading-relaxed">
          {t.certificationValue}
        </p>
      </div>

      {/* Action Buttons: Add to Cart & Chat on WhatsApp */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 min-w-[220px] rounded-full border border-transparent bg-emerald-800 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-emerald-950/10 transition hover:bg-emerald-700 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>{isRTL ? "تمت الإضافة للسلة!" : "Added to Cart!"}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>{t.addToCart}</span>
            </>
          )}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 min-w-[220px] rounded-full border border-emerald-200 bg-white/80 px-6 py-3.5 text-center text-sm font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-500 hover:bg-white hover:text-emerald-950 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>{t.whatsapp}</span>
        </a>
      </div>
    </div>
  );
}
