// POST /api/admin/upload — Upload image → R2 (PRD §7.10)

import { NextResponse } from "next/server";
import { uploadImage, generateImageKey } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Fichier requis" },
        { status: 400 }
      );
    }

    // Determine extension from content type
    const ext = file.type === "image/png" ? "png" : "jpg";
    const key = generateImageKey(
      productId || "temp",
      Date.now(),
      ext
    );

    const arrayBuffer = await file.arrayBuffer();
    const url = await uploadImage(key, arrayBuffer, file.type);

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error("[Upload Error]", error);
    return NextResponse.json(
      { error: "Erreur upload" },
      { status: 500 }
    );
  }
}
