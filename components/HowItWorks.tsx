"use client";
import type { ButtonProps } from "@relume_io/relume-ui";
import Image from "next/image";
import { RxChevronRight } from "react-icons/rx";
import { Badge } from "./ui/badge";
import ScrollFloat from "./ScrollFloat";

type ImageProps = {
  src: string;
  alt?: string;
};

type SectionProps = {
  icon: ImageProps;
  heading: string;
  description: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  sections: SectionProps[];
  buttons: ButtonProps[];
};

export type Layout237Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Layout237 = (props: Layout237Props) => {
  const { tagline, sections } = {
    ...props,
    ...Layout237Defaults,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
            <div className="w-full max-w-lg">
              <Badge className="mb-3 font-semibold md:mb-4 rounded-full overflow-hidden bg-gradient-to-r from-accent to-[#02518a] text-white">
                {tagline}
              </Badge>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
                textClassName="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-7xl"
              >
                How it works
              </ScrollFloat>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center text-center"
              >
                <div className="rb-5 mb-5 md:mb-6">
                  <Image
                    src={section.icon.src}
                    width={48}
                    height={48}
                    className="size-12"
                    alt={section.icon.alt || ""}
                  />
                </div>
                <h3 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl md:leading-[1.3] lg:text-4xl">
                  {section.heading}
                </h3>
                <p>{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout237Defaults: Props = {
  tagline: "Weed detection made easy",
  heading: "How it works",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  sections: [
    {
      icon: {
        src: "./1.svg",
        alt: "Relume logo 1",
      },
      heading: "Register for free",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    },
    {
      icon: {
        src: "./2.svg",
        alt: "Relume logo 2",
      },
      heading: "Choose between Image Upload or Webcam Stream",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    },
    {
      icon: {
        src: "./3.svg",
        alt: "Relume logo 3",
      },
      heading: "Upload your image",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    },
  ],
  buttons: [
    { title: "Button", variant: "secondary" },
    {
      title: "Button",
      variant: "link",
      size: "link",
      iconRight: <RxChevronRight />,
    },
  ],
};
