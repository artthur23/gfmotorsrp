import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const store = getStore("vehicle-photos");

  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType =
    (result.metadata?.contentType as string | undefined) ?? "image/jpeg";

  return new NextResponse(result.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
