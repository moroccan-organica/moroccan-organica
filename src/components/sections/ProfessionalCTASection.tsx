import Image from "next/image";
import Link from "next/link";

interface ProfessionalCTAData {
  title: string;
  button: string;
  href?: string;
  background: string;
}

const ProfessionalCTASection = ({ data }: { data?: ProfessionalCTAData }) => {
  if (!data) return null;

  const bgSrc = data.background || "/images/about/about-organic-manufacturing-facility.jpg";

  return (
    <section className="relative overflow-hidden text-center text-white -mt-14 md:-mt-20 py-8 md:py-12 min-h-[220px]">
      <div className="absolute inset-0">
        <Image
          src={bgSrc}
          alt={data.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/70" />
      </div>

      <div className="relative z-10 container-main">
        <h3 className="text-xl md:text-2xl font-semibold tracking-wide uppercase mb-4">
          {data.title}
        </h3>
        <Link
          href={data.href || "#contact"}
          className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-md shadow-md transition-colors"
        >
          {data.button}
        </Link>
      </div>
    </section>
  );
};

export default ProfessionalCTASection;
