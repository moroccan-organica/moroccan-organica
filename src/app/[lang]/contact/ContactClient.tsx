"use client";

import { motion, MotionProps } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";
import { useState, ComponentType } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactInfoItem {
    type: string;
    title: string;
    details: string;
    subtext: string;
}

interface ContactPageData {
    hero: {
        label: string;
        title: string;
        description: string;
        bgImage: string;
    };
    info: {
        title: string;
        items: ContactInfoItem[];
    };
    form: {
        label: string;
        title: string;
        description: string;
    };
    benefits: {
        title: string;
        items: string[];
    };
}

interface ContactFormFields {
    fullName?: string;
    fullNamePlaceholder?: string;
    email?: string;
    emailPlaceholder?: string;
    phone?: string;
    phonePlaceholder?: string;
    productType?: string;
    productTypes?: Record<string, string>;
    quantity?: string;
    quantityPlaceholder?: string;
    destination?: string;
    destinationPlaceholder?: string;
    message?: string;
    messagePlaceholder?: string;
    submit?: string;
    sending?: string;
}

interface ContactDictionary {
    hero?: Partial<ContactPageData['hero']>;
    info?: Partial<ContactPageData['info']>;
    form?: Partial<ContactPageData['form']>;
    benefits?: Partial<ContactPageData['benefits']>;
    formFields?: ContactFormFields;
    success?: Partial<{ title: string; message: string; button: string }>;
    map?: Partial<{ city: string; address: string }>;
}

interface ContactClientProps {
    data: ContactPageData;
    dict: ContactDictionary;
}

type IconComponent = ComponentType<{ className?: string }>;

const iconMap: Record<string, IconComponent> = {
    email: Mail,
    phone: Phone,
    address: MapPin,
    hours: Clock,
};

export default function ContactClient({ data, dict }: ContactClientProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "Organic Virgin",
        liters: "",
        destination: "",
        message: ""
    });

    const fadeInUp: MotionProps = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                company: "Not Provided (Contact Form)",
                message: `
                Product Type: ${formData.type}
                Quantity: ${formData.liters} Liters
                Destination: ${formData.destination}
                
                Message:
                ${formData.message}
                `
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message');
            }

            setIsSuccess(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                type: "Organic Virgin",
                liters: "",
                destination: "",
                message: ""
            });

            // Reset success message after 5 seconds
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            // Optionally set an error state here to display to the user
            alert('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Merge data with translations if available
    const formFields: ContactFormFields = dict.formFields ?? {};

    const content = {
        hero: { ...data.hero, ...dict.hero },
        info: { ...data.info, ...dict.info },
        form: { ...data.form, ...dict.form },
        benefits: { ...data.benefits, ...dict.benefits },
        formFields,
        success: dict.success || {},
        map: dict.map || {}
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={content.hero.bgImage || "/images/contact/bulk-ingredients.jpg"}
                        alt="Contact Hero"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-secondary/70 via-secondary/60 to-secondary/40" />
                </div>

                <div className="container-main relative z-10 py-20 md:py-28">
                    <motion.div
                        className="text-center max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block text-bronze font-semibold text-sm uppercase tracking-wider mb-4">
                            {content.hero.label}
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {content.hero.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            {content.hero.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 bg-muted/50">
                <div className="container-main">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.info.items.map((info: ContactInfoItem, index: number) => {
                            const Icon = iconMap[info.type] || Mail;
                            return (
                                <motion.div
                                    key={info.title}
                                    className="bg-card rounded-xl p-6 text-center shadow-sm border border-border hover:shadow-md transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                                        {info.title}
                                    </h3>
                                    <p className="text-foreground font-medium">{info.details}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{info.subtext}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="section-padding bg-background">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Form */}
                        <motion.div {...fadeInUp}>
                            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                                {content.form.label}
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                                {content.form.title}
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                {content.form.description}
                            </p>

                            {isSuccess ? (
                                <motion.div
                                    className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{content.success.title || "Message Sent!"}</h3>
                                    <p className="text-muted-foreground">{content.success.message || "Thank you for your inquiry. We'll get back to you within 24 hours."}</p>
                                    <Button
                                        onClick={() => setIsSuccess(false)}
                                        variant="outline"
                                        className="mt-6 rounded-full"
                                    >
                                        {content.success.button || "Send Another Message"}
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{content.formFields.fullName || "Full Name *"}</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder={content.formFields.fullNamePlaceholder || "John Doe"}
                                                required
                                                className="bg-muted border-border focus:border-primary rounded-xl h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{content.formFields.email || "Email Address *"}</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder={content.formFields.emailPlaceholder || "john@company.com"}
                                                required
                                                className="bg-muted border-border focus:border-primary rounded-xl h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">{content.formFields.phone || "Phone Number"}</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder={content.formFields.phonePlaceholder || "+1 (555) 000-0000"}
                                                className="bg-muted border-border focus:border-primary rounded-xl h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">{content.formFields.productType || "Product Type"}</Label>
                                            <select
                                                id="type"
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="flex h-12 w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm ring-offset-background focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="Organic Virgin">{content.formFields.productTypes?.["Organic Virgin"] || "Organic Virgin"}</option>
                                                <option value="Deodorized">{content.formFields.productTypes?.["Deodorized"] || "Deodorized"}</option>
                                                <option value="Culinary">{content.formFields.productTypes?.["Culinary"] || "Culinary"}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="liters">{content.formFields.quantity || "Quantity (Liters)"}</Label>
                                            <Input
                                                id="liters"
                                                name="liters"
                                                type="number"
                                                value={formData.liters}
                                                onChange={handleInputChange}
                                                placeholder={content.formFields.quantityPlaceholder || "Liters"}
                                                required
                                                className="bg-muted border-border focus:border-primary rounded-xl h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="destination">{content.formFields.destination || "Destination"}</Label>
                                            <Input
                                                id="destination"
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleInputChange}
                                                placeholder={content.formFields.destinationPlaceholder || "Country / City"}
                                                required
                                                className="bg-muted border-border focus:border-primary rounded-xl h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">{content.formFields.message || "Your Message *"}</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder={content.formFields.messagePlaceholder || "Tell us about your requirements..."}
                                            rows={6}
                                            required
                                            className="bg-muted border-border focus:border-primary resize-none rounded-2xl p-4"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-10 py-7 bg-bronze hover:bg-bronze-dark text-white font-semibold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        {isSubmitting ? (
                                            content.formFields.sending || "Sending..."
                                        ) : (
                                            <>
                                                {content.formFields.submit || "Send Message"}
                                                <Send className="ml-2 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </motion.div>

                        {/* Map / Info Side */}
                        <motion.div
                            className="lg:sticky lg:top-32"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="bg-muted/50 rounded-2xl p-8 border border-border mb-8">
                                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                                    {content.benefits.title}
                                </h3>
                                <ul className="space-y-4">
                                    {content.benefits.items.map((item: string, index: number) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-bronze" />
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Map Placeholder */}
                            <div className="relative rounded-2xl overflow-hidden h-[300px] bg-muted border border-border shadow-inner">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                                        <p className="font-serif text-xl font-semibold text-foreground">{content.map.city || "Agadir, Morocco"}</p>
                                        <p className="text-muted-foreground">{content.map.address || "Industrial Zone, Ait Melloul"}</p>
                                    </div>
                                </div>
                                {/* Simple overlay to make it look like a map */}
                                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
