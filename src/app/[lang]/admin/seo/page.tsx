
import { Metadata } from 'next';
import { SEOContent } from "@/features/seo/components/SEOContent";

export const metadata: Metadata = {
    title: 'SEO Settings | Admin Dashboard',
    description: 'Manage global SEO settings and localized meta tags',
};

export default function SEOPage() {
    return <SEOContent />;
}
