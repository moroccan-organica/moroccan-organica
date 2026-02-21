"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, PackageCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuoteFormProps {
    lang: string;
    productName: string;
}

const copy = {
    en: {
        title: "Get Quick Quote",
        minOrder: "Minimum order: 5L / 5kg",
        name: "Your Name",
        email: "Email",
        phone: "Phone",
        productType: "Product Type",
        quantity: "Quantity",
        liters: "Liters / Kg",
        destination: "Destination (Country/City)",
        message: "Your Message",
        send: "Send Request",
        submitting: "Sending...",
        successTitle: "Quote Request Sent!",
        successMessage: "We'll get back to you with a quote within 24 hours.",
        sendAnother: "Send Another Request"
    },
    ar: {
        title: "طلب عرض سعر سريع",
        minOrder: "الحد الأدنى للطلب: 5 لتر / 5 كيلو",
        name: "الاسم الكريم",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        productType: "نوع المنتج",
        quantity: "الكمية",
        liters: "لتر / كيلو",
        destination: "وجهة الشحن (الدولة/المدينة)",
        message: "رسالتك",
        send: "إرسال الطلب",
        submitting: "جاري الإرسال...",
        successTitle: "تم إرسال الطب!",
        successMessage: "سنتواصل معك بعرض السعر خلال 24 ساعة.",
        sendAnother: "إرسال طلب آخر"
    },
    fr: {
        title: "OBTENIR UN DEVIS",
        minOrder: "Commande minimum : 5L / 5kg",
        name: "Votre Nom",
        email: "Email",
        phone: "Téléphone",
        productType: "Type de Produit",
        quantity: "Combien d'articles/kg ?",
        destination: "Destination",
        message: "Votre Message",
        send: "ENVOYER",
        submitting: "ENVOI...",
        success: "Demande de devis envoyée avec succès !",
    }
} as const;

export function WholesaleQuoteForm({ lang, productName }: QuoteFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: productName,
        liters: "",
        destination: "",
        message: "",
    });

    const t = (copy as any)[lang] || copy.en;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isSuccess) {
        return (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <PackageCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t.successTitle}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.successMessage}</p>
                <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                >
                    {t.sendAnother}
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl p-8 shadow-card border border-emerald-50 sticky top-24">
            <h3 className="text-xl font-semibold text-foreground mb-6">{t.title}</h3>

            <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl mb-6">
                <p className="text-rose-600 text-[10px] uppercase font-bold tracking-[0.2em] text-center">
                    {t.minOrder}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-emerald-900">{t.name}</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder={t.name}
                        className="bg-background border-emerald-100/50"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-emerald-900">{t.email}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t.email}
                            className="bg-background border-emerald-100/50"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-emerald-900">{t.phone}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder={t.phone}
                            className="bg-background border-emerald-100/50"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="type" className="text-xs font-semibold text-emerald-900">{t.productType}</Label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-emerald-100/50 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value={productName}>{productName}</option>
                            <option value="Organic Virgin">Organic Virgin</option>
                            <option value="Deodorized">Deodorized</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="liters" className="text-xs font-semibold text-emerald-900">{t.quantity}</Label>
                        <Input
                            id="liters"
                            name="liters"
                            type="text"
                            placeholder={t.liters}
                            required
                            value={formData.liters}
                            onChange={handleChange}
                            className="bg-background border-emerald-100/50"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="destination" className="text-xs font-semibold text-emerald-900">{t.destination}</Label>
                    <Input
                        id="destination"
                        name="destination"
                        placeholder={t.destination}
                        required
                        value={formData.destination}
                        onChange={handleChange}
                        className="bg-background border-emerald-100/50"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-semibold text-emerald-900">{t.message}</Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder={t.message}
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-background border-emerald-100/50 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-accent w-full py-3 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t.submitting}
                        </>
                    ) : (
                        <>
                            {t.send}
                            <Send className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
