"use client";
import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

import maps from "@/public/www/home/octaramaps.jpg";
import trainflow from "@/public/www/home/trainflow.jpg";
import orion from "@/public/www/home/orionhosting.png";
import search from "@/public/www/home/octarasearch.png";

const categories = [
  "Trainflow",
  "Orion Hosting",
  "Octara Maps",
  "Octara Search" /*"Onyx Bot"*/,
];

const images = {
  Trainflow: trainflow,
  "Orion Hosting": orion,
  "Octara Maps": maps,
  "Octara Search": search,
  //   "Onyx Bot": null,
};

export default function Projects() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const index = current - 1;

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const initialTimer = setTimeout(
      () => setCurrent(api.selectedScrollSnap() + 1),
      0,
    );

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);

    return () => {
      clearTimeout(initialTimer);
      api.off("select", onSelect);
    };
  }, [api]);

  const img = images[categories[index] as keyof typeof images];

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-10">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-52 md:w-64 overflow-visible"
      >
        <CarouselContent>
          {categories.map((item, i) => (
            <CarouselItem
              key={i}
              onClick={() => {
                api?.scrollTo(i, false);
              }}
            >
              <Trigger label={item} selected={index === i} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full max-w-5xl mx-auto px-4 flex items-center justify-center overflow-hidden">
        {img && (
          <BigImageContainer key={index} src={img} alt={categories[index]} />
        )}
      </div>
    </div>
  );
}

function BigImageContainer({
  alt = "",
  ...props
}: React.ComponentProps<typeof Image>) {
  return (
    <motion.div
      className="relative h-full rounded-xl border shadow overflow-hidden flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Image {...props} alt={alt} className="w-auto h-full object-contain" />
    </motion.div>
  );
}

function Trigger({
  label,
  selected,
}: {
  label: React.ReactNode;
  selected?: boolean;
}) {
  return (
    <div
      data-selected={selected}
      className={cn(
        "text-sm md:text-base rounded-lg bg-background flex py-3 md:py-4 items-center justify-center transition-all group select-none cursor-pointer",
        selected
          ? "bg-white dark:bg-slate-950 dark:text-white text-black border border-slate-100 dark:border-slate-700 shadow-md shadow-slate-200 dark:shadow-none"
          : "bg-transparent text-muted-foreground",
      )}
    >
      <span className="text-center ">{label}</span>
    </div>
  );
}
