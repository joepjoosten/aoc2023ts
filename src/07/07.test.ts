import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './07'

const { default: example } = await import(`@/07/example.txt`)

describe('Day 7', () => {
  describe('Part One', () => {
    it('should pass the test input from day 7 part 1', () => {
      expect(partOne(parse(example))).toBe(6440)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 7 part 2', () => {
      expect(partTwo(parse(example))).toBe(5905)
    });
  })
})