"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/parallax";

import arganOil from "@/assets/argan-oil.jpg";
import saffron from "@/assets/saffron.jpg";
import ghassoulClay from "@/assets/ghassoul-clay.jpg";
import indigo from "@/assets/indigo.jpg";
import warehouse from "@/assets/warehouse.jpg";
import bulkIngredients from "@/assets/bulk-ingredients.jpg";
import { StaticImageData } from "next/image";

// Images mapping
const images = [arganOil, saffron, ghassoulClay, indigo, warehouse, bulkIngredients];

interface ProductCategoryCarouselProps {
  dict: any;
}

const ProductCategoryCarousel = ({ dict }: ProductCategoryCarouselProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const content = dict.categories;
  // Merge images with content items
  const categories = content.items.map((item: any, i: number) => ({
    ...item,
    image: images[i] || images[0]
  }));

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className="py-20 md:py-28 bg-cream-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm uppercase tracking-[0.3em] text-[#2C3E2E]/60 mb-3 block">
              {content.badge}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#2C3E2E] tracking-tight">
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
              className={`w-12 h-12 rounded-full border border-[#2C3E2E]/20 flex items-center justify-center transition-all duration-300 ${isBeginning
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#2C3E2E] hover:border-[#2C3E2E] hover:text-white cursor-pointer"
                }`}
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5 text-[#2C3E2E] transition-colors" />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              disabled={isEnd}
              className={`w-12 h-12 rounded-full border border-[#2C3E2E]/20 flex items-center justify-center transition-all duration-300 ${isEnd
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#2C3E2E] hover:border-[#2C3E2E] hover:text-white cursor-pointer"
                }`}
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5 text-[#2C3E2E] transition-colors" />
            </button>
          </motion.div>
        </div>

        {/* Swiper Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="cursor-grab active:cursor-grabbing"
        >
          <Swiper
            modules={[Parallax, Navigation]}
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
            parallax={true}
            speed={800}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 28,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 36,
              },
            }}
            className="!overflow-visible"
          >
            {categories.map((category: any, index: number) => (
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
          {categories.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => swiperInstance?.slideTo(index)}
              className={`h-1 rounded-full transition-all duration-500 ${index === activeIndex
                ? "w-8 bg-[#2C3E2E]"
                : "w-2 bg-[#2C3E2E]/20 hover:bg-[#2C3E2E]/40"
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
      {/* Card Container - 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#2C3E2E]/5">
        {/* Image with Parallax Effect */}
        <div
          data-swiper-parallax="-20%"
          className="absolute inset-0 w-full h-full"
        >
          <motion.img
            src={typeof category.image === 'string' ? category.image : category.image.src}
            alt={category.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {/* Subtitle */}
          <motion.span
            className="text-white/70 text-xs uppercase tracking-[0.2em] mb-2"
            animate={{
              opacity: isHovered ? 1 : 0.7,
              y: isHovered ? 0 : 4,
            }}
            transition={{ duration: 0.4 }}
          >
            {category.subtitle}
          </motion.span>

          {/* Title */}
          <h3 className="font-serif text-2xl md:text-3xl text-white font-light tracking-wide">
            {category.title}
          </h3>

          {/* Explore Link - Appears on Hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
            className="mt-4"
          >
            <a
              href="#products"
              className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-wider group/link"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-white after:origin-left after:scale-x-0 group-hover/link:after:scale-x-100 after:transition-transform after:duration-300">
                Explore
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </a>
          </motion.div>
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

export default ProductCategoryCarousel;
