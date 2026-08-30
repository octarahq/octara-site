"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OctaraLogo from "./OctaraLogo";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "./avatar";

const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    aria-label="Menu"
    className={cn("pointer-events-none", className)}
    fill="none"
    height={16}
    role="img"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={16}
    xmlns="http://www.w3.org/2000/svg"
    {...(props as React.SVGProps<SVGSVGElement>)}
  >
    <path
      className="origin-center -translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
      d="M4 12L20 12"
    />
    <path
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
      d="M4 12H20"
    />
    <path
      className="origin-center translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
      d="M4 12H20"
    />
  </svg>
);

export interface NavbarNavLink {
  href: string;
  label: string;
  active?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarNavLink[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
}

const defaultNavigationLinks: NavbarNavLink[] = [
  { href: "/", label: "Home", active: true },
  { href: "/status", label: "Status" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
];

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo = <OctaraLogo size="lg" />,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      signInText = "Login",
      signInHref = "/login",
      ctaText = "Sign Up",
      ctaHref = "/signup",
      ...props
    },
    ref,
  ) => {
    const path = usePathname();
    const { isAuthenticated, user, logout } = useAuth();
    navigationLinks = navigationLinks.map((link) => ({
      ...link,
      active: link.href === path,
    }));
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768);
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 md:px-8",
          className,
        )}
        ref={combinedRef}
        {...(props as React.HTMLAttributes<HTMLElement>)}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-6 md:gap-8">
            {isMobile && (
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                      size="icon"
                      variant="ghost"
                    />
                  }
                >
                  <HamburgerIcon />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-2">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-1">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem className="w-full" key={index}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline",
                              link.active
                                ? "bg-accent/50 text-foreground font-semibold"
                                : "text-foreground/70",
                            )}
                            onClick={(e) => e.preventDefault()}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}

            <Link
              type="button"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
              href={logoHref}
            >
              <div className="flex items-center justify-center">{logo}</div>
              <span className="hidden font-bold text-xl sm:inline-block tracking-tight">
                Octara
              </span>
            </Link>

            {!isMobile && (
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <Link
                        type="button"
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-foreground focus:bg-accent focus:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer no-underline",
                          link.active
                            ? "bg-accent/40 text-foreground"
                            : "text-foreground/70 hover:text-foreground",
                        )}
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium hidden sm:inline-block">
                  {user.username}
                </span>
                <Popover>
                  <PopoverTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 ring-offset-background hover:opacity-90 transition-opacity">
                    <Avatar username={user.username} size={36} />
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48 p-2 mt-2">
                    <div className="flex flex-col gap-1">
                      <div className="px-2 py-1.5 text-sm font-medium sm:hidden">
                        {user.username}
                      </div>
                      <div className="h-px bg-border/50 sm:hidden my-1" />
                      <Link href="/account" className="w-full">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-foreground/80 hover:text-foreground"
                        >
                          My Account
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground/80 hover:text-foreground"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex text-sm font-medium text-foreground/80 hover:text-foreground"
                >
                  <Link href={signInHref}>{signInText}</Link>
                </Button>
                <Button
                  size="sm"
                  className="text-sm font-medium px-5 h-9 rounded-full shadow-sm"
                >
                  <Link href={ctaHref}>{ctaText}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  },
);

Navbar.displayName = "Navbar";

export { HamburgerIcon };
