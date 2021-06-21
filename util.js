export function commaList(arr, conjunction = "and") {
  return arr.reduce((acc, cur, i) => {
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
