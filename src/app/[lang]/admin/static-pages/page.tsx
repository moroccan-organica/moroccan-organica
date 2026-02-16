
import { Metadata } from 'next';
import { StaticPagesAdminContent } from "@/features/static-pages/components/StaticPagesAdminContent";

export const metadata: Metadata = {
    title: 'Static Pages | Admin Dashboard',
    description: 'Manage static pages content and translations',
};

export default function StaticPagesPage() {
    return <StaticPagesAdminContent />;
}
