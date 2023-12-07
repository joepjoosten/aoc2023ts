import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './06'

const { default: example } = await import(`@/06/example.txt`)

describe('Day 6', () => {
  describe('Part One', () => {
    it('should pass the test input from day 6 part 1', () => {
      expect(partOne(parse(example))).toBe(undefined)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 6 part 2', () => {
      expect(partTwo(parse(example))).toBe(undefined)
    });
  })
})