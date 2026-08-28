"use client";

import { motion } from "motion/react";
import { HeroBackground } from "./_components/hero";
import Hero from "./_components/hero";
import { Section } from "@/components/ui/section";
import Story from "./_components/story";
import Mission from "./_components/mission";
import Values from "./_components/values";

export default function AboutPage() {
  return (
    <main>
      <div className="w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 20 }}
          transition={{ duration: 5, ease: "easeOut" }}
          className="absolute -z-10 inset-0 flex items-center justify-center"
        >
          <HeroBackground />
        </motion.div>
        <Section
          container
          className="overflow-visible flex flex-col gap-12 md:gap-24 pb-24 md:pb-40"
        >
          <Hero />
          <Story />
          <Mission />
          <Values />
        </Section>
      </div>
    </main>
  );
}
