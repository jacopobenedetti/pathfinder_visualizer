const Header = () => {
    return(
        <div className="flex flex-col items-center justify-center w-full p-12 gap-4 mt-4">
            <h1 className="text-6xl text-white font-semibold">Pathfinding Visualizer</h1>
            <p className="text-sm text-(--text-light) font-sans">Visualize pathfinding algorithms in real time</p>
        </div>
    );
}

export default Header;
