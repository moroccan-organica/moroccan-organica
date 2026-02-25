"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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

        <div className="mt-12 w-full rounded-2xl bg-white/95 py-6 md:py-8 px-0 md:px-2 shadow-sm overflow-hidden relative">
          <div className="w-full">
            <motion.div
              className="flex flex-nowrap items-center gap-4 sm:gap-5 min-w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            >
              {[
                "/images/slider/1.webp",
                "/images/slider/2.webp",
                "/images/slider/3.webp",
                "/images/slider/4.webp",
                "/images/slider/5.webp",
                "/images/slider/6.webp",
                // duplicate for seamless loop
                "/images/slider/1.webp",
                "/images/slider/2.webp",
                "/images/slider/3.webp",
                "/images/slider/4.webp",
                "/images/slider/5.webp",
                "/images/slider/6.webp",
              ].map((logoSrc, idx) => (
                <div
                  key={`${logoSrc}-${idx}`}
                  className="relative h-14 w-20 sm:h-16 sm:w-24 md:h-20 md:w-28 lg:h-24 lg:w-32 shrink-0"
                >
                  <Image
                    src={logoSrc}
                    alt={`Certification logo ${idx + 1}`}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 128px, 80vw"
                  />
                </div>
              ))}
            </motion.div>
          </div>
          {/* Edge fade to hide cut-off */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
