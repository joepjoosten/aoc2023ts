import { parseInput } from "@/utils";
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { pipe } from "fp-ts/lib/function";
import { bind, bindTo, chain, manyTill } from "parser-ts/lib/Parser";
import { int, spaces, string } from "parser-ts/lib/string";

const num = pipe(spaces, chain(() => int));
const time = pipe(string('Time:'), chain(() => manyTill(num, string('\n'))))
const distance = pipe(string('Distance:'), chain(() => manyTill(num,  string('\n'))))

const parser = 
  pipe(
    time,
    bindTo('times'),
    bind('distances', () => distance),
  );

export const parse = (input: string) => pipe(
    parseInput(parser)(input),
    ({ times, distances }) => RA.zip(times)(distances),
    RA.map(([distance, time]) => ({ time, distance }))
)

// Newton-Raphson
function newtonRaphson(time: number, distance: number, initialGuess: number): number {
  let x = initialGuess; // Initial guess
  let tolerance = 0.00001; // tolerance for convergence
  let maxIterations = 1000; // prevent infinite loops
  let iteration = 0;

  while (iteration < maxIterations) {
      let f_x = x * (time - x) - distance;
      let df_x = time - 2 * x;

      // Update x using the formula
      let x_new = x - f_x / df_x;

      // Check for convergence
      if (Math.abs(x_new - x) < tolerance) {
          return x_new;
      }

      x = x_new;
      iteration++;
  }

  throw new Error("No solution found within the tolerance level and maximum iterations");
}


export function partOne(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    RA.map(({ time, distance }) => {
       const low = newtonRaphson(time, distance+1, 0);
       const high = newtonRaphson(time, distance+1, time);
       return Math.floor(high) - Math.ceil(low) + 1;
    }),
    RA.reduce(1, (a, b) => a * b)
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  const time = parseInt(input.map(({time}) => `${time}`).join(''));
  const distance = parseInt(input.map(({distance}) => `${distance}`).join(''));
  const low = newtonRaphson(time, distance+1, 0);
  const high = newtonRaphson(time, distance+1, time);
  return Math.floor(high) - Math.ceil(low) + 1;
}