import { number } from "fp-ts";

type Tile = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
type Direction = 'N' | 'E' | 'S' | 'W';
type Deadend = '†';

const validTiles = {
  N: ['|', '7', 'F', 'S'] as Tile[],
  E: ['-', 'J', '7', 'S'] as Tile[],
  S: ['|', 'L', 'J', 'S'] as Tile[],
  W: ['-', 'L', 'F', 'S'] as Tile[]
}

const connections: Record<Tile, Record<Direction, Direction | Deadend>> = {
  '|': { N: 'S', E: '†', S: 'N', W: '†' },
  '-': { N: '†', E: 'W', S: '†', W: 'E' },
  'L': { N: 'E', E: 'N', S: '†', W: '†' },
  'J': { N: 'W', E: '†', S: '†', W: 'N' },
  '7': { N: '†', E: '†', S: 'W', W: 'S' },
  'F': { N: '†', E: 'S', S: 'E', W: '†' },
  'S': { N: 'N', E: 'E', S: 'S', W: 'W' },
  '.': { N: '†', E: '†', S: '†', W: '†' },
}

type Movers = Record<Direction, (pos: number) => number | Deadend>;
const move = (width: number, height: number): Movers => ({
  N: (pos) => pos - width >= 0 ? pos - width : '†',
  E: (pos) => (pos + 1) % width === 0 ? '†' : pos + 1, 
  S: (pos) => pos + width < (width * height) ? pos + width : '†', 
  W: (pos) => (pos - 1) % width === width - 1 ? '†' : pos - 1
});

const nextTileAndDirection = (tile: number, grid: Tile[], movers: Movers) => (commingFrom: Direction): [number | Deadend, ] => {
  const goingTo = connections[grid[tile]!][commingFrom];
  if(goingTo === '†')return '†';
  const nextTile = movers[goingTo](tile);
  if(nextTile === '†') return '†';
  return validTiles[goingTo].includes(grid[nextTile]!) ? nextTile : '†';
}

export const parse = (input: string) => {
  const gridInput = Array.from(input);
  const width = gridInput.indexOf('\n');
  const height = gridInput.filter(x => x === '\n').length + 1;

  let pos = 0;
  let startTile = -1;
  const grid: Tile[] = []
  for (let i = 0; i < gridInput.length; i++) {
    switch (input[i]) {
      case '\n':
        break;
      default:
        const tile = gridInput[i] as Tile;
        if(tile === 'S') startTile = pos;
        grid.push(tile)
        pos++;
        break;
    }
  }
  return { grid, width, height, startTile };
} 

export function partOne({ grid, startTile, width, height }: ReturnType<typeof parse>) {
  const allDirections = ['N', 'E', 'S', 'W'] as Direction[];
  const movers = move(width, height);

  allDirections.forEach(dir => {
    let currentTile = startTile;
    let steps = [startTile];
    do {
      const next = nextTile(currentTile, grid, movers)(dir);
      steps.push(currentTile);
      if(next === '†') break;
      currentTile = next;
    } while (grid[currentTile] !== 'S')
  });
}

export function partTwo(input: ReturnType<typeof parse>) {
  return undefined;
}