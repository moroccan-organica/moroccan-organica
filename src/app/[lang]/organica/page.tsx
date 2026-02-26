import { redirect } from "next/navigation";

export default async function CatalogueRedirect({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(`/${lang}/organica/essential-oils-wholesale-suppliers`);
}
