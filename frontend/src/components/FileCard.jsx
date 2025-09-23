import React from "react";
import "./FileCard.css";

export default function FileCard({ name, size, tx, date }) {
  return (
    <div className="file-card">
      <h3>{name}</h3>
      <p>{size} • {date}</p>
      <p className="tx">Tx: {tx}</p>
      <div className="buttons">
        <button className="download">Download</button>
        <button className="share">Share</button>
        <button className="delete">Delete</button>
      </div>
    </div>
  );
}
