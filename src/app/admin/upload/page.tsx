"use client";

import { useState, useCallback, useRef } from "react";

export default function UploadPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<
    { url: string; filename: string; copied: boolean }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) setAuthenticated(true);
  };

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "x-upload-secret": secret },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Upload failed");
          return;
        }

        setUploads((prev) => [
          { url: data.url, filename: data.filename, copied: false },
          ...prev,
        ]);
      } catch (err) {
        setError("Upload failed: " + String(err));
      } finally {
        setUploading(false);
      }
    },
    [secret]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const copyUrl = (index: number) => {
    navigator.clipboard.writeText(uploads[index].url);
    setUploads((prev) =>
      prev.map((u, i) => (i === index ? { ...u, copied: true } : u))
    );
    setTimeout(() => {
      setUploads((prev) =>
        prev.map((u, i) => (i === index ? { ...u, copied: false } : u))
      );
    }, 2000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleAuth}
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sweet FM Media Upload
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Enter the upload secret to continue
          </p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Upload secret"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Media Upload
        </h1>
        <p className="text-gray-500 mb-8">
          Upload images here, then copy the URL to use in Contentful articles.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 font-medium">Uploading...</p>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-gray-700 font-medium mb-1">
                Drop an image here or click to select
              </p>
              <p className="text-sm text-gray-400">
                JPG, PNG, WebP, GIF supported
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Upload results */}
        {uploads.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Uploaded Images
            </h2>
            {uploads.map((upload, i) => (
              <div
                key={upload.url}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
              >
                <img
                  src={upload.url}
                  alt={upload.filename}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {upload.filename}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {upload.url}
                  </p>
                </div>
                <button
                  onClick={() => copyUrl(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    upload.copied
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {upload.copied ? "Copied!" : "Copy URL"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
