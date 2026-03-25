"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import type { AuthUser } from "@/types/auth";
import Button from "../ui/Button";
import User from "../ui/User";

interface UserMenuProps {
    user: AuthUser;
    onNavigate?: () => void;
}

export default function UserMenu({ user, onNavigate }: UserMenuProps) {
    const { logout } = useAuth();
    return (
        <div className="flex items-center gap-3">
            <Link
                href="/profile"
                onClick={onNavigate}
                className="bg-gray-100 text-gray-900 px-3 py-1.5 rounded-md "
            >
                <User name={user.name} image={user.image} />
            </Link>
            <Button variant="secondary" onClick={logout}>
                Déconnexion
            </Button>
        </div>
    );
}
