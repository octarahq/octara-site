import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import OctaraLogo from "./OctaraLogo";

export default function Footer() {
  return (
    <footer className="w-full px-4 md:px-6 lg:px-8 py-12 container mx-auto">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="flex flex-col items-start gap-4">
              <Link href="/home" className="flex items-center gap-2">
                <OctaraLogo className="w-8 h-8" />
                <h3 className="text-2xl font-bold tracking-tight">Octara</h3>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm">
                Open source tools and community for everyone.
              </p>
            </div>
            <div className="flex gap-4 mt-8 lg:mt-0">
              <Link
                href="https://github.com/octarahq"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <GitHubLogoIcon className="size-5" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <Link
              href="/status"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Status
            </Link>
            <Link
              href="/changelog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Changelog
            </Link>
            <Link
              href="/careers"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Careers
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About Octara
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Octara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
