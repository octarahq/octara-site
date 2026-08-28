"use client";

import Hero, { HeroBackground } from "@/app/(home)/_components/hero";
import { Section } from "@/components/ui/section";
import { motion } from "motion/react";

export default function Home() {
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
        <Section container className="overflow-visible">
          <Hero />
        </Section>
      </div>
    </main>
  );
}
