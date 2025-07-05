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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [rawCoords, setRawCoords] = useState<Coords | null>(null);
  const [scaled, setScaled] = useState<Coords | null>(null);

  // **NEW** store the confidence of the first detection
  const [confidence, setConfidence] = useState<number | null>(null);

  // once we have a new file or resultImage, clear everything
  const reset = () => {
    setScaled(null);
    setRawCoords(null);
    setResultImage(null);
    setConfidence(null); // reset confidence too
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    reset();
    const form = new FormData();
    form.append("image", file, file.name);

    try {
      const res = await fetch("/api/classify", { method: "POST", body: form });
      const json = (await res.json()) as ClassifyWrapper;
      if (json.success && json.result) {
        setResultImage(
          json.result.image_url.startsWith("http")
            ? json.result.image_url
            : window.location.origin + json.result.image_url
        );

        if (json.result.detections.length) {
          const det = json.result.detections[0];
          setRawCoords(boxToCoords(det.box));
          setConfidence(det.confidence); // <- capture confidence
        }
      } else {
        console.error("Analysis error:", json.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // When <Image> finishes loading, we know its actual size in the DOM.
  // We only compute once, and only if rawCoords exist.
  const onImageLoad: ReactEventHandler<HTMLImageElement> = useCallback(
    (e) => {
      if (!rawCoords) return;
      const img = e.currentTarget;
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;
      const displayW = img.width;
      const displayH = img.height;

      const s = scaleCoords(rawCoords, naturalW, naturalH, displayW, displayH);
      // only set if finite
      if (
        Number.isFinite(s.x) &&
        Number.isFinite(s.y) &&
        Number.isFinite(s.width) &&
        Number.isFinite(s.height)
      ) {
        setScaled(s);
      }
    },
    [rawCoords]
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

        {/* — Preview & Overlay — */}
        {(file || resultImage) && (
          <div className="relative w-full aspect-[4/3] mx-auto rounded-lg border border-gray-700 overflow-hidden">
            <Image
              src={file ? URL.createObjectURL(file) : (resultImage as string)}
              alt="Preview"
              fill
              className="object-cover"
              onLoadingComplete={(img) =>
                onImageLoad({
                  currentTarget: img,
                } as React.SyntheticEvent<HTMLImageElement>)
              }
            />

            {/* only render if we have finite scaled coords */}
            {scaled && confidence !== null && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    style={{
                      position: "absolute",
                      top: scaled.y,
                      left: scaled.x,
                      width: scaled.width,
                      height: scaled.height,
                      border: "3px solid #EF4444",
                      boxSizing: "border-box",
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  Confidence: {(confidence * 100).toFixed(1)}%
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
