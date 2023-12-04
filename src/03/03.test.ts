import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './03'

const { default: example } = await import(`@/03/example.txt`)

describe('Day 3', () => {
  describe('Part One', () => {
    it('should pass the test input from day 3 part 1', () => {
      expect(partOne(parse(example))).toBe(4361)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 3 part 2', () => {
      expect(partTwo(parse(example))).toBe(467835)
    });
  })
})