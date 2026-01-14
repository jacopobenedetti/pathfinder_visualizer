
export const ALGORITHMS = [
  {
    id: "AStar",
    label: "A* (A-Star)",
    description: "A* combines the actual path cost with a heuristic estimate to efficiently guide the search toward the goal. It is fast, accurate, and guarantees the optimal path when using an admissible heuristic.",
  },
  {
    id: "Dijkstra",
    label: "Dijkstra",
    description: "Dijkstra calculates the shortest path in weighted graphs with non-negative costs. It guarantees optimality but tends to explore many unnecessary nodes compared to A*, making it slower in large spaces.",
  },
  {
    id: "BFS",
    label: "BFS",
    description: "BFS (Breadth-First Search) explores nodes layer by layer, ensuring the shortest path in unweighted grids. It’s simple and reliable, though it can become slow as the search area grows.",
  },
  {
    id: "GBFS",
    label: "GBFS",
    description: "GBFS (Greedly Best-First Search) relies solely on the heuristic to decide which node to visit next. It’s significantly faster than optimal algorithms but may produce suboptimal paths due to its greedy nature."
  }
] as const;

export type AlgorithmId = (typeof ALGORITHMS)[number]["id"];