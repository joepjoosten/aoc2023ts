import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './09'

const { default: example } = await import(`@/09/example.txt`)

describe('Day 9', () => {
  describe('Part One', () => {
    it('should pass the test input from day 9 part 1', () => {
      expect(partOne(parse(example))).toBe(114)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 9 part 2', () => {
      expect(partTwo(parse(example))).toBe(2)
    });
  })
})