"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Truck, Clock, ShieldCheck, Send, DollarSign, PackageCheck, Award } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: any;
}

const RFQSection = ({ data, aboutData }: { data: any; aboutData: any }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Organic Virgin",
    liters: "",
    destination: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you! We will contact you within 24 hours.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const featureIcons = [DollarSign, PackageCheck, Award, Truck];

  const features = data.features.map((f: any, i: number) => ({
    ...f,
    icon: featureIcons[i] || Truck
  }));

  return (
    <section id="contact" className="section-padding bg-muted">
      <div className="container-main">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h2 className="heading-section text-foreground">
            {aboutData.title} <span className="text-primary">{aboutData.highlight}</span>
          </h2>
        </div>

        {/* Two Column Layout: Form + About */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16 items-start">
          {/* Left: Quote Form */}
          <div>
            <div className="bg-card rounded-2xl p-8 shadow-card sticky top-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">{data.form?.title || "Get Quick Quote"}</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{data.form?.name || "Your Name"}</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={data.form?.name || "Your Name"}
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="email">{data.form?.email || "Email"}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={data.form?.email || "Email"}
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{data.form?.phone || "Phone"}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={data.form?.phone || "Phone"}
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="type">{data.form?.type || "Type"}</Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Organic Virgin">Organic Virgin</option>
                      <option value="Deodorized">Deodorized</option>
                      <option value="Culinary">Culinary</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liters">{data.form?.quantity || "Quantity"}</Label>
                    <Input
                      id="liters"
                      name="liters"
                      type="number"
                      placeholder="Liters"
                      required
                      value={formData.liters}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">{data.form?.destination || "Destination"}</Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Country / City"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{data.form?.message || "Your Message"}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={data.form?.message || "Your Message Here..."}
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-background resize-none"
                  />
                </div>

                <button type="submit" className="btn-accent w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90">
                  {data.form?.submit || "Send"}
                </button>
              </form>
            </div>
          </div>

          {/* Right: About Content */}
          <div className="lg:pt-4">
            <div
              className="text-body text-muted-foreground mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutData.description }}
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="text-3xl font-bold text-primary mb-1">
                  {aboutData.stats?.customers?.value || "+180"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {aboutData.stats?.customers?.label || "Happy Customer."}
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-3xl font-bold text-primary mb-1">
                  {aboutData.stats?.orders?.value || "+375"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {aboutData.stats?.orders?.label || "Order Done."}
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-3xl font-bold text-primary mb-1">
                  {aboutData.stats?.labels?.value || "+462"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {aboutData.stats?.labels?.label || "Private Label."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Info Column */}
          <div className="animate-fade-in-right -mt-2">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature: Feature, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse Image */}
          <div className="relative animate-fade-in-left -mt-24">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <Image
                src={data.image}
                alt="Warehouse logistics"
                width={800}
                height={400}
                className="w-full h-64 object-cover"
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
