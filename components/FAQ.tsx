import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@relume_io/relume-ui";

import type { ButtonProps } from "@relume_io/relume-ui";

type QuestionsProps = {
  title: string;
  answer: string;
};

type Props = {
  heading: string;
  description: string;
  footerHeading: string;
  footerDescription: string;
  button: ButtonProps;
  questions: QuestionsProps[];
};

export type Faq1Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Faq1 = (props: Faq1Props) => {
  const { heading, description, questions, footerHeading, footerDescription } =
    {
      ...Faq1Defaults,
      ...props,
    };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        <Accordion type="multiple">
          {questions.map((question, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="md:py-5 md:text-md">
                {question.title}
              </AccordionTrigger>
              <AccordionContent className="md:pb-6">
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            {footerHeading}
          </h4>
          <p className="md:text-md">{footerDescription}</p>
        </div>
      </div>
    </section>
  );
};

export const Faq1Defaults: Props = {
  heading: "FAQs",
  description:
    "Here are some common questions about Plant.ID’s AI-powered weed detection. Can’t find what you’re looking for? Reach out to our support team below.",
  questions: [
    {
      title: "What is Plant.ID and how does it work?",
      answer:
        "Plant.ID is a cloud-based service that uses state-of-the-art computer vision and deep learning to automatically detect and localize weeds in your field imagery. Simply upload a photo or drone image, and within seconds our AI returns a map of unwanted plants down to the species level—no agronomy expertise required.",
    },
    {
      title: "Which image formats and devices are supported?",
      answer:
        "You can upload any standard image format (JPEG, PNG, WebP) taken by smartphones, tablets or drones. Plant.ID’s AI has been trained on thousands of field-level photos across a variety of resolutions, so even lower-quality snapshots will yield accurate results.",
    },
    {
      title: "How accurate is the weed detection?",
      answer:
        "In our field trials, Plant.ID achieved over 92% detection accuracy on common broadleaf and grass weeds. Confidence scores are provided for each detection so you can filter out low-confidence results or review them manually.",
    },
    {
      title: "Can I integrate Plant.ID into my own application?",
      answer:
        "Absolutely. We offer a simple REST API endpoint for automated batch processing or real-time analysis. Check out our developer docs to get your API key and start sending images programmatically.",
    },
    {
      title: "How is my data stored and protected?",
      answer:
        "All images and analysis results are encrypted at rest and in transit. You retain full ownership of your data and can delete any project or image at any time. We never share your private imagery with third parties.",
    },
  ],
  footerHeading: "Still have questions?",
  footerDescription:
    "If your question isn’t answered here, our support team is happy to help.",
  button: {
    title: "Contact Support",
    variant: "secondary",
  },
};
