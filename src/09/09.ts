import { parseInput, parseLineInput } from '@/utils'
import { pipe } from 'fp-ts/lib/function'
import { alt, chain, map, sepBy1 } from 'parser-ts/lib/Parser'
import { int, string } from 'parser-ts/lib/string'
import { aperture } from 'fp-ts-std/Array'
import * as A from 'fp-ts/lib/Array'

const negativeNumber = pipe(string('-'), chain(() => int), map(n => -n))
const positiveOrNegative = pipe(int, alt(() => negativeNumber))
const numberRow = pipe(sepBy1(string(' '), positiveOrNegative))

export const parse = (input: string) => parseLineInput(numberRow)(input)

export const diff = (a: number[]): number[] => pipe(
  a,
  aperture(2),
  A.map(([x, y]) => y! - x!)
)

export const nextNumber = (a: number[]): number => {
  let current = a
  let lasts = [current[current.length - 1]!]
  while (current.some(x => x !== 0) && current.length > 1) {
    current = diff(current)
    lasts = [current[current.length - 1]!, ...lasts]
  }
  return lasts.reduce((a, b) => a + b, 0)
}

export const previousNumber = (a: number[]): number => {
  let current = a
  let firstNumbers = [current[0]!]
  while (current.some(x => x !== 0) && current.length > 1) {
    current = diff(current)
    firstNumbers = [current[0]!, ...firstNumbers]
  }
  return firstNumbers.reduce((a, b) => -a + b, 0)
}

export function partOne(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    A.map(nextNumber),
    A.reduce(0, (a, b) => a + b)
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    A.map(previousNumber),
    A.reduce(0, (a, b) => a + b)
  )
}
