// GET /api/images/[...key] — Serve R2 images publicly

import { NextResponse } from "next/server";
import { getImage } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    const fullKey = key.join("/");
    const object = await getImage(fullKey);

    if (!object) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", object.httpMetadata?.contentType || "image/jpeg");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(object.body, { headers });
  } catch (error) {
    console.error("[Image Serve Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
