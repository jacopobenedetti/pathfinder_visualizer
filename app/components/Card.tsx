type CardProps = {
    children: React.ReactNode;
    isLevelTwo:boolean;
    className?: string;
}

const Card = ({children, className, isLevelTwo} : CardProps) => {
    return(
        <div className={` border-2 rounded-[20]  px-16 py-10 flex border-(--border-dark) ${className} ${isLevelTwo ? "bg-(--bg-darker)" : "bg-(--bg-dark) items-center justify-center"}`}>
            {children}
        </div>
    );
}

export default Card;