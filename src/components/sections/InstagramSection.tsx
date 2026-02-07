import { Instagram } from "lucide-react";

interface InstagramData {
  handle: string;
  title: string;
  description: string;
  cta: string;
}

const InstagramSection = ({ data }: { data?: InstagramData }) => {
  if (!data) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-primary" />
            <span className="text-2xl font-semibold text-foreground">{data.handle}</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
            {data.title}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Instagram Grid (LightWidget) */}
        <div className="w-full max-w-[1240px] mx-auto">
          <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
          <iframe
            suppressHydrationWarning
            src="https://cdn.lightwidget.com/widgets/d21c5ef5d980559590b3caaa76cdfb02.html"
            scrolling="no"
            // @ts-ignore
            allowtransparency="true"
            className="lightwidget-widget w-full border-0 overflow-hidden"
            style={{ width: '100%', border: 0, overflow: 'hidden' }}
          ></iframe>
        </div>

        {/* Follow Button */}
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/moroccanorganic/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
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
