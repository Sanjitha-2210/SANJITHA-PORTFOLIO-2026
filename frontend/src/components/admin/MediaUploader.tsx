"use client";

import { useState } from "react";
import { uploadMedia, autoRenewSession } from "@/lib/api";
import { UploadCloud, AlertCircle, Image as ImageIcon, Video as VideoIcon, Loader2, RefreshCw } from "lucide-react";

interface MediaUploaderProps {
  label?: string;
  currentUrl?: string;
  mediaType?: "image" | "video" | "any";
  onUploadSuccess: (url: string) => void;
}

export default function MediaUploader({
  label = "Upload Media (Images / Certificates / Videos)",
  currentUrl,
  mediaType = "any",
  onUploadSuccess,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<string | null>(null);

  const isVideo =
    currentUrl && /\.(mp4|webm|mov|mkv|m4v|avi)(\?.*)?$/i.test(currentUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const res = await uploadMedia(file);
      onUploadSuccess(res.url);
      setStorageInfo(res.storage === "cloudinary" ? "Cloudinary CDN" : "Local Storage");
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const acceptAttribute =
    mediaType === "video"
      ? "video/*,image/*,.mp4,.webm,.mov,.mkv,.avi,.jpg,.jpeg,.png,.webp,.gif"
      : mediaType === "image"
      ? "image/*"
      : "image/*,video/*,.pdf";

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-text-secondary">{label}</label>

      <div className="flex items-center gap-4">
        {/* Preview thumbnail */}
        {currentUrl ? (
          <div className="w-16 h-16 rounded-xl bg-surface border border-border overflow-hidden flex-shrink-0 relative group">
            {isVideo ? (
              <video
                src={currentUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
            )}
            {isVideo && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                <VideoIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-surface-card border border-dashed border-border flex items-center justify-center flex-shrink-0 text-text-secondary">
            {mediaType === "video" ? (
              <VideoIcon className="w-6 h-6 text-text-tan" />
            ) : (
              <ImageIcon className="w-6 h-6" />
            )}
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-card-hover border border-border hover:border-btn-bg text-xs font-semibold text-foreground cursor-pointer transition-all shadow-sm">
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-text-tan" />
                <span>Uploading {mediaType === "video" ? "Video" : "Media"} to Cloudinary...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5 text-text-tan" />
                <span>{mediaType === "video" ? "Select Video File (.mp4, .webm, .mov)" : "Choose File"}</span>
              </>
            )}
            <input
              type="file"
              accept={acceptAttribute}
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>

          {storageInfo && (
            <p className="text-[11px] font-mono text-emerald-500 font-semibold">
              Stored in: {storageInfo}
            </p>
          )}

          {error && (
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </p>
              {(error.includes("expired") || error.includes("credentials") || error.includes("Unauthorized")) && (
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={async () => {
                      setUploading(true);
                      setError("Renewing administrator session...");
                      const token = await autoRenewSession();
                      setUploading(false);
                      if (token) {
                        setError(null);
                        setStorageInfo("Session renewed successfully! Please select your file again.");
                      } else {
                        window.location.href = "/admin/login";
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-btn-bg text-btn-text hover:bg-btn-hover text-[11px] font-bold transition-all shadow-xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Renew Session Now</span>
                  </button>
                  <a
                    href="/admin/login"
                    target="_blank"
                    className="text-[11px] font-mono text-text-tan hover:underline"
                  >
                    Open Login Page
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

