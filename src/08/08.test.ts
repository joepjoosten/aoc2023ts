import { describe, expect, it } from 'bun:test'
import { parse, partOne, partTwo } from './08'

const { default: example } = await import(`@/08/example.txt`)
const { default: example2 } = await import(`@/08/example2.txt`)

describe('Day 8', () => {
  describe('Part One', () => {
    it('should pass the test input from day 8 part 1', () => {
      expect(partOne(parse(example))).toBe(6)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 8 part 2', () => {
      expect(partTwo(parse(example2))).toBe(6)
    });
  })
})