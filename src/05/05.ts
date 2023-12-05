import { parseInput, log } from "@/utils";
import { pipe } from "fp-ts/lib/function";
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

const mapDiffes = (seed: Diff, diffs: Diff[]): Diff[] => {
  const filtered = diffs.filter(({ start, end }) => seed.end >= start || seed.start <= end);
  return filtered.length === 0 ? [seed] : filtered.flatMap(({ start, end, diff }) => {
    const result: Diff[] = [];
    if(seed.start < start) result.push({start: seed.start, end: start - 1, diff: seed.diff});
    result.push({start: Math.max(seed.start + diff, start + diff), end: Math.min(seed.end + diff, end + diff), diff: seed.diff + diff});
    if(seed.end > end) result.push({start: end, end: seed.end, diff: seed.diff});
    return result;
  });
}

type Diff = { start: number; end: number; diff: number };

export function partTwo({ seeds, maps }: ReturnType<typeof parse>) {
  const diffs = pipe(
    maps,
    A.map(A.map(({ src, len, dest }) => ({start: src, end: src + len - 1, diff: dest - src} as Diff))),
  );
  const seedDiffs = pipe(
    Array.from(seeds),
    A.chunksOf(2),
    A.map(([a, b]) => ({start: a, end: a + (b ?? 0) - 1, diff: 0} as Diff)),
  )

  const mappers = pipe(
    diffs,
    A.map((diff) => pipe(
      seedDiffs,
      A.flatMap((seed) => mapDiffes(seed, diff)),
      log('seedDiffs'),
      A.reduce(diff, (acc, seed) => mapDiffes(seed, acc)),
    ))
  );

  //console.log(JSON.stringify(mappers, null, 2))
  return false;
}