"use client";

const Button = ({
    text,
    isActive,
    onClick,
    className = "",
    children,
    isButton = true
} : {
    text?: string;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    isButton?: boolean;
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-row items-center justify-center px-8 py-2 hover:cursor-pointer rounded-[12] border border-(--border-medium) ${isActive ? "bg-white text-black" : "bg-black text-white"} ${className}`}
        >
            <div className="flex w-full items-center justify-center">
                {isButton ? <p className="font-semibold text-sm">{text}</p> : children}
            </div>
        </button>
    );
};

export default Button;
