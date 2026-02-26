"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, PackageCheck } from "lucide-react";

interface RFQFormContent {
  title?: string;
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  quantity?: string;
  destination?: string;
  message?: string;
  submit?: string;
}

interface RFQContent {
  form?: RFQFormContent;
  features: Array<{ title: string; description: string }>;
  successTitle?: string;
  successMessage?: string;
  sendAnother?: string;
  productTypes?: Record<string, string>;
  image: string;
  readyDispatch?: string;
}

interface AboutContent {
  title: string;
  highlight: string;
  description: string;
  stats?: Record<string, { value: string; label: string }>;
}

const RFQSection = ({ data, aboutData }: { data: RFQContent; aboutData: AboutContent }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Organic Virgin",
    liters: "",
    destination: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        // Format the message to include the extra fields from this specific form
        company: "Not Provided (RFQ Form)", // or add a company field if needed
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
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="section-padding bg-muted pt-2 md:pt-4">
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
              <p className="text-xl font-semibold text-foreground mb-6">{data.form?.title || "Get Quick Quote"}</p>

              {isSuccess ? (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <PackageCheck className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold text-foreground mb-2">{data.successTitle || "Quote Request Sent!"}</p>
                  <p className="text-sm text-muted-foreground mb-4">{data.successMessage || "We'll get back to you with a quote within 24 hours."}</p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {data.sendAnother || "Send Another Request"}
                  </Button>
                </div>
              ) : (
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
                        <option value="Organic Virgin">{data.productTypes?.["Organic Virgin"] || "Organic Virgin"}</option>
                        <option value="Deodorized">{data.productTypes?.["Deodorized"] || "Deodorized"}</option>
                        <option value="Culinary">{data.productTypes?.["Culinary"] || "Culinary"}</option>
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-accent w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        {data.form?.submit || "Send Request"}
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
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
                <p className="text-3xl font-bold text-primary mb-1">
                  {aboutData.stats?.customers?.value || "+180"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {aboutData.stats?.customers?.label || "Happy Customer."}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">
                  {aboutData.stats?.orders?.value || "+375"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {aboutData.stats?.orders?.label || "Order Done."}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">
                  {aboutData.stats?.labels?.value || "+462"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {aboutData.stats?.labels?.label || "Private Label."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Removed image block per request */}
      </div>
    </section>
  );
};

export default RFQSection;
