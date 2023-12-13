import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './10'

const { default: example } = await import(`@/10/example.txt`)

describe('Day 10', () => {
  describe('Part One', () => {
    it('should pass the test input from day 10 part 1', () => {
      expect(partOne(parse(example))).toBe(8)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 10 part 2', () => {
      expect(partTwo(parse(example))).toBe(undefined)
    });
  })
})