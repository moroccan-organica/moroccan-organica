"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CheckoutSuccessClientProps {
    dict: any;
    lang: string;
    orderId?: string;
}

export function CheckoutSuccessClient({ dict, lang, orderId }: CheckoutSuccessClientProps) {
    const isRTL = lang === "ar";
    const checkoutDict = dict.checkout || {};

    return (
        <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardContent className="pt-6">
                    <div className="text-center space-y-6">
                        {/* Success Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>

                        {/* Success Message */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {isRTL ? "تم إتمام الطلب بنجاح!" : "Order Placed Successfully!"}
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {isRTL 
                                    ? "شكراً لك على طلبك. سنقوم بمعالجة طلبك وإرسال تأكيد إلى بريدك الإلكتروني قريباً."
                                    : "Thank you for your order. We'll process your order and send a confirmation email shortly."
                                }
                            </p>
                        </div>

                        {/* Order Details */}
                        {orderId && (
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Package className="w-4 h-4" />
                                    <span>{isRTL ? "رقم الطلب:" : "Order Number:"}</span>
                                </div>
                                <p className="font-mono font-semibold text-lg">{orderId}</p>
                            </div>
                        )}

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <div className="text-left">
                                            <p className="font-semibold text-sm">
                                                {isRTL ? "تأكيد البريد الإلكتروني" : "Email Confirmation"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {isRTL 
                                                    ? "تم إرسال تأكيد إلى بريدك الإلكتروني"
                                                    : "Confirmation sent to your email"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-primary" />
                                        <div className="text-left">
                                            <p className="font-semibold text-sm">
                                                {isRTL ? "تتبع الطلب" : "Track Your Order"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {isRTL 
                                                    ? "سنقوم بتحديثك عند شحن طلبك"
                                                    : "We'll update you when your order ships"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <Link href={`/${lang}/shop`}>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {isRTL ? "العودة إلى المتجر" : "Back to Shop"}
                                </Button>
                            </Link>
                            <Link href={`/${lang}`}>
                                <Button className="w-full sm:w-auto btn-accent">
                                    {isRTL ? "الصفحة الرئيسية" : "Home"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
