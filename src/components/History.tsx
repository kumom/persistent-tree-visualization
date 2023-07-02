import React from "react";

export default function History(props: { history: HistoryOps[] }) {
  const { history } = props;

  return (
    <div id="history" style={{ width: "7.5em", borderRight: "0.5px solid grey" }}>
      <ul>
        {history.map((h, index) => (
          <li key={index}>{`${h.version}: ${h.op == "i" ? "Insert" : "Delete"} ${h.value}`}</li>
        ))}
      </ul>
    </div>
  );
}
