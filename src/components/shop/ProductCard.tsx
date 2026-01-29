"use client";

import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { useCart } from "@/components/shop/CartContext";
import type { ShopProduct } from "@/data/shop-products";

interface ProductCardProps {
  image: string | StaticImageData;
  title: string;
  description: string;
  badge: string;
  badgeVariant?: "organic" | "bulk" | "premium";
  id?: string;
  price?: number;
  volume?: string;
  category?: string;
  slug?: string;
  name?: string;
  nameAr?: string;
  descriptionAr?: string;
}

const ProductCard = ({
  image,
  title,
  description,
  badge,
  badgeVariant = "organic",
  id,
  price,
  volume,
  category,
  slug,
  name,
  nameAr,
  descriptionAr
}: ProductCardProps) => {
  const { addItem } = useCart();
  const badgeStyles = {
    organic: "bg-primary text-primary-foreground",
    bulk: "bg-accent text-accent-foreground",
    premium: "bg-secondary text-secondary-foreground",
  };

  const handleAddToCart = () => {
    if (!id || price === undefined) return;

    const product: ShopProduct = {
      id,
      slug: slug || "",
      category: category || "General",
      image: typeof image === 'string' ? image : (image as any).src || "",
      volume: volume || "Standard",
      name: name || title,
      nameAr: nameAr || title,
      description: description,
      descriptionAr: descriptionAr || description,
      price: price,
      notes: [],
    };
    addItem(product);
  };

  return (
    <div className="group flex flex-col h-full bg-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image - 4:3 Aspect Ratio */}
      <div className="relative overflow-hidden aspect-[4/3] w-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeStyles[badgeVariant]}`}>
            {badge}
          </span>
        </div>

        {/* Add to Cart - appears on hover with slide up */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-4">
          <Button
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground cursor-pointer"
            onClick={handleAddToCart}
            disabled={!id || price === undefined}
          >
            Add to Cart
            {price !== undefined && <span className="ml-2">(${price})</span>}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="heading-card text-foreground mb-2">{title}</h3>
        <p className="text-body-sm text-muted-foreground line-clamp-3 flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
