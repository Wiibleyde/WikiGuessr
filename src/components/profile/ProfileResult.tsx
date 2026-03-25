import type { GameResultData } from "@/types/auth";
import { formatDateWithMonthName } from "@/utils/date";
import Badge from "../ui/Badge";

export default function ProfileResult({ result }: { result: GameResultData }) {
    return (
        <div className="px-4 py-3 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-800">
                    {result.articleTitle}
                </p>
                <p className="text-xs text-gray-400">{formatDateWithMonthName(result.date)}</p>
            </div>
            <div className="flex items-center gap-2">
                <Badge color={result.won ? "green" : "red"}>
                    {result.won ? "Deviné" : "Echoué"}
                </Badge>
                <span className="text-sm text-gray-600">
                    {result.guessCount} essai
                    {result.guessCount !== 1 && "s"}
                </span>
                {result.hintsUsed > 0 && (
                    <span className="text-xs text-amber-500">
                        +{result.hintsUsed} indice
                        {result.hintsUsed !== 1 && "s"}
                    </span>
                )}
            </div>
        </div>
    );
}
