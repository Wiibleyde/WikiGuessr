"use client";
import { useParams } from "next/navigation";
import CoopHome from "@/components/coop/CoopHome";
import Lobby from "@/components/lobby";
import CoopProvider from "@/provider/CoopProvider";

const page = () => {
    const params = useParams<{ code: string[] }>();
    const code = params.code?.[0];

    return (
        <CoopProvider>
            {!code ? <CoopHome /> : <Lobby code={code} />}
        </CoopProvider>
    );
};

export default page;
