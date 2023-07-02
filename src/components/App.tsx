import React, { useEffect, useRef, useState } from "react";
import PersistentTree from "./PersistentTree";
import tree from "src/algo/fatnode";
import History from "./History";
import EphemeralTree from "./EphemeralTree";
import { baseRadius } from "src/config";

export default function App() {
  const app = useRef<HTMLDivElement>();
  const ref = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(baseRadius);
  const [history, setHistory] = useState<HistoryOps[]>([]);
  const [version, setVersion] = useState(tree.currentVersion());
  const [w, setW] = useState(200);
  const [h, setH] = useState(200);

  useEffect(() => {
    function resize() {
      setRadius(Math.max(baseRadius, (Math.min(window.innerHeight, window.innerWidth) / 800) * baseRadius));
      setW(ref.current.offsetWidth / 2);
      setH(ref.current.offsetHeight / 2);
    }

    window.addEventListener("resize", resize);

    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div id="app" ref={app} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ fontSize: "1.2em", margin: "0" }}>Partially Persistent Binary Search Trees (Fat Node Method)</h1>
      <div id="visualization" style={{ display: "flex", width: "100%", height: "100%" }}>
        <History history={history} />
        <div
          ref={ref}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            height: "100%",
            width: "100%",
          }}>
          <PersistentTree
            radius={radius}
            setHistory={setHistory}
            setVersion={setVersion}
            w={w}
            h={h}
          />
          <div style={{ width: "100%", height: "1px", borderBottom: "1px solid #ccc" }} />
          <EphemeralTree latestVersion={version} radius={radius} w={w} h={h} />
        </div>
      </div>
    </div>
  );
}
