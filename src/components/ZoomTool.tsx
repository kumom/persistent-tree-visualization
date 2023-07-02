import React from "react";

export default function ZoomTool(props: { setScale }) {
  return (
    <div className="zoom-tool">
      <button
        className="zoom-out zoom"
        onClick={(e) => {
          props.setScale((s) => s * 1.1);
        }}
      />
      <button
        className="zoom-in zoom"
        onClick={(e) => {
          props.setScale((s) => Math.max(0.1, s / 1.1));
        }}
      />
    </div>
  );
}
