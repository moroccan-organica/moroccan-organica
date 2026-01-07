import Image from "next/image";
import { Instagram, Heart, MessageCircle } from "lucide-react";
import instaArgan from "@/assets/insta-argan.jpg";
import instaSaffron from "@/assets/insta-saffron.jpg";
import instaClay from "@/assets/insta-clay.jpg";
import instaHarvest from "@/assets/insta-harvest.jpg";
import instaShipping from "@/assets/insta-shipping.jpg";
import instaLab from "@/assets/insta-lab.jpg";

const posts = [
  { image: instaArgan, likes: 234, comments: 18 },
  { image: instaSaffron, likes: 412, comments: 32 },
  { image: instaClay, likes: 189, comments: 14 },
  { image: instaHarvest, likes: 567, comments: 45 },
  { image: instaShipping, likes: 298, comments: 21 },
  { image: instaLab, likes: 156, comments: 9 },
];

const InstagramSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-primary" />
            <span className="text-2xl font-semibold text-foreground">@marocorganic</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
            Follow Our Journey
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Behind the scenes of sustainable sourcing, from field to shipment
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={post.image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-secondary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-primary-foreground">
                  <Heart className="w-6 h-6 fill-primary-foreground" />
                  <span className="font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground">
                  <MessageCircle className="w-6 h-6 fill-primary-foreground" />
                  <span className="font-semibold">{post.comments}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center mt-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-5 h-5" />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
