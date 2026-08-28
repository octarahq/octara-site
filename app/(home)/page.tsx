"use client";

import Hero, { HeroBackground } from "@/app/(home)/_components/hero";
import Stats from "@/app/(home)/_components/stats";
import { Section } from "@/components/ui/section";
import { motion } from "motion/react";
import Projects from "./_components/projects";

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
        <Section
          container
          className="overflow-visible flex flex-col gap-12 md:gap-24 pb-24 md:pb-40"
        >
          <Hero />
          <Stats />
          <Projects />
        </Section>
      </div>
    </main>
  );
}
