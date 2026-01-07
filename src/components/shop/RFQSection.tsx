"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Truck, Clock, ShieldCheck, Send } from "lucide-react";
import warehouseImage from "@/assets/warehouse.jpg";

const RFQSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you! We will contact you within 24 hours.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Global shipping with DHL, FedEx, and sea freight options",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Dedicated account manager for all your inquiries",
    },
    {
      icon: ShieldCheck,
      title: "Certified Quality",
      description: "USDA, ECOCERT, and ISO 9001 certified products",
    },
  ];

  return (
    <section id="contact" className="section-padding bg-muted">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form Column */}
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-card animate-fade-in-left">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Request Quote
            </span>
            <h2 className="heading-section text-foreground mb-2">
              Get Wholesale Pricing
            </h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form below and our team will respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Smith"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Your Company Inc."
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your requirements, quantities needed, and any specific certifications required..."
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-background resize-none"
                />
              </div>

              <Button type="submit" className="btn-accent w-full py-6 text-lg font-semibold">
                <Send className="w-5 h-5 mr-2" />
                Request Wholesale Pricing
              </Button>
            </form>
          </div>

          {/* Info Column */}
          <div className="animate-fade-in-right">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Why Choose Us
            </span>
            <h2 className="heading-section text-foreground mb-8">
              Worldwide Shipping
            </h2>

            {/* Feature Cards */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-sm border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Warehouse Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <Image
                src={warehouseImage}
                alt="Warehouse logistics"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-primary-foreground font-semibold">
                  Ready for Dispatch — Your Order Ships Within 48 Hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RFQSection;
