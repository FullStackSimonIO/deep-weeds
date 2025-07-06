// app/api/classify/route.ts
import { NextResponse } from "next/server";

const ANALYZE_URL =
  process.env.ANALYZE_URL || "https://plantid.let-net.cc/analyze/";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 1) hol Dir die FormData – kein 5 MB-Limit mehr
    const formData = await request.formData();
    const fileField = formData.get("image");
    if (!(fileField instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Kein Bild im Feld "image" gefunden' },
        { status: 400 }
      );
    }

    // 2) bau eine neue FormData für den Analyse-Service
    const upload = new FormData();
    // hier "file", weil plantid.let-net.cc/analyze/ genau das erwartet
    upload.append("file", fileField, fileField.name);

    // 3) weiterleiten
    const analyzeRes = await fetch(ANALYZE_URL, {
      method: "POST",
      body: upload,
    });
    const contentType = analyzeRes.headers.get("content-type") || "";
    const textOrJson = contentType.includes("application/json")
      ? await analyzeRes.json()
      : await analyzeRes.text();

    if (!analyzeRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Fehler im Analyze-Service",
          detail: textOrJson,
        },
        { status: analyzeRes.status }
      );
    }

    // 4) und zurück an den Client
    return NextResponse.json(
      { success: true, result: textOrJson },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Unerwarteter Fehler in /api/classify:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Interner Serverfehler",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
