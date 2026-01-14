// core/algorithms/types.ts
import type { Grid } from "../grid";

export type Coord = { row: number; col: number };

export type AlgorithmStep = {
  visited: Coord[];      
  frontier?: Coord[];    
  path?: Coord[];        
};

export type AlgorithmRun = {
  steps: AlgorithmStep[];  
  visitedOrder: Coord[];   
  path: Coord[];           
};

export type AlgorithmFn = (
  grid: Grid,
  start: Coord,
  target: Coord
) => AlgorithmRun;
