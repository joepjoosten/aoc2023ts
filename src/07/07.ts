import { tap, parseLineInput } from "@/utils";
import { pipe, identity} from "fp-ts/lib/function";
import { bindTo, bind, chain } from "parser-ts/lib/Parser";
import { notSpace } from "parser-ts/lib/char";
import { int, spaces1 } from "parser-ts/lib/string";
import * as A from 'fp-ts/lib/Array';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as R from 'fp-ts/lib/Record';
import * as N from 'fp-ts/lib/number';
import { Ord, fromCompare, getMonoid, contramap } from "fp-ts/lib/Ord";


const num = pipe(spaces1, chain(() => int));
const cards = pipe(notSpace, bindTo('0'), bind('1', () => notSpace), bind('2', () => notSpace), bind('3', () => notSpace), bind('4', () => notSpace))
const parser = 
  pipe(
    cards,
    bindTo('cards'),
    bind('bid', () => num),
  );

export const parse = (input: string) => pipe(
    parseLineInput(parser)(input),
    A.map(({ cards, bid }) => ({ 
      cards: Object.values(cards), 
      jokers: Object.values(cards).filter(x => x === 'J').length,
      grouped: pipe(
        Object.values(cards),
        NEA.groupBy(identity),
        R.toEntries,
        A.map(([key, val]) => [key, val.length] as [string, number]),
      ),
      bid }))
)  

type Hand = ReturnType<typeof parse>[0]

const CardRank = (ranks: string): Ord<string> => fromCompare<string>((x, y) => {
  if (ranks.indexOf(x) < ranks.indexOf(y)) return -1;
  if (ranks.indexOf(x) > ranks.indexOf(y)) return 1;
  return 0;
});

enum HandType {
  HighCard = 0,
  Pair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  FullHouse = 4,
  FourOfAKind = 5,
  StraightFlush = 6,
}

const determineHandType = (jokers: boolean) => (hand: Hand): HandType => {
  let handType: HandType = HandType.StraightFlush;
  switch (hand.grouped.length) {
    case 5:
      handType = HandType.HighCard;
      break;
    case 4:
      handType = HandType.Pair;
      break;
    case 3:
      handType = hand.grouped[0]![1] === 2 || hand.grouped[1]![1] === 2 ? HandType.TwoPair : HandType.ThreeOfAKind;
      break;
    case 2:
      handType = hand.grouped[0]![1] === 4 || hand.grouped[0]![1] === 1 ? HandType.FourOfAKind : HandType.FullHouse;
      break;
    default:
      handType = HandType.StraightFlush;
  }
  
  if(jokers && hand.jokers > 0) {
    switch(hand.jokers) {
      case 5:
      case 4:
        return HandType.StraightFlush;
      case 3:
        if (handType === HandType.FullHouse) return HandType.StraightFlush;
        else return HandType.FourOfAKind;
      case 2:
        if (handType === HandType.ThreeOfAKind) return HandType.StraightFlush;
        if (handType === HandType.TwoPair) return HandType.FourOfAKind;
        if (handType === HandType.Pair) return HandType.ThreeOfAKind;
      case 1:
        if(handType === HandType.FourOfAKind) return HandType.StraightFlush;
        if(handType === HandType.ThreeOfAKind) return HandType.FourOfAKind;
        if(handType === HandType.TwoPair) return HandType.FullHouse;
        if(handType === HandType.Pair) return HandType.ThreeOfAKind;
        else return HandType.Pair;
      default:
        return handType;
    }
  } else {
    return handType;
  }
}

const compareHandType = (jokers:boolean) => contramap<HandType, Hand>(determineHandType(jokers))(N.Ord);
const compareHighCard = (ranks: string) => contramap<string[], Hand>(x => x.cards)(A.getOrd(CardRank(ranks)));

const normalRank = '23456789TJQKA';
const jokerRank =  'J23456789TQKA';

export function partOne(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    A.sortBy([compareHandType(false), compareHighCard(normalRank)]),
    A.mapWithIndex((i, x) => ((i+1) * x.bid)),
    A.reduce(0, (a, b) => a + b)
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return pipe(
    input,
    A.sortBy([compareHandType(true), compareHighCard(jokerRank)]),
    A.map(tap((hand) => console.log(`${hand.cards.join('')} ${determineHandType(true)(hand)}`))),
    A.mapWithIndex((i, x) => ((i+1) * x.bid)),
    A.reduce(0, (a, b) => a + b)
  )
}