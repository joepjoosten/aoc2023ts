import { parseInput, tap } from "@/utils";
import { ord } from "fp-ts";
import { aperture } from "fp-ts-std/Array";
import * as A from 'fp-ts/lib/Array';
import * as I from 'fp-ts/lib/Identity';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { flow, pipe } from "fp-ts/lib/function";
import * as N from 'fp-ts/lib/number';
import { bind, bindTo, chain, manyTill, sepBy } from "parser-ts/lib/Parser";
import { many1, notSpace } from "parser-ts/lib/char";
import { int, spaces1, string } from "parser-ts/lib/string";

const num = pipe(spaces1, chain(() => int));
const seeds = pipe(string('seeds:'), chain(() => manyTill(num, string('\n\n'))))
const row = pipe(int, bindTo('dest'), bind('src', () => num), bind('len', () => num))
const almanacMap = pipe(manyTill(many1(notSpace), string(' map:\n')), chain(() => sepBy(string('\n'), row)));
const almanac = pipe(seeds, bindTo('seeds'), bind('maps', () => sepBy(string('\n\n'), almanacMap)));

export const parse = (input: string) => parseInput(almanac)(input);  

const sortBySrc = ord.contramap((x: { src: number; dest: number; len: number }) => x.src)(N.Ord);

export function partOne({ seeds, maps }: ReturnType<typeof parse>) {
  const mappers = pipe(
    maps,
    A.map(A.sort(sortBySrc)),
    A.map((mappings) => (seed: number) => {
      const mapping = mappings.find(({ src, len }) => seed >= src && seed < src + len);
      return mapping ? seed + mapping.dest - mapping.src: seed;
    }),
  );
  return pipe(
      seeds,
      RA.map((seed) => pipe(mappers, A.reduce(seed, (acc, mapper) => mapper(acc)))),
      RA.reduce(Infinity, (a, b) => Math.min(a, b))
  )
}

export const applyMappings = (mappers: Mapping[]) => (seed: Seed): Seed[] => {
  return pipe(
    mappers,
    A.filter(({ end }) => end >= seed.start),
    A.sortBy([sortByStart]),
    I.bindTo('sorted'),
    I.bind('diffs', ({ sorted }) => pipe(
      sorted,
      A.map(({ diff }) => diff),
      A.flatMap((diff) => [diff, 0]),
      (b) => sorted[0] && sorted[0].start < seed.start 
        ? b : [0, ...b]
    )),
    ({ sorted, diffs }) => pipe(
      sorted,
      A.flatMap(({start, end}) => [start, end]),
      A.filter((x) => x >= seed.start && x <= seed.end),
      A.prepend(seed.start),
      A.append(seed.end),
      aperture(2),
      A.mapWithIndex((i, [a, b]) => ({start: a! + diffs[i]!, end: b! + diffs[i]!})),
      A.filter(({start, end}) => start !== end),
    )
  );
}

const sortByStart = ord.contramap((x: { start: number; }) => x.start)(N.Ord);
type Seed = { start: number; end: number; };
type Mapping = Seed & { diff: number };

export function partTwo({ seeds, maps }: ReturnType<typeof parse>) {
  const mappers = pipe(
    maps,
    A.map(A.map(({ src, len, dest }) => ({start: src, end: src + len, diff: dest - src} as Mapping))),
  );
  const seedM = pipe(
    Array.from(seeds),
    A.chunksOf(2),
    A.map(([a, b]) => ({start: a, end: a + b!} as Seed)),
  )

  return pipe(
    mappers,
    A.reduce(seedM, (acc, mappings) => pipe(
      acc,
      A.map(applyMappings(mappings)),
      A.flatten
    )),
    A.map(({start}) => start),
    A.reduce(Infinity, (a, b) => Math.min(a, b))
  );
}