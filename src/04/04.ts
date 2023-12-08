import { parseLineInput } from '@/utils';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { none, some } from 'fp-ts/lib/Option';
import { bind, bindTo, chain, many, manyTill } from "parser-ts/Parser";
import { int, spaces, spaces1, string } from 'parser-ts/string';

const cardNumber = pipe(string("Card"), chain(() => spaces), chain(() => int));
const num = pipe(spaces1, chain(() => int));

const cardParser = 
  pipe(
    cardNumber,
    bindTo('card'),
    bind('winning', () => pipe(string(':'), chain(() => manyTill(num, string(' |'))))),
    bind('chosen', () => many(num))
  );

export const parse = (input: string) => parseLineInput(cardParser)(input);

export function partOne(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    A.map(({ winning, chosen }) => chosen.map(c => winning.includes(c) ? 1 : 0)),
    A.map(A.reduce(0, (a, b) => a + b)),
    A.map(n => n > 0 ? Math.pow(2, n-1) : 0),
    A.reduce(0, (a, score) => a + score)
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    A.map(({ winning, chosen }) => chosen.map(c => winning.includes(c) ? 1 : 0)),
    A.map(A.reduce(0, (a, b) => a + b)),
    A.reduceWithIndex([] as {wins: number, copies: number}[], (i, acc, n) => pipe(
        acc,
        A.reverse,
        A.filterMapWithIndex((j, {wins, copies}) => wins > j ? some(copies) : none),
        A.reduce(0, (a, b) => a + b),
        (copies) => [...acc, {wins: n, copies: 1 + copies}]
      )
    ),
    A.reduce(0, (a, {copies}) => a + copies)
  );
}