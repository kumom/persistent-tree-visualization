export const baseRadius = 23;

export function scaleRadius(radius: number, node: FatNode): number {
  if (node) {
    return Math.pow(1.1, node.values.length) * radius;
  } else {
    return radius;
  }
}

export function nodeGapFor(radius: number): number {
  return radius * 4;
}
