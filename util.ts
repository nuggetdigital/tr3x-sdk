const encoder: TextEncoder = new TextEncoder()
const decoder: TextDecoder = new TextDecoder()

export function encode(str: string): Uint8Array {
  return encoder.encode(str)
}

export function decode(buf: Uint8Array): string {
  return decoder.decode(buf)
}

export function commaList(arr: string[], conjunction: string = "and"): string {
  return arr.reduce((acc: string, cur: string, i: number): string => {
    if (i === arr.length - 2 && arr.length > 2) {
      acc += cur + ", " + conjunction + " "
    } else if (i === arr.length - 2 && arr.length === 2) {
      acc += cur + " " + conjunction + " "
    } else if (i !== arr.length - 1) {
      acc += cur + ", "
    } else {
      acc += cur
    }
    return acc
  }, "")
}
