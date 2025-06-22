"use client";
import React, { useState, useRef, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DecryptedText from "@/components/DecryptedText";

// tooltip components from shadcn/ui
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Dynamically import react-webcam to avoid SSR issues
// Using react-webcam directly per docs

import Webcam from "react-webcam";
import { boxToCoords, Coords, scaleCoords } from "./utils/coordinates";
import Image from "next/image";

interface AnalyzeResponse {
  filename: string;
  detections: Array<{
    label: string;
    confidence: number;
    box: [number, number, number, number];
  }>;
  image_url: string;
}
interface ClassifyWrapper {
  success: boolean;
  result?: AnalyzeResponse;
  error?: string;
}

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<"upload" | "camera">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [coordsRaw, setCoordsRaw] = useState<Coords | null>(null);
  const [scaledCoords, setScaledCoords] = useState<Coords | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const displayWidth = 640;
  const displayHeight = 480;

  useEffect(() => {
    if (coordsRaw && imgRef.current) {
      const naturalW = imgRef.current.naturalWidth;
      const naturalH = imgRef.current.naturalHeight;
      const scaled = scaleCoords(
        coordsRaw,
        naturalW,
        naturalH,
        displayWidth,
        displayHeight
      );
      setScaledCoords(scaled);
    }
  }, [coordsRaw]);

  const reset = () => {
    setAnalysis(null);
    setResultImage(null);
    setCoordsRaw(null);
    setScaledCoords(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };
  const handleCapture = () => {
    reset();
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setCaptured(imageSrc);
  };
  const handleSubmit = async () => {
    setLoading(true);
    reset();
    const formData = new FormData();
    if (selectedTab === "upload" && file) {
      formData.append("image", file, file.name);
    } else if (selectedTab === "camera" && captured) {
      const blob = await (await fetch(captured)).blob();
      formData.append("image", blob, "snapshot.jpg");
    } else {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });
      const wrapper = (await res.json()) as ClassifyWrapper;
      if (!wrapper.success || !wrapper.result) {
        console.error("Classify error", wrapper.error);
        setLoading(false);
        return;
      }
      const json = wrapper.result;
      setAnalysis(json);
      if (json.detections?.length > 0) {
        const raw = boxToCoords(json.detections[0].box);
        setCoordsRaw(raw);
        const url = json.image_url.startsWith("http")
          ? json.image_url
          : `${window.origin}${json.image_url}`;
        setResultImage(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="grid grid-cols-3 p-4 text-center">
        <div />
        <DecryptedText
          text="Deep-Weeds Dashboard"
          animateOn="view"
          speed={300}
          className="text-7xl font-bold text-center"
        />
      </header>
      <main className="p-6 flex-1">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Weed-Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedTab}
              onValueChange={(v) => {
                reset();
                setSelectedTab(v as "upload" | "camera");
              }}
            >
              <TabsList>
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="camera">Camera</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <Label htmlFor="file-upload" className="pb-2">
                  Select File:
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </TabsContent>
              <TabsContent value="camera">
                <div className="flex flex-col items-center">
                  <Webcam
                    audio={false}
                    mirrored={true}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={displayWidth}
                    height={displayHeight}
                    className="rounded-lg border"
                  />
                  <Button onClick={handleCapture}>Take Photo</Button>
                </div>
              </TabsContent>
            </Tabs>
            <div className="text-right mt-4">
              <Button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  (selectedTab === "upload" && !file) ||
                  (selectedTab === "camera" && !captured)
                }
              >
                {loading ? "Analysiere…" : "Analyse starten"}
              </Button>
            </div>
            {/* Preview + Overlay */}
            {(file || resultImage) && (
              <div
                ref={containerRef}
                className="relative mx-auto mt-4 rounded-lg overflow-hidden"
                style={{ width: displayWidth, height: displayHeight }}
              >
                <Image
                  ref={imgRef}
                  src={file ? URL.createObjectURL(file) : resultImage!}
                  width={displayWidth}
                  height={displayHeight}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {scaledCoords && analysis?.detections?.[0] && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        style={{
                          position: "absolute",
                          top: scaledCoords.y,
                          left: scaledCoords.x,
                          width: scaledCoords.width,
                          height: scaledCoords.height,
                          border: "2px solid rgba(255,0,0,0.8)",
                          boxSizing: "border-box",
                          cursor: "pointer",
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Confidence:{" "}
                      {(analysis.detections[0].confidence * 100).toFixed(1)}%
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
            {analysis?.detections?.length && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Result:</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.detections.length > 0 && (
                    <p className="mb-2 text-green-500 font-medium">
                      {analysis.detections.length === 1
                        ? "1 weed detected"
                        : `${analysis.detections.length} weeds detected`}
                    </p>
                  )}
                  {/*
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(analysis.detections, null, 2)}
                  </pre>{" "}
                  */}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
