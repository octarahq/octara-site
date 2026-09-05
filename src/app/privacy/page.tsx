"use client";

import { HeroBackground } from "@/app/(home)/_components/hero";
import { motion } from "motion/react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen relative bg-[#0a0a0a] text-zinc-50 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="absolute inset-x-0 top-0 z-0 pointer-events-none opacity-40 h-200 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}
      >
        <HeroBackground />
      </motion.div>

      <div className="relative z-10 container mx-auto px-6 py-24 max-w-4xl flex flex-col">
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-zinc-400 text-base font-medium">
              Effective date: 2026-08-32
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-12 text-zinc-300">
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                Introduction
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                Octara (or OctaraHQ) (&quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;) is committed to protecting the privacy of
                visitors and users of our websites, applications, and services
                worldwide. This Privacy Policy explains what information we
                collect, how we use it, when we share it, and the rights
                available to you.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                1. Information we collect
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                We may collect: (a) information you provide directly (for
                example, contact form or account details); (b) usage information
                (analytics, logs, and interaction data); and (c) technical data
                (device, browser, IP address, and cookies). We minimize data
                collection and only keep what is necessary to provide and
                improve our services.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                2. How we use information
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                We use data to provide and maintain services, respond to
                requests, improve features, secure our systems, and communicate
                important updates. Where required, we rely on legitimate
                interests, contract performance, or consent as legal bases for
                processing.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                3. Sharing and disclosure
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                We may share information with service providers who perform
                services on our behalf, with affiliates, or when required by
                law. We do not sell personal data to third parties. We take
                contractual and technical measures to protect data shared with
                processors.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                4. Cookies and similar technologies
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                We use cookies and similar technologies for functionality,
                analytics, and to improve user experience. You can control
                cookie preferences through your browser and, where provided,
                site controls.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                5. International transfers
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                Octara operates globally. Personal data may be transferred and
                processed in countries with different data protection laws. When
                transferring data internationally, we use appropriate safeguards
                such as contracts or other mechanisms permitted by law.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                6. Data retention and security
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                We retain personal data only as long as necessary for the
                purposes described. We use reasonable technical and
                organizational measures to protect personal data, but no system
                is completely secure — exercise care when sharing sensitive
                information.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                7. Your rights
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                Subject to local law, you may have the right to access, correct,
                delete, or restrict processing of your personal data, or to
                object to processing. To exercise rights, contact us using the
                details below.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                8. Children
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                Our services are not directed at children under 16. We do not
                knowingly collect personal data from children. If you believe we
                have collected data from a child, please contact us to request
                deletion.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                9. Changes to this policy
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                We may update this policy from time to time. We will post the
                revised policy with an updated effective date. Continued use of
                our services after changes constitutes acceptance of the updated
                policy.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                10. Contact
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                For questions or to exercise your rights, contact us in our
                discord server.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
