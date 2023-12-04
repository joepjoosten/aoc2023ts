type Parts = Array<{ partNumber: number; positions: number[] }>
type Symbols = Array<{ symbol: string; position: number }>



export function parse(input: string) {
  let width = 0;
  let height = 0;
  let partNumber = undefined;
  const parts: Parts = [];
  const symbols: Symbols = [];
  const engine = Array.from(input);
  for (let i = 0; i < engine.length; i++) {
    switch (engine[i]) {
      case '\n':
        width = width === 0 ? i : width;
        height++
        partNumber = undefined
        break;
      case '.':
        partNumber = undefined
        break;
      case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
        if (partNumber === undefined) {
          let isDigit = true
          let pos = 1
          let n = engine[i]
          const positions = [i - height]
          while (isDigit) {
            const next = engine[i + pos] ?? ''
            if ('0123456789'.includes(next)) {
              n = `${n}${next}`
              positions.push(i + pos - height)
              pos++
            } else {
              isDigit = false
            }
          }
          parts.push({
            partNumber: parseInt(n ?? ''),
            positions
          })
          i = i + pos - 1
        }
        break;
      default:
        partNumber = undefined
        symbols.push({
          symbol: engine[i] ?? '',
          position: i - height
        })
    }
  }
  return [parts, symbols, width, height] as const;
}


function adjecents(position: number, width: number) {
  return [
    position - width - 1,
    position - width,
    position - width + 1,
    position -1,
    position + 1,
    position + width -1,
    position + width,
    position + width + 1
  ]
}

export function partOne(input: ReturnType<typeof parse>) {
  const [parts, symbols, width] = input;
  const inspectPostitions = symbols.flatMap(({ position }) => adjecents(position, width));
  const adjecentParts = parts.filter(({ positions }) => positions.some(position => inspectPostitions.includes(position)));
  return adjecentParts.reduce((a, b) => a + b.partNumber, 0);
}

export function partTwo(input: ReturnType<typeof parse>) {
  const [parts, symbols, width] = input;
  const gearRations = symbols.filter(({symbol}) => symbol === '*').flatMap(({ position }) => {
    const adjecent = adjecents(position, width);
    const filteredParts = parts.filter(({ positions }) => positions.some(position => adjecent.includes(position)));
    if(filteredParts.length === 2) {
      return (filteredParts[0]?.partNumber ?? 1) * (filteredParts[1]?.partNumber ?? 1)
    }
    return 0
  });
  return gearRations.reduce((a, b) => a + b, 0);
}

