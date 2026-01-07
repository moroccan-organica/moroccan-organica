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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image, { StaticImageData } from "next/image";
import arganImage from "@/assets/argan-oil.jpg";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | StaticImageData;
}

interface CartDrawerProps {
    isRTL?: boolean;
}

const CartDrawer = ({ isRTL = false }: CartDrawerProps) => {
    const { t } = useTranslation();
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Organic Argan Oil",
            price: 45.00,
            quantity: 1,
            image: arganImage,
        },
    ]);

    const updateQuantity = (id: number, change: number) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative cursor-pointer group">
                    <ShoppingCart className="w-6 h-6 text-white group-hover:text-[#118f14] transition-colors" />
                    {totalItems > 0 && (
                        <div
                            className={`absolute -top-2 ${isRTL ? "-left-2" : "-right-2"
                                } w-5 h-5 bg-[#118f14] rounded-full flex items-center justify-center`}
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
                    {cartItems.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            {isRTL ? "سلة التسوق فارغة" : "Your cart is empty"}
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 bg-muted/50 rounded-lg"
                                    >
                                        <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0 relative">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <h4 className="font-medium text-foreground">{item.name}</h4>
                                            <p className="text-primary font-semibold">
                                                ${item.price.toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-auto">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-1 rounded bg-background border border-border hover:bg-muted"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-1 rounded bg-background border border-border hover:bg-muted"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
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
                                <Button className="w-full btn-accent">
                                    {isRTL ? "إتمام الطلب" : "Checkout"}
                                </Button>
                                <Button variant="outline" className="w-full">
                                    {isRTL ? "متابعة التسوق" : "Continue Shopping"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
