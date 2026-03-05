import { useContext } from "react";
import NavbarContext from "@/contexts/NavbarContext";

export default function NavbarButton() {
    const { open, setOpen } = useContext(NavbarContext);

    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Menu"
            aria-expanded={open}
        >
            <span
                className={[
                    "block h-0.5 w-5 bg-gray-600 rounded transition-all duration-300 origin-center",
                    open ? "translate-y-2 rotate-45" : "",
                ].join(" ")}
            />
            <span
                className={[
                    "block h-0.5 w-5 bg-gray-600 rounded transition-all duration-300",
                    open ? "opacity-0 scale-0" : "",
                ].join(" ")}
            />
            <span
                className={[
                    "block h-0.5 w-5 bg-gray-600 rounded transition-all duration-300 origin-center",
                    open ? "-translate-y-2 -rotate-45" : "",
                ].join(" ")}
            />
        </button>
    );
}
