import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

const BLOB_STORE_NAME = "vehicle-photos";

function usingNetlifyBlobs() {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);
}

export async function saveUpload(file: File): Promise<string> {
  const ext = path.extname(file.name) || ".jpg";
  const key = `${randomUUID()}${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  if (usingNetlifyBlobs()) {
    const store = getStore(BLOB_STORE_NAME);
    await store.set(key, arrayBuffer, {
      metadata: { contentType: file.type || "image/jpeg" },
    });
    return `/blob-uploads/${key}`;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, key), Buffer.from(arrayBuffer));
  return `/uploads/${key}`;
}

export async function deleteUpload(url: string) {
  if (url.startsWith("/blob-uploads/")) {
    const key = url.replace("/blob-uploads/", "");
    const store = getStore(BLOB_STORE_NAME);
    await store.delete(key).catch(() => {});
    return;
  }

  if (url.startsWith("/uploads/")) {
    await unlink(path.join(process.cwd(), "public", url)).catch(() => {});
  }
}
