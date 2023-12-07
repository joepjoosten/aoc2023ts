import { parseInput, log, tap } from "@/utils";
import { flow, pipe } from "fp-ts/lib/function";
import { many1, notSpace, oneOf, unicodeLetter } from "parser-ts/lib/char";
import { bindTo, bind, chain, manyTill, sepBy, Parser, many } from "parser-ts/lib/Parser";
import { int, spaces1, string } from "parser-ts/lib/string";
import * as A from 'fp-ts/lib/Array';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as NEA from 'fp-ts/lib/ReadonlyNonEmptyArray';
import * as N from 'fp-ts/lib/number';
import * as T from 'fp-ts/lib/Tuple';
import { io, ord } from "fp-ts";

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

const applyMappings = (mappers: Mapping[]) => (seed: Seed): Seed[] => {
  return pipe(
    mappers,
    A.sort(sortByStart),
    A.filter(({ start, end }) => (start >= seed.start && start <= seed.end) || (end >= seed.start && end <= seed.end)),
    (m) => {
      
    }
  ) ?? [seed];
}

const sortByStart = ord.contramap((x: { start: number; }) => x.start)(N.Ord);
type Seed = { start: number; end: number; };
type Mapping = Seed & { diff: number };

export function partTwo({ seeds, maps }: ReturnType<typeof parse>) {
  const mappers = pipe(
    maps,
    A.map(
      flow(
        A.map(({ src, len, dest }) => ({start: src, end: src + len - 1, diff: dest - src} as Mapping)),
        log('mappings')
      )
    ),
  );
  const seedM = pipe(
    Array.from(seeds),
    A.chunksOf(2),
    A.map(([a, b]) => ({start: a, end: a + (b ?? 0) - 1} as Seed)),
  )

  return pipe(
    mappers,
    A.reduce(seedM, (acc, mappings) => pipe(
      acc,
      tap((seeds) => A.seed),
      A.map(applyMappings(mappings)), 
      log('acc'),
      A.flatten
    )),
    A.map(({start}) => start),
    A.reduce(Infinity, (a, b) => Math.min(a, b))
  );
}