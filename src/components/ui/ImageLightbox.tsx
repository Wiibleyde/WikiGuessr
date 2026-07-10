"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCloseSharp } from "react-icons/io5";

interface ImageLightboxProps {
    url: string;
    alt: string;
    onClose: () => void;
}

export default function ImageLightbox({
    url,
    alt,
    onClose,
}: ImageLightboxProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
        >
            <button
                type="button"
                aria-label="Fermer"
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in cursor-zoom-out"
            />

            <div className="relative z-10 animate-fade-in">
                <Image
                    src={url}
                    alt={alt}
                    width={1200}
                    height={800}
                    unoptimized
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-xl shadow-2xl object-contain select-none"
                    draggable={false}
                />
                <button
                    type="button"
                    aria-label="Fermer"
                    onClick={onClose}
                    className="absolute -top-3 -right-3 bg-surface text-text rounded-full p-1.5 shadow-lg hover:text-danger transition-colors cursor-pointer"
                >
                    <IoCloseSharp size={20} />
                </button>
            </div>
        </div>,
        document.body,
    );
}
