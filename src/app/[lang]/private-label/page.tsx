import { redirect } from "next/navigation";
import { getLocalizedHref } from "@/lib/utils";

export default async function PrivateLabelRedirect({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(getLocalizedHref('/organica/argan-oil-private-label-manufacturer', lang));
}
