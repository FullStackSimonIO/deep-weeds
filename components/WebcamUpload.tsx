// components/WebcamUpload.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { boxToCoords, Coords, scaleCoords } from "@/app/utils/coordinates";

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

export default function WebcamUpload() {
  const webcamRef = useRef<Webcam>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
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

  const reset = () => {
    setAnalysis(null);
    setResultImage(null);
    setCoordsRaw(null);
    setScaledCoords(null);
  };

  const capture = () => {
    reset();
    if (!webcamRef.current) return;
    const dataUrl = webcamRef.current.getScreenshot();
    if (!dataUrl) return;
    // convert to blob
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => setCapturedImage(blob));
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;
    setLoading(true);
    reset();
    const form = new FormData();
    form.append("image", capturedImage, "webcam.jpg");

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
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gray-800 px-6 py-4">
        <CardTitle className="text-lg sm:text-2xl text-white text-center">
          Capture Image
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 py-8 space-y-6">
        {/* — Webcam Preview or Captured Image — */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/3] mx-auto rounded-lg border border-gray-700 overflow-hidden"
          style={{ maxWidth: DISPLAY_W }}
        >
          {!capturedImage && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={DISPLAY_W}
              height={DISPLAY_H}
              videoConstraints={{ facingMode: "environment" }}
              className="object-cover w-full h-full"
            />
          )}

          {(capturedImage || resultImage) && (
            <Image
              ref={imgRef}
              src={
                resultImage
                  ? resultImage
                  : URL.createObjectURL(capturedImage as Blob)
              }
              alt="Preview"
              fill
              className="object-cover"
            />
          )}

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

        {/* — Action Buttons — */}
        <div className="flex justify-center space-x-4">
          {!capturedImage ? (
            <Button onClick={capture} className="bg-[#02518a] text-white">
              Take Photo
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  setCapturedImage(null);
                  reset();
                }}
                variant="secondary"
              >
                Retake
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#02518a] text-white"
              >
                {loading ? "Analysing..." : "Analyze Image"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
