import { Providers } from "@/app/providers";
import "../globals.css";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Providers lang="en">
                    {children}
                </Providers>
            </body>
        </html>
    );
}
