import React, { useEffect, useState } from "react";
import { baseRadius, nodeGapFor } from "src/config";

const nodeGap = nodeGapFor(baseRadius);

export default function EphemeralNode(props: { version; node: EphemeralNode; x; y; radius }) {
  const { version, node, x, y, radius } = props;

  if (!node) {
    return null;
  } else {
    return (
      <React.Fragment>
        {node.left ? (
          <>
            <line strokeWidth="1.5px" stroke="blue" x1={x - nodeGap} y1={y + nodeGap} x2={x} y2={y} />
            <EphemeralNode version={version} node={node.left} x={x - nodeGap} y={y + nodeGap} radius={radius} />
          </>
        ) : null}
        {node.right ? (
          <>
            <line strokeWidth="1.5px" stroke="green" x1={x + nodeGap} y1={y + nodeGap} x2={x} y2={y} />
            <EphemeralNode version={version} node={node.right} x={x + nodeGap} y={y + nodeGap} radius={radius} />
          </>
        ) : null}
        <circle cx={x} cy={y} r={radius} fill="white" strokeWidth={1} stroke="black" />
        <text textAnchor="middle" alignmentBaseline="central" x={x} y={y}>
          {node.value}
        </text>
      </React.Fragment>
    );
  }
}
