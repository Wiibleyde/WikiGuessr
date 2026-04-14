interface NoDataMessageProps {
    message: string;
}

export default function NoDataMessage({ message }: NoDataMessageProps) {
    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center bg-page">
            <span className="text-3xl mb-3 select-none">📭</span>
            <p className="text-muted text-sm">{message}</p>
        </div>
    );
}
