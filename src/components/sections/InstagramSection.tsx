"use client";

import { useRef } from "react";
import Image from "next/image";
import { Instagram, Play, Heart, ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { instagramPosts } from "@/data/instagram";

interface InstagramData {
  handle: string;
  title: string;
  description: string;
  cta: string;
}

const InstagramSection = ({ data }: { data?: InstagramData }) => {
  const plugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  if (!data) return null;

  return (
    <section className="section-padding bg-background pt-0 md:pt-2 pb-8 md:pb-12 overflow-hidden">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <a
            href="https://www.instagram.com/moroccanorganic/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 mb-3 group hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Instagram className="w-5 h-5" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              {data.handle}
            </span>
          </a>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl mx-auto">
              {data.description}
            </p>
          )}
        </div>

        {/* Native Responsive Instagram Slider */}
        <div className="w-full max-w-[1280px] mx-auto relative px-2 sm:px-8">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full select-none"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {instagramPosts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="pl-3 md:pl-4 basis-[72%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-4/5 w-full overflow-hidden rounded-2xl bg-muted/40 border border-border/60 shadow-xs hover:shadow-xl transition-all duration-300"
                  >
                    {/* Post Image */}
                    <Image
                      src={post.image}
                      alt={post.caption}
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    />

                    {/* Subtle Permanent Gradient for Badges */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 via-black/10 to-transparent pointer-events-none" />

                    {/* Badge: Reel or Post (Always visible top-right) */}
                    <div className="absolute top-3 right-3 z-10">
                      {post.type === "reel" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
                          <Play className="w-3 h-3 fill-white text-white" />
                          Reel
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Likes Counter */}
                      {post.likes && (
                        <div className="flex items-center gap-1.5 text-xs text-white/95 font-medium mb-1.5">
                          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                          <span>{post.likes}</span>
                        </div>
                      )}

                      {/* Caption */}
                      <p className="text-xs text-white/90 line-clamp-2 leading-relaxed mb-3">
                        {post.caption}
                      </p>

                      {/* Action Pill */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors w-fit shadow-md">
                        <Instagram className="w-3.5 h-3.5 text-pink-600" />
                        {post.type === "reel" ? "Watch Reel" : "View Post"}
                        <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                      </span>
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious className="left-1 sm:-left-3 md:-left-5 bg-background/90 backdrop-blur-md shadow-md border-border/80 hover:bg-background text-foreground h-9 w-9 md:h-10 md:w-10 z-30" />
            <CarouselNext className="right-1 sm:-right-3 md:-right-5 bg-background/90 backdrop-blur-md shadow-md border-border/80 hover:bg-background text-foreground h-9 w-9 md:h-10 md:w-10 z-30" />
          </Carousel>
        </div>

        {/* Follow CTA Button */}
        <div className="text-center mt-8 md:mt-10">
          <a
            href="https://www.instagram.com/moroccanorganic/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-linear-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Instagram className="w-5 h-5" />
            {data.cta}
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
