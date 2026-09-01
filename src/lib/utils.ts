import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id"): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Compress an image file to a JPEG data URL for the public board. */
export function readImageFile(file: File, maxEdge = 960): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      let w = Math.max(1, Math.round(img.width * scale));
      let h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("No canvas"));
        return;
      }
      URL.revokeObjectURL(url);
      const encode = (qw: number, qh: number, quality: number) => {
        canvas.width = qw;
        canvas.height = qh;
        ctx.drawImage(img, 0, 0, qw, qh);
        return canvas.toDataURL("image/jpeg", quality);
      };
      let data = encode(w, h, 0.78);
      if (data.length > 380_000) data = encode(w, h, 0.62);
      if (data.length > 380_000) {
        w = Math.round(w * 0.7);
        h = Math.round(h * 0.7);
        data = encode(Math.max(1, w), Math.max(1, h), 0.6);
      }
      resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}
