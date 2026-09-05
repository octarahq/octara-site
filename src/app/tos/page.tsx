"use client";

import { HeroBackground } from "@/app/(home)/_components/hero";
import { motion } from "motion/react";
import Link from "next/link";

export default function TermsPage() {
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
              Terms of Use
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
                These Terms of Use (&quot;Terms&quot;) apply to your access to
                and use of services, websites, and applications provided by
                Octara (or OctaraHQ) (&quot;we&quot;, &quot;us&quot;,
                &quot;our&quot;). By using our services you agree to these
                Terms. If you do not agree, do not use our services.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                1. Use of services
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                You may use our services only for lawful purposes and in
                accordance with these Terms. We may impose additional rules for
                specific products or features.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                2. Accounts
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                When you create an account, you agree to provide accurate
                information and to keep your credentials secure. You are
                responsible for all activity under your account.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                3. Intellectual property
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                All content provided by Octara is protected by intellectual
                property laws. You may not reproduce or redistribute our content
                without permission, except as permitted by applicable law or a
                written license.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                4. User content
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                If you submit content to our services, you grant Octara a
                worldwide, royalty-free, transferable license to use, reproduce,
                and display that content as necessary to provide the service.
                You are responsible for the content you post.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                5. Prohibited conduct
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                You must not use our services to engage in unlawful activity,
                infringe others&apos; rights, transmit malware, or otherwise
                interfere with the operation of our services.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                6. Disclaimers and limitation of liability
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed uppercase">
                OUR SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot;. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE
                LAW, OCTARA DISCLAIMS ALL WARRANTIES. OCTARA&quot;S LIABILITY IS
                LIMITED TO THE EXTENT PERMITTED BY LAW.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                7. Termination
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                We may suspend or terminate access to services for violations of
                these Terms or for other legitimate reasons. Termination does
                not limit other remedies available to us.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                8. Governing law
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                These Terms are governed by the laws applicable where Octara
                operates, subject to mandatory local consumer protections. Any
                disputes will be resolved in accordance with those laws.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-white"></div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                9. Changes
              </h2>
            </div>
            <div className="pl-5 border-l border-zinc-800">
              <p className="text-base leading-relaxed">
                We may modify these Terms from time to time. We will post
                changes with an updated effective date. Continued use of the
                services after changes constitutes acceptance of the updated
                Terms.
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
                For questions about these Terms, contact us in our discord
                server.
              </p>
            </div>
          </section>

          <div className="mt-16 p-8 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-lg font-bold">
                Questions about these terms?
              </h3>
              <p className="text-zinc-400">
                We are here to help you understand your rights.
              </p>
            </div>
            <Link
              href="/api/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
