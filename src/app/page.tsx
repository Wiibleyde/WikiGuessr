import SingleMode from "@/components/game/SingleMode";
import GameProvider from "@/provider/GameProvider";

export default function Home() {
    return (
        <GameProvider>
            <SingleMode />
        </GameProvider>
    );
}
