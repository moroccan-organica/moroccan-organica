import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";

interface ProductCardProps {
  image: string | StaticImageData;
  title: string;
  description: string;
  badge: string;
  badgeVariant?: "organic" | "bulk" | "premium";
}

const ProductCard = ({ image, title, description, badge, badgeVariant = "organic" }: ProductCardProps) => {
  const badgeStyles = {
    organic: "bg-primary text-primary-foreground",
    bulk: "bg-accent text-accent-foreground",
    premium: "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="group flex flex-col h-full bg-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image - 70% height */}
      <div className="relative overflow-hidden h-72 min-h-[200px]">
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeStyles[badgeVariant]}`}>
            {badge}
          </span>
        </div>

        {/* Add to Cart - appears on hover with slide up */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-4">
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            Add to Cart
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
