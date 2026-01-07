import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-e border-gray-200 min-h-screen">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
                        <p className="text-sm text-gray-600 mt-1">Moroccan Organica</p>
                    </div>
                    <nav className="px-4">
                        <a
                            href="/admin"
                            className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors mb-1"
                        >
                            Dashboard
                        </a>
                        <a
                            href="/admin/products"
                            className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors mb-1"
                        >
                            Products
                        </a>
                        <a
                            href="/admin/orders"
                            className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors mb-1"
                        >
                            Orders
                        </a>
                        <a
                            href="/admin/categories"
                            className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors mb-1"
                        >
                            Categories
                        </a>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    )
}
