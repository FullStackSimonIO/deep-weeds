import ImageUpload from "@/components/ImageUpload";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-3xl lg:text-8xl font-bold mb-6">
        Plant.ID - Dashbard
      </h1>
      <p className="mb-8">Upload an image to detect weeds.</p>

      <ImageUpload />
    </div>
  );
};

export default page;
