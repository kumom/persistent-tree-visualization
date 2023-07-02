import React, { useEffect, useRef, useState } from "react";
import FatNode from "./FatNode";
import tree from "src/algo/fatnode";
import EmptyNode from "./EmptyNode";
import { scaleRadius, nodeGapFor } from "src/config";
import ZoomTool from "./ZoomTool";
import Button from "./Button";

export default function PersistentTree(props: { radius; setHistory; setVersion; w; h }) {
  const { radius, setHistory, setVersion, w, h } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  return (
    <div ref={ref} id="persistent-view" className="view" style={{ height: "50%" }}>
      <Menu setHistory={setHistory} setVersion={setVersion} setScale={setScale} />
      <svg viewBox={`0 0 ${w * scale} ${h * scale}`} width={"100%"} height={"100%"} xmlns="http://www.w3.org/2000/svg">
        {tree.roots.map((root, index) => {
          const [version, node] = root;
          const r = scaleRadius(radius, root[1]),
            x = (w / tree.roots.length) * (index + 0.5),
            y = r + nodeGapFor(r);

          let nodeElem;
          if (root[1]) {
            nodeElem = <FatNode key={index + 2} fatnode={node} x={x} y={y} radius={r} />;
          } else {
            nodeElem = <EmptyNode key={index + 2} radius={r / 2} x={x} y={y} />;
          }

          // "+5" is hard coded here and works for the current font size
          return [
            <text key={index} x={x + 5} y={(y + r) / 2}>
              {version}
            </text>,
            <line key={index + 1} strokeWidth="1.5px" stroke="black" x1={x} y1={r} x2={x} y2={y} />,
            nodeElem,
          ];
        })}
      </svg>
    </div>
  );
}

function Menu(props: { setHistory; setVersion; setScale }) {
  const { setHistory, setVersion, setScale } = props;
  const [value, setValue] = useState(0);

  return (
    <div className="menu">
      <Modifier value={value} setHistory={setHistory} setValue={setValue} setVersion={setVersion} />
      <ZoomTool setScale={setScale} />
    </div>
  );
}

function Modifier(props: { value; setHistory; setVersion; setValue }) {
  const { value, setVersion, setHistory, setValue } = props;
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <button
        className="menu-button"
        onClick={() => {
          if (tree && tree.remove(value)) {
            setVersion(tree.currentVersion());
            setHistory((h) => h.concat({ op: "d", version: tree.currentVersion(), value: value }));
          }
        }}>
        Remove
      </button>
      <Button value={value} setValue={setValue} styleClass={"button-wrapper persistent"} />
      <button
        className="menu-button"
        onClick={() => {
          if (tree && tree.insert(value)) {
            setVersion(tree.currentVersion());
            setHistory((h) => h.concat({ op: "i", version: tree.currentVersion(), value: value }));
          }
        }}>
        Insert
      </button>
    </div>
  );
}
