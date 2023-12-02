import { flow, pipe } from "fp-ts/function"
import * as RA from "fp-ts/ReadonlyArray";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { many1, lower } from "parser-ts/char";
import { spaces1, string, int,  } from "parser-ts/string";
import { chain, Parser, bindTo, bind, sepBy } from "parser-ts/Parser";
import { parseInput } from "@/utils";

type Cube = { count: number, color: string };
type Cubes = Array<Cube>;
type Game = { game: number, sets: Array<Cubes> };

const gameNumber = pipe(string("Game"), chain(() => spaces1), chain(() => int));
const cube = pipe(spaces1, bind('count', () => int), bind('color', () => pipe(spaces1, chain(() => many1(lower)))));
const cubes = pipe(sepBy(string(','), cube));
const set = pipe(sepBy(string(';'), cubes));
const game: Parser<string, Game> = pipe(gameNumber, bindTo('game'), bind('sets', () => pipe(string(':'), chain(() => set))));

export const parse = parseInput(game)

export const solve = (bag: Record<string, number>) => (input: ReturnType<typeof parse>) => pipe(
  input,
  RA.filter(({ sets }) => sets.every(cubes => cubes.every(({ count, color }) => (bag[color] ?? Infinity) >= count))),
  RA.map(({ game }) => game),
  RA.reduce(0, (a, b) => a + b),
)

export const solve2 = (input: ReturnType<typeof parse>) => pipe(
  input,
  RA.map(({ sets }) => A.flatten(sets)),
  RA.map(flow(
    maxCountPerCube,
    R.toEntries,
    RA.map(([, v]) => v),
    RA.reduce(1, (a, b) => a * b))
  ),
  RA.reduce(0, (a, b) => a + b)
)

const maxCountPerCube = (cubes: Cubes) => cubes.reduce((acc, { count, color }) => ({...acc, [color]: Math.max(acc[color] ?? 0, count)}), {} as Record<string, number>)

export function partOne(input: ReturnType<typeof parse>) {
  return solve({red: 12, green: 13, blue: 14 })(input)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return solve2(input);
}