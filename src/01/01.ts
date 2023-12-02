import * as S from 'fp-ts-std/string'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as N from 'fp-ts/number'
import * as T from 'fp-ts/Tuple'
import { flow, pipe } from 'fp-ts/lib/function'
import { Monoid, concatAll } from 'fp-ts/lib/Monoid'

export const parse = flow(S.lines)

const matchingNumbers: NEA.NonEmptyArray<[string, string]> = [
  ['1', '1'],
  ['2', '2'],
  ['3', '3'],
  ['4', '4'],
  ['5', '5'],
  ['6', '6'],
  ['7', '7'],
  ['8', '8'],
  ['9', '9']
]

const matchingCountingWords: NEA.NonEmptyArray<[string, string]> = [
  ['1', 'one'],
  ['2', 'two'],
  ['3', 'three'],
  ['4', 'four'],
  ['5', 'five'],
  ['6', 'six'],
  ['7', 'seven'],
  ['8', 'eight'],
  ['9', 'nine']
]

const compareSnd = (
  f: (lhs: number, rhs: number) => number,
  init: number
): Monoid<[string, number]> => ({
  concat: (lhs, rhs) => (f(T.snd(lhs), T.snd(rhs)) === T.snd(lhs) ? lhs : rhs),
  empty: ['', init]
})

export const minSnd = compareSnd(Math.min, Infinity)
export const maxSnd = compareSnd(Math.max, -Infinity)
export const findFirstIndex = (line: string, search: string) =>
  line.indexOf(search) < 0 ? Infinity : line.indexOf(search)
export const findLastIndex = (line: string, search: string) =>
  line.lastIndexOf(search) < 0 ? -Infinity : line.lastIndexOf(search)

export const findNumberChar =
  (
    needles: NEA.NonEmptyArray<[string, string]>,
    m: Monoid<[string, number]>,
    find: (line: string, search: string) => number
  ) =>
  (line: string) =>
    pipe(
      needles,
      NEA.map(([k, v]) => [k, find(line, v)] as [string, number]),
      concatAll(m),
      T.fst
    )

const solve = (needles: NEA.NonEmptyArray<[string, string]>) =>
  flow(
    RNEA.map((line: string) => {
      return `${findNumberChar(
        needles,
        minSnd,
        findFirstIndex
      )(line)}${findNumberChar(needles, maxSnd, findLastIndex)(line)}`
    }),
    RNEA.map(parseInt),
    RNEA.concatAll(N.MonoidSum)
  )

export function partOne(input: ReturnType<typeof parse>) {
  return solve(matchingNumbers)(input)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return solve(matchingNumbers.concat(matchingCountingWords))(input)
}
