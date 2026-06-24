import Image, { type StaticImageData } from "next/image";
import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  quote?: string;
  quoteSource?: string;
  image: {
    src: string | StaticImageData;
    alt: string;
    sizes?: string;
  };
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  quote,
  quoteSource,
  image,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={[
        "group flex min-h-90 flex-col overflow-hidden rounded-2xl bg-[#F1F5F9] dark:bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)] p-6 shadow-sm",
        "ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1",
        "hover:shadow-xl hover:shadow-slate-900/10 md:p-8",
        className,
      ].join(" ")}
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl dark:bg-amber-200 bg-[#BDD6FF]">
          <Icon size={24} className="text-[#1A365D]" />
        </div>

        <p className="text-xl font-semibold dark:text-slate-50 text-[#1A365D] md:text-2xl">
          {title}
        </p>

        <p className="text-base leading-relaxed dark:text-slate-300 text-[#475569] md:text-lg">
          {description}
        </p>

        {quote && (
          <p className="mt-auto text-sm italic text-[#94A3B8] md:text-base">
            &quot;{quote}&quot;
            {quoteSource ? ` ${quoteSource}` : ""}
          </p>
        )}
      </div>

      <div className="relative mt-6 min-h-55 overflow-hidden rounded-xl bg-white/60">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={image.sizes ?? "(max-width: 1024px) 100vw, 50vw"}
          className="object-cover object-center transition duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
}