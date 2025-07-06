"use client";

import React, { useState, useCallback, type ReactEventHandler } from "react";
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

interface Detection {
  label: string;
  confidence: number;
  box: [number, number, number, number];
}

interface AnalyzeResponse {
  filename: string;
  detections: Detection[];
  image_url: string;
}

interface ClassifyWrapper {
  success: boolean;
  result?: AnalyzeResponse;
  error?: string;
}

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);

  // alle skalierten Boxen + Confidence
  const [scaledBoxes, setScaledBoxes] = useState<
    Array<Coords & { confidence: number }>
  >([]);
  // Flag, damit wir nur EINMAL skalieren und die Endlosschleife vermeiden
  const [hasScaled, setHasScaled] = useState(false);

  const reset = () => {
    setFile(null);
    setResultImage(null);
    setAnalysis(null);
    setScaledBoxes([]);
    setHasScaled(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    // bereits reset() aufgerufen
    const form = new FormData();
    form.append("image", file, file.name);

    try {
      const res = await fetch("/api/classify", { method: "POST", body: form });
      const json = (await res.json()) as ClassifyWrapper;
      if (json.success && json.result) {
        const r = json.result;
        setResultImage(
          r.image_url.startsWith("http")
            ? r.image_url
            : window.location.origin + r.image_url
        );
        setAnalysis(r);
        // Scaling erfolgt später in onLoad
      } else {
        console.error("Analysis error:", json.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sobald das Bild im DOM geladen ist, skaliere alle Boxes einmalig
  const onImageLoad: ReactEventHandler<HTMLImageElement> = useCallback(
    (e) => {
      if (!analysis || hasScaled) return;

      const img = e.currentTarget;
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;
      const displayW = img.width;
      const displayH = img.height;

      const boxes = analysis.detections.map((det) => {
        const raw = boxToCoords(det.box);
        const s = scaleCoords(raw, naturalW, naturalH, displayW, displayH);
        return { ...s, confidence: det.confidence };
      });

      const finite = boxes.filter(
        (b) =>
          Number.isFinite(b.x) &&
          Number.isFinite(b.y) &&
          Number.isFinite(b.width) &&
          Number.isFinite(b.height)
      );

      setScaledBoxes(finite);
      setHasScaled(true);
    },
    [analysis, hasScaled]
  );

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
            <span className="mt-2 text-sm sm:text-base text-gray-300">
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

        {/* — Preview & Overlays — */}
        {(file || resultImage) && (
          <div className="relative w-full aspect-[4/3] mx-auto rounded-lg border border-gray-700 overflow-hidden">
            <Image
              src={file ? URL.createObjectURL(file) : resultImage!}
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
              onLoad={onImageLoad}
            />

            {scaledBoxes.map((box, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div
                    style={{
                      position: "absolute",
                      top: box.y,
                      left: box.x,
                      width: box.width,
                      height: box.height,
                      border: "3px solid #EF4444",
                      boxSizing: "border-box",
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  Confidence: {(box.confidence * 100).toFixed(1)}%
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
