"use client";
import { type ReactNode, useState } from "react";
import NavbarContext from "@/contexts/NavbarContext";

interface NavbarProviderProps {
    children: ReactNode;
}

export default function NavbarProvider({ children }: NavbarProviderProps) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <NavbarContext.Provider value={{ open, setOpen }}>
            {children}
        </NavbarContext.Provider>
    );
}
