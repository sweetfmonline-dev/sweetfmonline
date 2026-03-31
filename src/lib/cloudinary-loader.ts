const CLOUD_NAME = "doa2yvmco";

interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderParams): string {
  // If src is already a full URL (e.g. Supabase Storage, Contentful CDN),
  // use Cloudinary's fetch mode to optimize it on the fly.
  // If src is a relative path, treat it as a Cloudinary uploaded asset.
  const params = [
    "f_auto", // auto format (WebP/AVIF)
    "c_limit", // don't upscale
    `w_${width}`,
    `q_${quality || "auto"}`,
  ].join(",");

  if (src.startsWith("http://") || src.startsWith("https://")) {
    // Fetch mode: Cloudinary fetches and optimizes the remote image
    const encodedUrl = encodeURIComponent(src);
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${params}/${encodedUrl}`;
  }

  // Uploaded asset mode
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params}/${cleanSrc}`;
}
