import type { ReactNode } from "react";
import NavbarProvider from "./NavbarProvider";

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return <NavbarProvider>{children}</NavbarProvider>;
}
