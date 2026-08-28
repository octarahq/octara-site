import { motion } from "motion/react";
import { BadgeCheck, Lightbulb, Globe, Leaf } from "lucide-react";

const values = [
  {
    title: "Integrity",
    icon: BadgeCheck,
    description:
      "We act with transparency and honesty in every project we deliver.",
  },
  {
    title: "Innovation",
    icon: Lightbulb,
    description:
      "We constantly explore new frontiers.",
  },
  {
    title: "Open Source",
    icon: Globe,
    description:
      "We strive to promote and contribute to the development of open source software.",
  },
  {
    title: "Impact",
    icon: Leaf,
    description:
      "Every project should contribute positively to society.",
  },
];

export default function Values() {
  return (
    <div className="w-full mt-24">
      <div className="flex flex-col gap-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Values
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These core principles guide our work and our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col p-6 md:p-8 rounded-2xl border border-primary/10 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-500" />

                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-semibold">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
