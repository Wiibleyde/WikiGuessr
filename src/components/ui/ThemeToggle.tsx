"use client";

import { useEffect, useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { THEME_STORAGE_KEY } from "@/constants/game";

export default function ThemeToggle() {
    // false au premier rendu (SSR), corrigé après montage pour éviter
    // un mismatch d'hydratation avec la classe posée par le script inline.
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    const toggle = () => {
        const next = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", next);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
        } catch {
            // localStorage indisponible (navigation privée…) : le thème
            // reste appliqué pour la session courante.
        }
        setIsDark(next);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={
                isDark ? "Passer au thème clair" : "Passer au thème sombre"
            }
            title={isDark ? "Thème clair" : "Thème sombre"}
            className="p-2 rounded-lg text-muted hover:text-text hover:bg-page transition-colors cursor-pointer"
        >
            {isDark ? <IoSunny size={18} /> : <IoMoon size={18} />}
        </button>
    );
}
