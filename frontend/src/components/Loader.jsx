import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import "../styles/Loader.css";

const Loader = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`loader-overlay ${theme}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
