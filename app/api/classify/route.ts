import { NextResponse } from "next/server";

const ANALYZE_URL =
  process.env.ANALYZE_URL || "https://plantid.let-net.cc/analyze/";

export async function POST(req: Request) {
  try {
    console.log("=== /api/classify POST gestartet ===");

    const formData = await req.formData();
    const fileField = formData.get("image");
    if (!(fileField instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Kein Bild im Feld "image" gefunden' },
        { status: 400 }
      );
    }

    const arrayBuffer = await fileField.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = fileField.type || "application/octet-stream";

    console.log("Dateiname:", fileField.name, "Größe:", buffer.byteLength);

    const upload = new FormData();
    upload.append(
      "file",
      new Blob([buffer], { type: contentType }),
      fileField.name
    );

    const analyzeRes = await fetch(ANALYZE_URL, {
      method: "POST",
      body: upload,
    });
    console.log("Analyze-Service Status:", analyzeRes.status);

    const textOrJson = analyzeRes.headers
      .get("content-type")
      ?.includes("application/json")
      ? await analyzeRes.json()
      : await analyzeRes.text();
    console.log(
      "Analyze-Service Body full:",
      JSON.stringify(textOrJson, null, 2)
    );

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
        detail: err instanceof Error ? err : String(err),
      },
      { status: 500 }
    );
  }
}
