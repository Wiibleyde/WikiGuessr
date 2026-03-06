"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import NavbarContext from "@/contexts/NavbarContext";
import { useAuth } from "@/hooks/useAuth";
import DesktopLink from "./navbar/DesktopLink";
import MobileLink from "./navbar/MobileLink";
import NavbarAuth from "./navbar/NavbarAuth";
import NavbarButton from "./navbar/NavbarButton";

const NAV_LINKS = [
    { href: "/", label: "Jouer" },
    { href: "/historic", label: "Historique" },
    { href: "/leaderboard", label: "Classement" },
    { href: "/profile", label: "Profil" },
] as const;

export default function Navbar() {
    const { user, loading, login, logout } = useAuth();
    const { open } = useContext(NavbarContext);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Image
                        src="/logo-wikiguessr.svg"
                        alt="WikiGuessr logo"
                        width={32}
                        height={32}
                    />
                    <Link
                        href="/"
                        className="text-xl font-extrabold tracking-tight text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        WikiGuessr
                    </Link>

                    <nav className="hidden sm:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <DesktopLink
                                key={link.href}
                                href={link.href}
                                label={link.label}
                            />
                        ))}
                    </nav>
                </div>

                {/* Desktop auth */}
                <div className="hidden sm:flex items-center gap-3">
                    <NavbarAuth
                        user={user}
                        loading={loading}
                        onLogin={login}
                        onLogout={logout}
                    />
                </div>

                <NavbarButton />
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="sm:hidden border-t border-gray-200 bg-white">
                    <nav className="flex flex-col px-4 py-2 gap-1">
                        {NAV_LINKS.map((link) => (
                            <MobileLink
                                key={link.href}
                                href={link.href}
                                label={link.label}
                            />
                        ))}
                    </nav>
                    <div className="px-4 py-3 border-t border-gray-100">
                        <NavbarAuth
                            user={user}
                            loading={loading}
                            onLogin={login}
                            onLogout={logout}
                            mobile
                        />
                    </div>
                </div>
            )}
        </header>
    );
}
