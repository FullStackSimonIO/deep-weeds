// components/WebcamUpload.tsx
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  type ReactEventHandler,
} from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);

  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [rawCoords, setRawCoords] = useState<Coords | null>(null);
  const [scaled, setScaled] = useState<Coords | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const DISPLAY_W = 640;
  const DISPLAY_H = 480;

  // scale once the <Image> has loaded
  const onImageLoad: ReactEventHandler<HTMLImageElement> = useCallback(
    (e) => {
      if (!rawCoords) return;
      const img = e.currentTarget;
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;
      const displayW = img.width;
      const displayH = img.height;
      const s = scaleCoords(rawCoords, naturalW, naturalH, displayW, displayH);
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

  // clear out old state
  const reset = () => {
    setResultImage(null);
    setRawCoords(null);
    setScaled(null);
    setConfidence(null);
  };

  // take a photo
  const capture = () => {
    reset();
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) return;
    fetch(shot)
      .then((r) => r.blob())
      .then((blob) => setCapturedImage(blob));
  };

  // send to API
  const handleSubmit = async () => {
    if (!capturedImage) return;
    setLoading(true);
    reset();
    const form = new FormData();
    form.append("image", capturedImage, "webcam.jpg");

    try {
      const res = await fetch("/api/classify", { method: "POST", body: form });
      const json = (await res.json()) as ClassifyWrapper;

      if (json.success && json.result) {
        // display returned image
        const url = json.result.image_url.startsWith("http")
          ? json.result.image_url
          : window.location.origin + json.result.image_url;
        setResultImage(url);

        // extract first detection
        if (json.result.detections.length) {
          const det = json.result.detections[0];
          setRawCoords(boxToCoords(det.box));
          setConfidence(det.confidence);
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
        {/* — Webcam or captured preview — */}
        <div
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
              src={resultImage ?? URL.createObjectURL(capturedImage!)}
              alt="Preview"
              fill
              className="object-cover"
              onLoadingComplete={(img) =>
                onImageLoad({
                  currentTarget: img,
                } as React.SyntheticEvent<HTMLImageElement>)
              }
            />
          )}

          {/* detection box + tooltip */}
          {scaled != null && confidence != null && (
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

        {/* — Controls — */}
        <div className="flex justify-center space-x-4">
          {!capturedImage ? (
            <Button onClick={capture} className="bg-[#02518a] text-white">
              Take Photo
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setCapturedImage(null);
                  reset();
                }}
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
