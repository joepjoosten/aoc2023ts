import { parseLineInput } from "@/utils";
import * as A from "fp-ts/Array";
import * as RA from "fp-ts/ReadonlyArray";
import * as R from "fp-ts/Record";
import { flow, pipe } from "fp-ts/function";
import { Parser, bind, bindTo, chain, sepBy } from "parser-ts/Parser";
import { lower, many1 } from "parser-ts/char";
import { int, spaces1, string, } from "parser-ts/string";

type Cube = { count: number, color: string };
type Cubes = Array<Cube>;
type Game = { game: number, sets: Array<Cubes> };

const gameNumber = pipe(string("Game"), chain(() => spaces1), chain(() => int));
const cube = pipe(spaces1, bind('count', () => int), bind('color', () => pipe(spaces1, chain(() => many1(lower)))));
const cubes = pipe(sepBy(string(','), cube));
const set = pipe(sepBy(string(';'), cubes));
const game: Parser<string, Game> = pipe(gameNumber, bindTo('game'), bind('sets', () => pipe(string(':'), chain(() => set))));

export const parse = parseLineInput(game)

const maxCountPerCube = (cubes: Cubes) => cubes.reduce((acc, { count, color }) => ({...acc, [color]: Math.max(acc[color] ?? 0, count)}), {} as Record<string, number>)

export function partOne(input: ReturnType<typeof parse>) {
  const possibleBag: Record<string, number> = {red: 12, green: 13, blue: 14 };
  return pipe(
    input,
    RA.filter(({ sets }) => sets.every(cubes => cubes.every(({ count, color }) => (possibleBag[color] ?? Infinity) >= count))),
    RA.map(({ game }) => game),
    RA.reduce(0, (a, b) => a + b),
  );
}

export function partTwo(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    RA.map(flow(
      ({ sets }) => A.flatten(sets),
      maxCountPerCube,
      R.toEntries,
      RA.map(([, v]) => v),
      RA.reduce(1, (a, b) => a * b))
    ),
    RA.reduce(0, (a, b) => a + b)
  );
}