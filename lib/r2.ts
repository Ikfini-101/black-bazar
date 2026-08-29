// R2 helper — Upload et lecture images produits (BB-03 §5)

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function uploadImage(
  key: string,
  data: ArrayBuffer | ReadableStream,
  contentType: string
): Promise<string> {
  const { env } = await getCloudflareContext({ async: true });
  await env.PRODUCT_IMAGES.put(key, data, {
    httpMetadata: { contentType },
  });
  // Return the public URL path — served via Worker
  return `/api/images/${key}`;
}

export async function getImage(key: string) {
  const { env } = await getCloudflareContext({ async: true });
  return env.PRODUCT_IMAGES.get(key);
}

export async function deleteImage(key: string) {
  const { env } = await getCloudflareContext({ async: true });
  await env.PRODUCT_IMAGES.delete(key);
}

export function generateImageKey(
  productId: string,
  index: number,
  extension: string = "jpg"
): string {
  const timestamp = Date.now();
  return `products/${productId}/${timestamp}-${index}.${extension}`;
}
