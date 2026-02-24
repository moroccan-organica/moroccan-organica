import Image from "next/image";

interface VisionData {
  title: string;
  paragraphs: string[];
  image: string;
}

const VisionSection = ({ data }: { data?: VisionData }) => {
  if (!data) return null;

  return (
    <section className="section-padding bg-muted/30 pt-6 md:pt-8 pb-6 md:pb-8">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Text Content */}
          <div className="space-y-4 text-muted-foreground leading-7 md:leading-8">
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary">
              {data.title}
            </h3>
            {data.paragraphs?.map((para, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
            ))}
          </div>

          {/* Image Side */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-card min-h-[260px]">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 480px, 100vw"
              priority
            />
          </div>
        </div>

        <div className="mt-12 w-full rounded-2xl bg-white/95 py-6 md:py-8 px-4 md:px-6 shadow-sm overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-nowrap items-center justify-between gap-3 md:gap-5 lg:gap-6">
            {[
              "/images/slider/1.webp",
              "/images/slider/2.webp",
              "/images/slider/3.webp",
              "/images/slider/4.webp",
              "/images/slider/5.webp",
              "/images/slider/6.webp",
            ].map((logoSrc, idx) => (
              <div
                key={logoSrc}
                className="relative h-24 w-32 md:h-24 md:w-36 lg:h-28 lg:w-40 shrink-0"
              >
                <Image
                  src={logoSrc}
                  alt={`Certification logo ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 128px, 24vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
