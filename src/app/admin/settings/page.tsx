import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    // For now, redirect to SEO settings as they contain the primary global configurations
    redirect(`/admin/seo`);
}
