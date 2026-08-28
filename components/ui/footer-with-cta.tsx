import React from "react";
import Footer from "./footer";
import { Button, Button as FancyButton } from "./button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Section } from "./section";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FooterWithCTA() {
  return (
    <SectionFooterContainer className="flex flex-col">
      <Section className="flex-1">
        <SectionCTA />
      </Section>
      <Footer />
    </SectionFooterContainer>
  );
}

import Gradient88 from "@/app/background/shadergradients/88";
import Image from "next/image";

function SectionFooterContainer({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full h-full min-h-screen rounded-t-3xl md:rounded-t-[50px] overflow-hidden border-t",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="w-full h-full opacity-60">
          <Gradient88 />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
      </div>
      {children}
    </div>
  );
}

function SectionCTA() {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-40 z-10">
      <div className="flex flex-col">
        <h2 className="text-left text-4xl md:text-5xl lg:text-6xl font-semibold max-w-4xl">
          <Image
            src="https://orionhost.xyz/images/brand/orion-logo.png"
            alt="Orion Hosting"
            width={48}
            height={48}
            className="inline-block mr-2 rounded-lg"
          />{" "}
          Meet Orion Hosting. <br /> By{" "}
          <Link href="https://vocal.dev" className="underline">
            Vocal
          </Link>{" "}
          x{" "}
          <Link href="https://octara.xyz" className="underline">
            Octara
          </Link>
          .
        </h2>
        <div className="flex gap-4 mt-12 md:mt-20">
          <Link href={"https://orionhost.xyz"}>
            <FancyButton className="flex gap-2 group">
              <span>Get Started</span>
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </FancyButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
