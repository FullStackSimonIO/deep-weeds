import WebcamUpload from "@/components/WebcamUpload";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-3xl lg:text-8xl font-bold mb-6">
          Plant.ID - Dashbard
        </h1>
        <p className="mb-8">Upload an image to detect weeds.</p>

        <WebcamUpload />
      </div>
    </div>
  );
};

export default page;
