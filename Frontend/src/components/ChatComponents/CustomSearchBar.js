import React from "react";

const CustomSearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search contacts..."
      style={{
        width: "100%",
        padding: "10px 15px",
        borderRadius: "20px",
        border: "1px solid #d0d0d0",
        backgroundColor: "#ffffff",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
};

export default CustomSearchBar;
