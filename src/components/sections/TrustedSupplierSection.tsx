"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/parallax";

import { StaticImageData } from "next/image";

interface CategoryItem {
  image: string | StaticImageData;
  title: string;
  subtitle: string;
}

interface TrustedSupplierContent {
  badge: string;
  title: string;
  items: CategoryItem[];
}

interface ProductCategoryCarouselProps {
  data: TrustedSupplierContent;
}

const TrustedSupplierSection = ({ data }: ProductCategoryCarouselProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const content = data;
  const categories: CategoryItem[] = content.items;

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className="pt-6 md:pt-10 pb-12 md:pb-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm uppercase tracking-[0.3em] text-primary/60 mb-3 block">
              {content.badge}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-primary tracking-tight">
              {content.title}
            </h2>
          </motion.div>

          {/* Custom Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-3 mt-8 md:mt-0"
          >
            <button
              onClick={() => swiperInstance?.slidePrev()}
              disabled={isBeginning}
              className={`w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center transition-all duration-300 ${isBeginning
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-primary hover:border-primary hover:text-white cursor-pointer"
                }`}
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5 text-primary transition-colors" />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              disabled={isEnd}
              className={`w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center transition-all duration-300 ${isEnd
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-primary hover:border-primary hover:text-white cursor-pointer"
                }`}
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5 text-primary transition-colors" />
            </button>
          </motion.div>
        </div>

        {/* Swiper Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Swiper
            modules={[Parallax, Navigation, Autoplay]}
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
            parallax={true}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4.5,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 5.5,
                spaceBetween: 28,
              },
              1536: {
                slidesPerView: 6,
                spaceBetween: 28,
              },
            }}
            className="overflow-visible!"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <CategoryCard category={category} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center gap-2 mt-10 md:mt-14"
        >
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperInstance?.slideTo(index)}
              className={`h-1 rounded-full transition-all duration-500 ${index === activeIndex
                ? "w-8 bg-primary"
                : "w-2 bg-primary/20 hover:bg-primary/40"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  category: {
    image: string | StaticImageData;
    title: string;
    subtitle: string;
  };
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container - 4:5 Aspect Ratio for slightly smaller look */}
      <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-card shadow-md transition-all duration-300 group-hover:shadow-2xl border border-primary/10">
        {/* Image - Standard Cover */}
        <div
          className="absolute inset-0 w-full h-full"
        >
          <motion.img
            src={typeof category.image === 'string' ? category.image : category.image.src}
            alt={category.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Content Box - Glassmorphic Bottom Panel */}
        <div className="absolute bottom-0 left-0 w-full bg-card/95 backdrop-blur-sm border-t border-primary/5 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-end justify-between gap-2">
            <div>
              {/* Subtitle */}
              <span className="block text-primary/60 text-[10px] uppercase tracking-[0.2em] mb-1 line-clamp-1">
                {category.subtitle}
              </span>

              {/* Title */}
              <h3 className="font-serif text-lg md:text-xl text-primary leading-tight line-clamp-1">
                {category.title}
              </h3>
            </div>

            {/* Hover Arrow */}
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Decorative Corner Accent */}
        <motion.div
          className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/30"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default TrustedSupplierSection;
