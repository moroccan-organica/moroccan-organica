import { AdminLayoutClient } from '@/features/admin/components/AdminLayoutClient'

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params

    return <AdminLayoutClient lang={lang}>{children}</AdminLayoutClient>
}
