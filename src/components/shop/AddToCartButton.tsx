"use client";

import { MouseEvent } from "react";
import { useCart } from "./CartContext";
import type { ShopProduct } from "@/data/shop-products";

interface AddToCartButtonProps {
  product: ShopProduct;
  label: string;
}

const AddToCartButton = ({ product, label }: AddToCartButtonProps) => {
  const { addItem } = useCart();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addItem(product, 1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex-1 min-w-[220px] rounded-full border border-transparent bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
    >
      {label}
    </button>
  );
};

export default AddToCartButton;
