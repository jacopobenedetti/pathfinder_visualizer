import { Grid } from "../grid";

class PerlinNoise {
  private p: number[] = new Array(512);

  constructor(seed: number) {
    const permutation = Array.from({ length: 256 }, (_, i) => i);
    this.shuffle(permutation, seed);
    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i & 255];
    }
  }

  noise(x: number, y: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const aa = this.p[this.p[xi] + yi];
    const ab = this.p[this.p[xi] + yi + 1];
    const ba = this.p[this.p[xi + 1] + yi];
    const bb = this.p[this.p[xi + 1] + yi + 1];

    const x1 = lerp(u, grad(aa, xf, yf), grad(ba, xf - 1, yf));
    const x2 = lerp(u, grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1));

    return lerp(v, x1, x2); // ~[-1, 1]
  }

  private shuffle(arr: number[], seed: number) {
    const r = mulberry32(seed);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number) {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number) {
  switch (hash & 3) {
    case 0:
      return x + y;
    case 1:
      return -x + y;
    case 2:
      return x - y;
    default:
      return -x - y;
  }
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function applyPerlinNoise(
  grid: Grid,
  options: { scale: number; threshold: number; seed?: number }
): Grid {
  const { scale, threshold, seed = 1337 } = options;
  const noiseGen = new PerlinNoise(seed);
  // Single pass: sample noise and map from [-1,1] to [0,1] without per-grid normalization
  return grid.map((row, r) =>
    row.map((cell, c) => {
      if (cell.type === "start" || cell.type === "target") {
        return { ...cell };
      }

      const n = noiseGen.noise(c / scale, r / scale); // [-1, 1]
      const isWall = n >= threshold;
      return { ...cell, type: isWall ? "wall" : "empty" };
    })
  );
}
