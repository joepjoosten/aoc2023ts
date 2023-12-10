import { describe, expect, it } from 'bun:test'
import { applyMappings, parse, partOne, partTwo } from './05'

const { default: example } = await import(`@/05/example.txt`)

describe('Day 5', () => {
  describe('Part One', () => {
    it('should pass the test input from day 5 part 1', () => {
      expect(partOne(parse(example))).toBe(35)
    });
  })
  
  describe('Part Two', () => {
    it('should pass the test input from day 5 part 2', () => {
      expect(partTwo(parse(example))).toBe(46)
    });
  })
})