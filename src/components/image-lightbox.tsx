import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Expand, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ImageLightbox({
  src,
  alt = "Photo",
  open,
  onOpenChange,
}: {
  src: string;
  alt?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!src) return null;
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[3000] bg-bg/88" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[3010] flex cursor-zoom-out items-center justify-center p-4 outline-none sm:p-10"
          onClick={() => onOpenChange(false)}
          onPointerDownOutside={() => onOpenChange(false)}
        >
          <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Enlarged photo. Press Escape or click outside to close.
          </DialogPrimitive.Description>
          <img
            src={src}
            alt={alt}
            className="max-h-[88vh] w-[min(92vw,64rem)] cursor-default rounded-lg object-contain shadow-[var(--shadow-border)]"
            onClick={(e) => e.stopPropagation()}
          />
          <DialogPrimitive.Close
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-fg text-bg hover:bg-accent"
            aria-label="Close"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Thumbnail / banner that opens a full-size lightbox on click. */
export function ExpandableImage({
  src,
  alt = "",
  className,
  showHint = true,
  fit = "cover",
}: {
  src: string;
  alt?: string;
  className?: string;
  showHint?: boolean;
  fit?: "cover" | "contain";
}) {
  const [open, setOpen] = useState(false);
  if (!src) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Click to enlarge"
        aria-label={alt ? `View larger: ${alt}` : "View larger photo"}
        className={cn(
          "group relative block cursor-zoom-in overflow-hidden",
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            "size-full",
            fit === "contain" ? "object-contain" : "object-cover",
          )}
        />
        {showHint ? (
          <span className="pointer-events-none absolute right-1.5 bottom-1.5 grid size-6 place-items-center rounded-md bg-bg/70 text-fg opacity-80 transition-opacity duration-[var(--motion-quick)] group-hover:opacity-100">
            <Expand className="size-3.5" />
          </span>
        ) : null}
      </button>
      <ImageLightbox src={src} alt={alt} open={open} onOpenChange={setOpen} />
    </>
  );
}
