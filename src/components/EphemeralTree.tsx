import React, { useEffect, useRef, useState } from "react";
import EphemeralNode from "./EphemeralNode";
import tree from "src/algo/fatnode";
import ZoomTool from "./ZoomTool";

export default function EphemeralTree(props: { latestVersion; radius; w; h }) {
  const { latestVersion, radius, w, h } = props;
  const [version, setVersion] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setVersion(Math.max(0, latestVersion));
  }, [latestVersion]);

  return (
    <div ref={ref} id="ephemeral-view" className="view" style={{ height: "50%" }}>
      <Menu version={version} setVersion={setVersion} latestVersion={latestVersion} setScale={setScale} />
      <svg viewBox={`0 0 ${w * scale} ${h * scale}`} width={"100%"} height={"100%"} xmlns="http://www.w3.org/2000/svg">
        <EphemeralNode version={version} x={w / 2} y={radius} node={tree.atVersion(version)} radius={radius / 1.5} />
      </svg>
    </div>
  );
}

function Menu(props: { version; setVersion; latestVersion; setScale }) {
  const { latestVersion, version, setVersion, setScale } = props;

  if (latestVersion == -1) {
    return null;
  } else return (
    <div className="menu">
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Tree at version {`${version}`}:</span>
        {latestVersion <= 0 ? null : (
          <input
            className="slider"
            type="range"
            min={0}
            max={latestVersion}
            step={1}
            onChange={(e) => setVersion(Number(e.target.value))}
            value={version}
            id="version-range"
            style={{ width: `${(latestVersion + 1) * 30}px`, marginLeft: "0.4em" }}
          />
        )}
      </div>
      <ZoomTool setScale={setScale} />
    </div>
  );
}
