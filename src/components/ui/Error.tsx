interface ErrorProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <p className="text-red-500 text-lg">{message}</p>
        </div>
    );
}
