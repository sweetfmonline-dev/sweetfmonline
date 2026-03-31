const CLOUD_NAME = "doa2yvmco";

interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderParams): string {
  // Local/static files (from public/) — serve directly, skip Cloudinary
  if (src.startsWith("/")) {
    return src;
  }

  // Remote URLs — use Cloudinary fetch mode to optimize on the fly
  const params = [
    "f_auto", // auto format (WebP/AVIF)
    "c_limit", // don't upscale
    `w_${width}`,
    `q_${quality || "auto"}`,
  ].join(",");

  if (src.startsWith("http://") || src.startsWith("https://")) {
    const encodedUrl = encodeURIComponent(src);
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${params}/${encodedUrl}`;
  }

  // Uploaded asset mode (Cloudinary-hosted assets)
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params}/${src}`;
}
