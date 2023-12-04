import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './02'

const { default: example } = await import(`@/02/example.txt`)

describe('Day 2', () => {
  describe('Part One', () => {
    it('should pass the test input from day 2 part 1', () => {
      expect(partOne(parse(example))).toBe(8)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 2 part 2', () => {
      expect(partTwo(parse(example))).toBe(2286)
    });
  })
})