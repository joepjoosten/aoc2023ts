import { describe, expect, it } from 'bun:test'
import { parse, partOne } from './03'

const { default: example } = await import(`@/03/example.txt`)

describe('Day 3', () => {
  describe('Part One', () => {
    it('should work', () => {
      const input = parse(example)
      console.log(input)
      console.log(partOne(input))
    })
  })

  describe('Part Two', () => {})
})
