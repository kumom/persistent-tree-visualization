import React from "react";

export default function EmptyNode(props: { radius: number; x: number; y: number }) {
  const { radius, x, y } = props;

  return <rect width={radius} height={radius} x={x - radius / 2} y={y - radius / 2} strokeWidth={"2px"} />;
}
