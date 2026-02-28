import { redirect } from "next/navigation";

export default async function BenefitsRedirect({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(`/${lang}/organica/Benefits-Using-Natural-Beauty-Products`);
}
