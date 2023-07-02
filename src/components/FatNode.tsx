import React, { useEffect, useState } from "react";
import { scaleRadius, nodeGapFor } from "src/config";
import EmptyNode from "./EmptyNode";

export default function FatNode(props: { fatnode: FatNode; x: number; y: number; radius: number }) {
  const { x, y, fatnode, radius } = props;
  const { lefts, rights, values } = fatnode;
  const [r, setR] = useState(scaleRadius(radius, fatnode));
  const [nodeGap, setNodeGap] = useState(nodeGapFor(radius));

  useEffect(() => {
    setR(scaleRadius(radius, fatnode));
    setNodeGap(nodeGapFor(radius));
  }, [radius, fatnode]);

  return (
    <React.Fragment>
      {lefts.map((left, index) => {
        const [version, node] = left;
        const depth = node ? node.depth : fatnode.depth + 1;
        const xx = x - nodeGap * (lefts.length - index),
          yy = y + nodeGap * (depth - fatnode.depth);

        return renderFatNode(version, node, index, depth, fatnode.depth, nodeGap, radius, x, y, xx, yy, false);
      })}
      {rights.map((right, index) => {
        const [version, node] = right;
        const depth = node ? node.depth : fatnode.depth + 1;
        const xx = x + nodeGap * (index + 1),
          yy = y + nodeGap * (depth - fatnode.depth);

        return renderFatNode(version, node, index, depth, fatnode.depth, nodeGap, radius, x, y, xx, yy, true);
      })}
      <circle cx={x} cy={y} r={r} fill="white" strokeWidth={1} stroke="black" />

      <text textAnchor="middle" alignmentBaseline="central" x={x} y={y}>
        {values.length <= 1
          ? `(${values[0][0]}, ${values[0][1]})`
          : values.map((v, index) => {
              if (index == 0) {
                return <tspan key={index} x={x} dy={`-${0.5 * (values.length - 1)}em`}>{`(${v[0]}, ${v[1]})`}</tspan>;
              } else {
                return <tspan key={index} x={x} dy={`${1 + index * 0.1}em`}>{`(${v[0]}, ${v[1]})`}</tspan>;
              }
            })}
      </text>
    </React.Fragment>
  );
}

function renderFatNode(version, node, index, depth, currentDepth, nodeGap, radius, x, y, xx, yy, right: boolean) {
  let nodeElem, edgeElem;

  if (depth > currentDepth + 1) {
    edgeElem = (
      <path
        key={index + 1}
        id={`${x}-${y}-${xx}-${yy}`}
        d={`M ${x} ${y} l ${1} ${1} A ${nodeGap * (depth - currentDepth)} ${nodeGap * 3} 0 0 0 ${xx} ${yy}`}
        strokeWidth="1.5px"
        stroke={right? "green" : "blue"}
        fill="none"
      />
    );
  } else {
    edgeElem = (
      <path
        key={index + 1}
        id={`${x}-${y}-${xx}-${yy}`}
        d={right ? `M ${x} ${y} L ${xx} ${yy}` : `M ${xx} ${yy} L ${x} ${y}`}
        strokeWidth="1.5px"
        stroke={right? "green" : "blue"}
      />
    );
  }

  if (node != null) {
    nodeElem = <FatNode key={index + 2} fatnode={node} x={xx} y={yy} radius={radius} />;
  } else {
    nodeElem = <EmptyNode key={index + 2} radius={radius} x={xx} y={yy} />;
  }

  const versionElem = (
    <text dy="-3px" key={index}>
      <textPath
        href={`#${x}-${y}-${xx}-${yy}`}
        textAnchor="middle"
        startOffset={"50%"}
        lengthAdjust="spacingAndGlyphs"
        spacing="auto">
        {version}
      </textPath>
    </text>
  );

  return [edgeElem, versionElem, nodeElem];
}
