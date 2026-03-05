interface LoaderProps {
    message: string;
}

export default function Loader({ message }: LoaderProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <p className="text-gray-500 text-lg animate-pulse">{message}</p>
        </div>
    );
}
