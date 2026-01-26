
import { Metadata } from 'next';
import { StaticPagesClient } from './StaticPagesClient';

export const metadata: Metadata = {
    title: 'Static Pages | Admin Dashboard',
    description: 'Manage static pages content and translations',
};

export default function StaticPagesPage() {
    return <StaticPagesClient />;
}
