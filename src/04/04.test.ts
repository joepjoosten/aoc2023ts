import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './04'

const { default: example } = await import(`@/04/example.txt`)

describe('Day 4', () => {
  describe('Part One', () => {
    it('should pass the test input from day 4 part 1', () => {
      expect(partOne(parse(example))).toBe(13)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 4 part 2', () => {
      expect(partTwo(parse(example))).toBe(30)
    });
  })
})