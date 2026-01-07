import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Moroccan Organica - Premium Organic Products from Morocco',
    description: 'Discover authentic Moroccan organic products. Shop natural argan oil, rose water, and traditional beauty products.',
}

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white">
            {/* Header will go here */}
            <main>{children}</main>
            {/* Footer will go here */}
        </div>
    )
}
