import { Contact1 } from "@/components/Contact";
import { Faq1 } from "@/components/FAQ";
import { Header1 } from "@/components/Header";
import { Layout237 } from "@/components/HowItWorks";
import { Navbar17 } from "@/components/nav/Navbar";

import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <Navbar17 />
      <Header1 />
      <Layout237 />
      <Faq1 />
      <Contact1 />
    </div>
  );
};

export default page;
