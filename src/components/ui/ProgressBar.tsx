interface ProgressBarProps {
    percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
    return (
        <div
            className="w-full bg-subtle rounded-full h-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression"
        >
            <div
                className="bg-gradient-to-r from-primary to-success h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
