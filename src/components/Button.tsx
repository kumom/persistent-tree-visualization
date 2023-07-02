import React from "react";

export default function Button(props: { setValue; value; styleClass }) {
  const { value, setValue, styleClass } = props;
  return (
    <span className={styleClass} style={{ margin: "0 10px" }}>
      <button onClick={(e) => setValue((v) => v - 1)}>{"<"}</button>
      <input type="number" name="version" value={value} onChange={(e) => setValue(Number(e.target.value))} />
      <button onClick={(e) => setValue((v) => v + 1)}>{">"}</button>
    </span>
  );
}
