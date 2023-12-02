import { fold } from 'fp-ts/lib/Either'
import { identity, pipe } from 'fp-ts/lib/function'
import { Parser, sepBy } from 'parser-ts/lib/Parser'
import { run } from 'parser-ts/lib/code-frame'
import { string } from 'parser-ts/lib/string'

export const parseInput =
  <T>(entryParser: Parser<string, T>, seperator = string('\n')) =>
  (input: string): T[] =>
    pipe(
      run(pipe(sepBy(seperator, entryParser)), input),
      fold(() => {
        throw new Error('Parse error')
      }, identity),
    )
