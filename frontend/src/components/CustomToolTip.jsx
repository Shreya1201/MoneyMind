import { decodeEmoji } from "../utils/emojiCodec";
import { ThemeContext } from "../contexts/ThemeContext";
import React, { useContext } from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        background: theme === "dark" ? "rgba(20,27,45,0.85)" : "rgba(255,255,255,0.9)",
        color: theme === "dark" ? "#e0e0e0" : "#1f1f1f",
        border: `1px solid ${theme === "dark" ? "#3da58a" : "#ccc"}`,
        padding: "8px",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",      }}
    >
      {label && (
        <div style={{ fontWeight: "600", marginBottom: "6px" }}>
          {label}
        </div>
      )}
      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: index < payload.length - 1 ? "4px" : 0,
          }}
        >
          <span style={{ marginRight: "6px" }}>
            {entry.payload.emoji ? decodeEmoji(entry.payload.emoji) : null}
          </span>
          <span style={{ flex: 1 }}>{entry.name}</span>
          <span style={{ fontWeight: "500" }}>₹{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomTooltip;
