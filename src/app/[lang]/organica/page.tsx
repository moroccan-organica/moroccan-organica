import { redirect } from "next/navigation";
import { getLocalizedHref } from "@/lib/utils";

export default async function CatalogueRedirect({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(getLocalizedHref('/organica/essential-oils-wholesale-suppliers', lang));
}
