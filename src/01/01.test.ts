import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './01'

const { default: example } = await import(`@/01/example.txt`)
const { default: example2 } = await import(`@/01/example2.txt`)

describe('Day 1', () => {
  describe('Part One', () => {
    it('should pass the test input from day 1 part 1', () => {
      expect(partOne(parse(example))).toBe(142)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 1 part 2', () => {
      expect(partTwo(parse(example2))).toBe(281)
    });
  })
})