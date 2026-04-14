interface NavbarButtonProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function NavbarButton({ open, setOpen }: NavbarButtonProps) {
    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-primary-light/50 transition-colors"
            aria-label="Menu"
            aria-expanded={open}
        >
            <span
                className={[
                    "block h-0.5 w-5 bg-text rounded transition-all duration-300 origin-center",
                    open ? "translate-y-2 rotate-45" : "",
                ].join(" ")}
            />
            <span
                className={[
                    "block h-0.5 w-5 bg-text rounded transition-all duration-300",
                    open ? "opacity-0 scale-0" : "",
                ].join(" ")}
            />
            <span
                className={[
                    "block h-0.5 w-5 bg-text rounded transition-all duration-300 origin-center",
                    open ? "-translate-y-2 -rotate-45" : "",
                ].join(" ")}
            />
        </button>
    );
}
