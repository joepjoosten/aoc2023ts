import { fold } from 'fp-ts/lib/Either'
import { identity, pipe } from 'fp-ts/lib/function'
import { Parser, sepBy } from 'parser-ts/lib/Parser'
import { run } from 'parser-ts/lib/code-frame'
import { string } from 'parser-ts/lib/string'

export const parseLineInput =
  <T>(entryParser: Parser<string, T>, seperator = string('\n')) =>
  (input: string): T[] =>
    pipe(
      run(pipe(sepBy(seperator, entryParser)), input),
      fold(() => {
        throw new Error('Parse error')
      }, identity)
    )

export const parseInput =
  <T>(parser: Parser<string, T>) =>
  (input: string): T =>
    pipe(
      run(parser, input),
      fold((e) => {
        throw new Error(`Parse error: ${e}`)
      }, identity)
    )

export const log = <A>(prefix: string) => (a: A): A => {
  console.log(prefix, a);
  return a;
};

export const tap = <A>(f: (a: A) => void) => (a: A): A => {
  f(a);
  return a;
}