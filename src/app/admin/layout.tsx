import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'
import { Providers } from "@/app/providers";
import "../globals.css";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Providers lang="en">
                    <AdminLayoutClient lang="en">
                        {children}
                    </AdminLayoutClient>
                </Providers>
            </body>
        </html>
    );
}
