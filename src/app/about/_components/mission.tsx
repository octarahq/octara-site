import { motion } from "motion/react";
import { Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Mission() {
  return (
    <div className="w-full mt-12 md:mt-24">
      <div className="flex flex-col md:flex-row-reverse gap-8 lg:gap-16 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Users className="w-4 h-4" />
            <span>Our Mission</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            What drives{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              us
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            Make computing accessible to all, without barriers, while respecting
            privacy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <Alert className="relative overflow-hidden border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="mt-1">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <AlertTitle className="text-lg font-semibold mb-2">
                  Team Meeting
                </AlertTitle>
                <AlertDescription className="text-sm md:text-base leading-relaxed text-muted-foreground">
                  We believe that technology shouldn&apos;t be a privilege. It
                  is a tool for empowerment. By fostering a collaborative
                  environment, we aim to share knowledge and create a safe
                  digital space for everyone.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </motion.div>
      </div>
    </div>
  );
}
