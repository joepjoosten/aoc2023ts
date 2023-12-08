import { parseInput } from "@/utils";
import { pipe } from "fp-ts/function";
import * as A from 'fp-ts/lib/Array';
import { bind, bindTo, chain, manyTill, sepBy1 } from "parser-ts/Parser";
import { alphanum, letter, many1 } from "parser-ts/char";
import { string } from "parser-ts/lib/string";

const instructionParser = manyTill(letter, string('\n\n'));
const nodeParser = pipe(
  many1(alphanum), bindTo('element'), 
  bind('L', () => pipe(string(' = ('), chain(() => many1(alphanum)))), 
  bind('R', () => pipe(string(', '), chain(() => many1(alphanum))))
);
const nodesParser = pipe(sepBy1(string(')\n'), nodeParser));

const parser = pipe(
  instructionParser,
  bindTo('instructions'),
  bind('nodes', () => nodesParser),
);

export const parse = (input: string) => pipe(
  parseInput(parser)(input),
  ({ instructions, nodes }) => ({
      instructions,
      nodes: new Map(
        pipe(
          nodes, 
          A.map(({element, L, R}) => [element, { L, R }])
        )
      )
  })
);

const numberOfSteps = (startNode: string, isEndNode: (node: string) => boolean) => ({instructions, nodes}: ReturnType<typeof parse>) => {
  let steps = 0;
  let currentNode = startNode;
  while (!isEndNode(currentNode)) {
    const instruction = instructions[steps % instructions.length] as 'L' | 'R';
    const node = nodes.get(currentNode)!;
    currentNode = node[instruction];
    steps++;
  }
  return steps;
}

export function partOne(input: ReturnType<typeof parse>) {
  return numberOfSteps('AAA', (node) => node.endsWith('ZZZ'))(input);
}

export function partTwo({instructions, nodes}: ReturnType<typeof parse>) {
  return pipe(
    Array.from(nodes.entries()).filter(([key, _]) => key.endsWith('A')).map(([key, _]) => key),
    A.map((startNode) => numberOfSteps(startNode, (node) => node.endsWith('Z'))({instructions, nodes})),
    A.reduce(1, (a, b) => lcm(a, b))
  );
}

const gcd = (a: number, b: number): number => b == 0 ? a : gcd (b, a % b)
const lcm = (a: number, b: number): number =>  a / gcd (a, b) * b