import { motion } from "motion/react";
import { Users, Code, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const roles = [
  {
    title: "Community Manager",
    icon: Users,
    description:
      "Help us spread the word about Octara! You will be in charge of engaging the community, communicating our progress, and promoting our projects across various platforms.",
    tags: ["Communication", "Social Media"],
  },
  {
    title: "Developer",
    icon: Code,
    description:
      "Join the technical team to contribute directly to the codebase. Whether it's on the frontend, backend, or infrastructure, your skills will help us build a robust ecosystem.",
    tags: ["Golang", "Next.js", "GitHub"],
  },
];

export default function Positions() {
  return (
    <div className="w-full mt-24">
      <div className="flex flex-col gap-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Open{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Positions
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our volunteer opportunities and help us shape the future of
            Octara.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between p-6 md:p-8 rounded-2xl border border-primary/10 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-500" />

                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-semibold">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {role.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-primary/5 text-primary/80 rounded-full border border-primary/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/50">
                  <Link
                    href={"/api/discord"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="secondary"
                      className="border-none shadow-none bg-transparent"
                      size={"xl"}
                    >
                      Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
