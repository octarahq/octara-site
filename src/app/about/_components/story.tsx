import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

export default function Story() {
  return (
    <div className="w-full mt-12 md:mt-24">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            <span>Our Story</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            How we{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              started
            </span>
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            <p>
              Founded in 2023 under the name LMC Group, Octara started as a help community for IT assistance. Our initial goal was to support new developers in their projects.
            </p>
            <p>
              Over the years, we grew by creating LMC Bot which expanded our community, and then diversified by branching into other domains.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
