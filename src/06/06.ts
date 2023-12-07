import { parseInput } from "@/utils";
import { pipe } from "fp-ts/lib/function";
import { chain, bind, bindTo, manyTill } from "parser-ts/lib/Parser";
import { int, spaces, string } from "parser-ts/lib/string";
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray';

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
    RA.map(([time, distance]) => ({ time, distance }))
)

export function partOne(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    RA.map(({ time, distance }) => ({ distance, time, range: RNEA.range(0, time)})),
    RA.flatMap(({ distance, time, range }) => pipe(
      range,
      RNEA.map((pressTime) => (time - pressTime) * pressTime),
      RNEA.filter(travelled => travelled >= distance),
    )
  )
}

export function partTwo(input: ReturnType<typeof parse>) {}