import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function WhyJoin() {
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
            <Sparkles className="w-4 h-4" />
            <span>Join the Movement</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Why Join{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Octara?
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            Octara is currently a self-funded, community-centered project. We
            are looking for people who believe in free access to technology and
            want to bring their skills to a growing ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <Alert className="relative overflow-hidden border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="mt-1">
                <InfoIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <AlertTitle className="text-lg font-semibold mb-2">
                  Important Information
                </AlertTitle>
                <AlertDescription className="text-sm md:text-base leading-relaxed text-muted-foreground">
                  All positions currently listed are voluntary and unpaid. We
                  are building the foundation together with a long-term vision
                  of sustainability for everyone. If Octara ever becomes a true
                  economic entity, everyone who contributed to Octara&apos;s
                  development—regardless of role—will be offered a reward, such
                  as access to additional services provided for free compared to
                  others.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </motion.div>
      </div>
    </div>
  );
}
