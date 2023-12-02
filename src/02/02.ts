import { flow, identity, pipe } from "fp-ts/function"
import { lines } from "fp-ts-std/string"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as T from "fp-ts/Tuple";
import * as RA from "fp-ts/ReadonlyArray";
import * as R from "fp-ts/Record";
import { many1, lower } from "parser-ts/char";
import { spaces1, string, int,  } from "parser-ts/string";
import { chain, Parser, map, bindTo, bind, sepBy } from "parser-ts/Parser";
import { run } from "parser-ts/code-frame";
import * as E from "fp-ts/Either";

const match = (regex: RegExp) => (s: string): RNEA.ReadonlyNonEmptyArray<string> => (s.match(regex) ?? []) as RNEA.ReadonlyNonEmptyArray<string>

type gameParser = Parser<string, { game: number, sets: {count: number, color: string}[][]}>;

const gameNumber = pipe(string("Game"), chain(() => spaces1), chain(() => int));
const cube = pipe(spaces1, bind('count', () => int), bind('color', () => pipe(spaces1, chain(() => many1(lower)))));
const cubes = pipe(sepBy(string(', '), cube));
const set = pipe(sepBy(string('; '), cubes));
const game: gameParser = pipe(gameNumber, bindTo('game'), bind('sets', () => pipe(string(':'), chain(() => set))));

export const parse2 = (input: string) => pipe(
  input,
  lines,
  RNEA.map((line) => run(game, line)),
  RNEA.map(E.fold(() => { throw new Error('Parse error') }, identity))
)

export const parse = (input: string) => pipe(
  input,
  lines,
  RNEA.map((line) => line.split(":") as [string, string]),
  RNEA.map(T.mapFst((game) => parseInt(match(/Game (\d+)/)(game)[1] ?? ''))),
  RNEA.map(T.mapSnd((sets) => sets.split(";"))),
  RNEA.map(T.mapSnd((set) => set.map(hand => pipe(hand.split(","), RA.map(flow(match(/(\d+) (\w+)/), RNEA.tail, (a) => [parseInt(a[0] ?? '') , a[1]] as [number, string])))))),
)

export const solve = (bag: Record<string, number>) => (input: ReturnType<typeof parse>) => pipe(
  input,
  RA.filter(([, sets]) => sets.every(hands => hands.every(([count, color]) => (bag[color] ?? Infinity) >= count))),
  RA.map(([game, ]) => game),
  RA.reduce(0, (a, b) => a + b),
)

export const solve2 = (input: ReturnType<typeof parse>) => pipe(
  input,
  RA.map(([, sets]) => RA.flatten(sets)),
  RA.map(flow(
    concatHands,
    R.toEntries,
    RA.map(([, v]) => v),
    RA.reduce(1, (a, b) => a * b))
  ),
  RA.reduce(0, (a, b) => a + b)
)

const concatHands = (hands: readonly [number, string][]) => hands.reduce((acc, [count, color]) => ({...acc, [color]: Math.max(acc[color] ?? 0, count)}), {} as Record<string, number>)

export function partOne(input: ReturnType<typeof parse>) {
  return solve({red: 12, green: 13, blue: 14 })(input)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return solve2(input);
}