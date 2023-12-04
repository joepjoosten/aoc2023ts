import { pipe } from 'fp-ts/function';
import { chain, sepBy, manyTill, bind, bindTo } from "parser-ts/Parser";
import { int, string, spaces } from 'parser-ts/string';

const cardNumber = pipe(string("Card"), chain(() => spaces), chain(() => int));
const num = pipe(spaces, chain(() => int));

const lineParser = pipe(sepBy(string('\n'), pipe(
  cardNumber,
  bindTo('card'),
  chain(() => string(':')),
  bind('winning', () => manyTill(num, string(' |'))),
  bind('choses')
))

export const parse = (input: string) => pipe()

export function partOne(input: ReturnType<typeof parse>) {}

export function partTwo(input: ReturnType<typeof parse>) {}