import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = [
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/mpeg",
      "audio/mp3",
      "audio/m4a",
      "audio/mp4",
      "audio/x-m4a",
      "audio/ogg",
      "audio/webm",
      "audio/aac",
    ];

    if (!validMimes.some((m) => file.type.toLowerCase().includes(m.split("/")[1]))) {
      // Also accept if file extension ends with known audio format
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["wav", "mp3", "m4a", "ogg", "webm", "aac", "flac"].includes(ext || "")) {
        return NextResponse.json(
          { error: "Unsupported audio format. Please upload MP3, WAV, M4A, OGG, or WEBM." },
          { status: 400 }
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${cleanName}`;
    const filePath = join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: file.name,
      sizeBytes: file.size,
    });
  } catch (error: any) {
    console.error("Audio file upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload audio file" },
      { status: 500 }
    );
  }
}
