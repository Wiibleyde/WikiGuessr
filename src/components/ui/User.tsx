import Image from "next/image";

interface UserProps {
    name: string;
    image: string | null;
    pictureWidth?: number;
}

export default function User({ name, image, pictureWidth = 24 }: UserProps) {
    return (
        <div className="flex items-center gap-2 min-w-0">
            {image ? (
                <Image
                    src={image}
                    alt={name}
                    width={pictureWidth}
                    height={pictureWidth}
                    className="rounded-full shrink-0 border-2 border-subtle"
                />
            ) : (
                <div
                    style={{
                        width: pictureWidth,
                        height: pictureWidth,
                    }}
                    className="rounded-full bg-gradient-to-br from-primary to-success shrink-0 text-white text-xs font-bold flex items-center justify-center"
                >
                    {name.charAt(0).toUpperCase()}
                </div>
            )}
            <span className="text-sm font-medium text-text truncate">
                {name}
            </span>
        </div>
    );
}
