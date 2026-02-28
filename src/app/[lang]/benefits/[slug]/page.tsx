import { redirect } from "next/navigation";

export default async function BenefitPostRedirect({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    redirect(`/${lang}/organica/${slug}`);
}
