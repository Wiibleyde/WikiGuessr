import { useContext } from "react";
import NavbarContext from "@/contexts/NavbarContext";
import type { AuthUser } from "@/types/auth";
import UserMenu from "./UserMenu";

interface NavbarAuthProps {
    user: AuthUser | null;
    loading: boolean;
    onLogin: () => void;
    onLogout: () => void;
    mobile?: boolean;
}

export default function NavbarAuth({
    user,
    loading,
    onLogin,
    onLogout,
    mobile = false,
}: NavbarAuthProps) {
    const { open, setOpen } = useContext(NavbarContext);

    if (loading) return null;

    if (user) {
        return (
            <UserMenu
                user={user}
                onLogout={onLogout}
                onNavigate={() => setOpen(!open)}
            />
        );
    }

    return (
        <button
            type="button"
            onClick={() => {
                onLogin();
                setOpen(!open);
            }}
            className={
                mobile
                    ? "w-full px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    : "px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            }
        >
            Connexion Discord
        </button>
    );
}
