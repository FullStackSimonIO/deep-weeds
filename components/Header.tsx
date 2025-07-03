import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import Image from "next/image";
import { HighlightText } from "./animate-ui/text/highlight";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

export type Header1Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Header1 = (props: Header1Props) => {
  const { description, buttons, image } = {
    ...Header1Defaults,
    ...props,
  };
  return (
    <section id="hero-section" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-8xl mb-8">
              <HighlightText
                className="text-8xl font-semibold rounded-full "
                text="Plant.ID"
              />
              <h1>
                - automatically{" "}
                <span className="text-accent">detect weeds</span> in your field
              </h1>
            </div>

            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Image
              alt="Header Image"
              width={500}
              height={500}
              src={image.src}
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header1Defaults: Props = {
  heading: "Plant.ID",
  description:
    "Plant.ID harnesses state-of-the-art computer vision and deep learning to turn any smartphone or drone image into instant, actionable weed maps. Simply snap a photo of your field and let our AI accurately identify and localize unwanted plants down to species level—no expert knowledge required. With real-time detection, you can target treatment zones, reduce chemical usage, and optimize crop health with surgical precision. Spend less time scouting and more time growing: Plant.ID brings next-generation agritech right to your fingertips.",
  buttons: [{ title: "Button" }, { title: "Button", variant: "secondary" }],
  image: {
    src: "/unkraut.gif",
    alt: "Relume placeholder image",
  },
};
