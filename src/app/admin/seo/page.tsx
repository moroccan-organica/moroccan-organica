
import { Metadata } from 'next';
import { SEOPageClient } from './SEOPageClient';

export const metadata: Metadata = {
    title: 'SEO Settings | Admin Dashboard',
    description: 'Manage global SEO settings and localized meta tags',
};

export default function SEOPage() {
    return <SEOPageClient />;
}
