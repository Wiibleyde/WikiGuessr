interface NoDataMessageProps {
    message: string;
}

const NoDataMessage = ({ message }: NoDataMessageProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <p className="text-gray-500 text-sm">{message}</p>
        </div>
    );
};

export default NoDataMessage;
