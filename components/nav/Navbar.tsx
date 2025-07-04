"use client";

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { HoverGradient } from "../HoverGradient";
import Link from "next/link";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type SocialMediaLink = {
  url: string;
  icon: React.ReactNode;
};

type NavLink = {
  url: string;
  title: string;
  subMenuLinks?: NavLink[];
};

type NavBottom = {
  button: ButtonProps & {
    url?: string;
    title?: string;
  };
  socialMediaLinks: SocialMediaLink[];
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  // button: ButtonProps; ← we still keep it, but we no longer render it
  navBottom: NavBottom;
};

export type Navbar17Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Navbar17 = (props: Navbar17Props) => {
  const { logo, navLinks, /* button, */ navBottom } = {
    ...Navbar17Defaults,
    ...props,
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section
      id="relume"
      className="relative z-[999] flex min-h-16 w-full items-center border-b border-b-border-primary bg-background-primary px-[5%] md:min-h-18"
    >
      <div className="mx-auto flex size-full items-center justify-between">
        {/* logo */}
        <a href={logo.url} className="flex items-center space-x-2">
          <Image
            src={logo.src}
            width={40}
            height={40}
            alt={logo.alt || ""}
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold leading-none">
            Plant.<span className="text-accent">ID</span>
          </span>
        </a>

        {/* ← REPLACED SINGLE BUTTON WITH SIGNIN / SIGNUP */}
        <div className="flex items-center justify-center gap-2 lg:gap-4">
          <SignedOut>
            <SignInButton mode="redirect">
              <Button className="px-4 py-1 md:px-6 md:py-2">Log in</Button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <Button variant="secondary" className="px-4 py-1 md:px-6 md:py-2">
                Sign up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Button>
              <Link href="/dashboard/image-upload">Dashboard</Link>
            </Button>
            <UserButton
              fallback
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonAvatarImage: "w-10 h-10",
                },
              }}
            />
            {/* TODO: Dashboard Redirect Button */}
          </SignedIn>

          {/* hamburger */}
          <button
            className="-mr-2 flex size-12 flex-col items-center justify-center justify-self-end lg:mr-0"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="relative flex size-6 flex-col items-center justify-center  ">
              <motion.span
                className="absolute top-[3px] h-0.5 w-full bg-white"
                animate={isMenuOpen ? "open" : "close"}
                variants={topLineVariants}
              />
              <motion.span
                className="absolute h-0.5 w-full bg-white"
                animate={isMenuOpen ? "open" : "close"}
                variants={middleLineVariants}
              />
              <motion.span
                className="absolute h-0.5 w-full bg-white"
                animate={isMenuOpen ? "openSecond" : "closeSecond"}
                variants={middleLineVariants}
              />
              <motion.span
                className="absolute bottom-[3px] h-0.5 w-full bg-white"
                animate={isMenuOpen ? "open" : "close"}
                variants={bottomLineVariants}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile fly-out */}
      <AnimatePresence>
        {isMenuOpen && (
          <Menu
            isMenuOpen={isMenuOpen}
            navLinks={navLinks}
            navBottom={navBottom}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const Menu = ({
  navLinks,
  navBottom,
  isMenuOpen,
}: {
  isMenuOpen: boolean;
  navBottom: NavBottom;
  navLinks: NavLink[];
}) => {
  return (
    <div className="absolute inset-x-0 top-full h-[calc(100vh-4rem)] w-full overflow-hidden md:h-[calc(100vh-4.5rem)]">
      <motion.div
        variants={{
          open: { opacity: 1 },
          close: { opacity: 0 },
        }}
        animate={isMenuOpen ? "open" : "close"}
        initial="close"
        exit="close"
        transition={{ duration: 0.2 }}
        className="flex h-full flex-col overflow-auto bg-background"
      >
        <div className="mt-px flex grow flex-col">
          {navLinks.map((navLink, index) => (
            <a
              key={index}
              href={navLink.url}
              className="flex grow items-center justify-end border-t border-border-primary px-[5%] py-4 text-4xl font-bold leading-[1.2] last:border-b last:border-b-black md:py-2 md:text-6xl"
            >
              <HoverGradient>{navLink.title}</HoverGradient>
            </a>
          ))}
        </div>

        <div className="flex min-h-18 items-center justify-between gap-x-4 px-[5%]">
          {/* still honoring your navBottom.button for “Contact” */}
          {/*
            Extract url and title from navBottom.button, and pass the rest to Button.
          */}
          {(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { url, title, ...buttonProps } =
              navBottom.button as ButtonProps & {
                url?: string;
                title?: string;
              };
            return (
              <Button
                {...buttonProps}
                className="text-md underline md:text-xl"
                asChild
              >
                <a href={url}>{title}</a>
              </Button>
            );
          })()}
          <div className="flex items-center gap-3">
            {navBottom.socialMediaLinks.map((link, idx) => (
              <a key={idx} href={link.url}>
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Navbar17Defaults: Props = {
  logo: {
    url: "#",
    src: "./logo.svg",
    alt: "Relume placeholder logo",
  },
  navLinks: [
    { url: "#", title: "Home" },
    { url: "#", title: "How it works" },
    { url: "#", title: "FAQ" },
    { url: "#", title: "Contact" },
  ],
  navBottom: {
    button: { title: "Contact", variant: "link", size: "link", url: "#" },
    socialMediaLinks: [],
  },
};

const topLineVariants = {
  open: { width: 0, transition: { duration: 0.1, ease: "easeIn" as const } },
  close: {
    width: "100%",
    transition: { duration: 0.1, delay: 0.3, ease: "linear" as const },
  },
};

const middleLineVariants = {
  open: {
    rotate: 135,
    transition: { duration: 0.3, delay: 0.1, ease: "easeInOut" as const },
  },
  close: {
    rotate: 0,
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
  openSecond: {
    rotate: 45,
    transition: { duration: 0.3, delay: 0.1, ease: "easeInOut" as const },
  },
  closeSecond: {
    rotate: 0,
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
};

const bottomLineVariants = {
  open: { width: 0, transition: { duration: 0.1, ease: "easeIn" as const } },
  close: {
    width: "100%",
    transition: { duration: 0.1, delay: 0.3, ease: "linear" as const },
  },
};
