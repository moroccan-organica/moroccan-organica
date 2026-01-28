"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useCart } from "./CartContext";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CartDrawerProps {
    isRTL?: boolean;
    lang?: string;
}

const CartDrawer = ({ isRTL = false, lang = "en" }: CartDrawerProps) => {
    const { items, updateQuantity, removeItem, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();
    const [isAnimating, setIsAnimating] = useState(false);
    const prevTotalItemsRef = useRef(totalItems);
    const pathname = usePathname();

    // Extract lang from pathname if not provided
    const currentLang = lang || (pathname?.split('/')[1] || 'en');

    useEffect(() => {
        // Close drawer when pathname changes (navigation)
        setIsCartOpen(false);
    }, [pathname, setIsCartOpen]);

    useEffect(() => {
        // Détecter quand un produit est ajouté (totalItems augmente)
        if (totalItems > prevTotalItemsRef.current) {
            setIsAnimating(true);
            // Réinitialiser l'animation après 600ms
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 600);
            return () => clearTimeout(timer);
        }
        prevTotalItemsRef.current = totalItems;
    }, [totalItems]);

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
                <button className={`relative cursor-pointer group ${isAnimating ? 'animate-bounce' : ''}`}>
                    <ShoppingCart
                        className={`w-6 h-6 text-white group-hover:text-[#118f14] transition-all duration-300 ${isAnimating ? 'scale-125 rotate-12' : ''
                            }`}
                    />
                    {totalItems > 0 && (
                        <div
                            className={`absolute -top-2 ${isRTL ? "-left-2" : "-right-2"
                                } w-5 h-5 bg-[#118f14] rounded-full flex items-center justify-center transition-all duration-300 ${isAnimating ? 'scale-150 animate-pulse' : ''
                                }`}
                        >
                            <span className="text-white text-xs font-bold">{totalItems}</span>
                        </div>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent
                side={isRTL ? "left" : "right"}
                className="w-full sm:max-w-md bg-background border-border z-[100]"
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        {isRTL ? "سلة التسوق" : "Shopping Cart"}
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
                    {items.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            {isRTL ? "سلة التسوق فارغة" : "Your cart is empty"}
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.product.id}
                                        className="flex gap-4 p-4 bg-muted/50 rounded-lg"
                                    >
                                        <div className="w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0 relative">
                                            <Image
                                                src={item.product.image}
                                                alt={isRTL ? item.product.nameAr : item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <h4 className="font-medium text-foreground">
                                                {isRTL ? item.product.nameAr : item.product.name}
                                            </h4>
                                            <p className="text-primary font-semibold">
                                                ${item.product.price.toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-auto">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, -1)}
                                                    className="p-1 rounded bg-background border border-border hover:bg-muted"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, 1)}
                                                    className="p-1 rounded bg-background border border-border hover:bg-muted"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.product.id)}
                                                    className="p-1 rounded text-destructive hover:bg-destructive/10 ms-auto"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-4 mt-4 space-y-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>{isRTL ? "المجموع" : "Total"}</span>
                                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                                </div>
                                <Link
                                    href={`/${currentLang}/checkout`}
                                    className="block"
                                    onClick={() => setIsCartOpen(false)}
                                >
                                    <Button className="w-full btn-accent">
                                        {isRTL ? "إتمام الطلب" : "Checkout"}
                                    </Button>
                                </Link>
                                <Link
                                    href={`/${currentLang}/shop`}
                                    className="block"
                                    onClick={() => setIsCartOpen(false)}
                                >
                                    <Button variant="outline" className="w-full">
                                        {isRTL ? "متابعة التسوق" : "Continue Shopping"}
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
