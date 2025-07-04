"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { boxToCoords, Coords, scaleCoords } from "@/app/utils/coordinates";
import Folder from "./Folder";

interface AnalyzeResponse {
  filename: string;
  detections: {
    label: string;
    confidence: number;
    box: [number, number, number, number];
  }[];
  image_url: string;
}
interface ClassifyWrapper {
  success: boolean;
  result?: AnalyzeResponse;
  error?: string;
}

export default function ImageUpload() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [coordsRaw, setCoordsRaw] = useState<Coords | null>(null);
  const [scaledCoords, setScaledCoords] = useState<Coords | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);

  const DISPLAY_W = 640;
  const DISPLAY_H = 480;

  useEffect(() => {
    if (coordsRaw && imgRef.current) {
      const w = imgRef.current.naturalWidth;
      const h = imgRef.current.naturalHeight;
      setScaledCoords(scaleCoords(coordsRaw, w, h, DISPLAY_W, DISPLAY_H));
    }
  }, [coordsRaw]);

  function reset() {
    setAnalysis(null);
    setResultImage(null);
    setCoordsRaw(null);
    setScaledCoords(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    reset();
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    reset();
    const form = new FormData();
    form.append("image", file, file.name);

    try {
      const res = await fetch("/api/classify", { method: "POST", body: form });
      const json: ClassifyWrapper = await res.json();
      if (json.success && json.result) {
        const r = json.result;
        setAnalysis(r);
        if (r.detections.length) {
          setCoordsRaw(boxToCoords(r.detections[0].box));
          setResultImage(
            r.image_url.startsWith("http")
              ? r.image_url
              : `${window.location.origin}${r.image_url}`
          );
        }
      } else {
        console.error("Analysis error:", json.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gray-800 px-6 py-4">
        <CardTitle className="text-lg sm:text-2xl text-white text-center">
          Upload Image
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 py-8 space-y-6">
        {/* — File Picker — */}
        <div>
          <label
            htmlFor="file-upload"
            className="
              group
              flex flex-col items-center justify-center
              w-full h-40 sm:h-48
              border-2 border-dashed border-gray-600
              rounded-xl bg-gray-800 hover:bg-gray-700
              transition-colors cursor-pointer
            "
          >
            <Folder size={0.5} color="#02518a" />
            <span className="mt-2 text-sm sm:text-base text-gray-300 ">
              {file ? file.name : "Click to select or drag an image"}
            </span>
          </label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>

        {/* — Submit — */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="bg-[#02518a] text-white"
          >
            {loading ? "Analysing..." : "Analyze Image"}
          </Button>
        </div>

        {/* — Preview & Overlay — */}
        {(file || resultImage) && (
          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] mx-auto rounded-lg border border-gray-700 overflow-hidden"
            style={{ maxWidth: DISPLAY_W }}
          >
            <Image
              ref={imgRef}
              src={file ? URL.createObjectURL(file) : (resultImage as string)}
              alt="Preview"
              fill
              className="object-cover"
            />

            {scaledCoords && analysis?.detections[0] && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    style={{
                      position: "absolute",
                      top: scaledCoords.y,
                      left: scaledCoords.x,
                      width: scaledCoords.width,
                      height: scaledCoords.height,
                      border: "3px solid #EF4444",
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  Confidence:{" "}
                  {(analysis.detections[0].confidence * 100).toFixed(1)}%
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
