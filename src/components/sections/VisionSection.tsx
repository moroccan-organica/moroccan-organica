"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CertificationSlider from "@/components/common/CertificationSlider";

interface VisionData {
  title: string;
  paragraphs: string[];
  image: string;
}

const VisionSection = ({ data }: { data?: VisionData }) => {
  if (!data) return null;

  return (
    <>
      <section className="section-padding bg-muted/30 pt-6 md:pt-8 pb-6 md:pb-8">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Text Content */}
            <div className="space-y-4 text-muted-foreground leading-7 md:leading-8">
              <p className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary">
                {data.title}
              </p>
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
        </div>
      </section>

      <CertificationSlider />
    </>
  );
};

export default VisionSection;
