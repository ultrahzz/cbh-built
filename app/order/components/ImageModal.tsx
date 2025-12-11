"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageModalProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export default function ImageModal({ src, alt, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Clickable trigger */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }} 
        className="cursor-zoom-in"
      >
        {children}
      </div>

      {/* Modal overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button - larger and more visible on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 p-3 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full text-white transition-colors"
            aria-label="Close image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image container - tap anywhere to close */}
          <div 
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain pointer-events-none"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              unoptimized
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-lg">
            <p className="text-white text-sm font-medium text-center">{alt}</p>
          </div>

          {/* Tap to close hint - more visible on mobile */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            Tap anywhere to close
          </p>
        </div>
      )}
    </>
  );
}
