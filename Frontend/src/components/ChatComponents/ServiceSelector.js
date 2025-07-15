// === components/ServiceSelector.js ===
import React from "react";

const ServiceSelector = ({ services, onSelect, avatar, contactName }) => {
  return (
    <div
      style={{
        
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}
    >
      {/* Avatar */}
      <img
        src={avatar}
        alt={contactName}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover",
          // Adjust this margin-top to align the avatar with the "Select a Service" text
          // This value might need slight tweaking based on font sizes and line heights
          marginTop: "0px", // Changed from 5px to 0px for better alignment
        }}
      />

      {/* Service Buttons */}
      <div>
        <div
          style={{
            fontWeight: "600",
            fontSize: "16px",
            marginBottom: "10px",
            color: "#333",
            // You might need to add a line-height here if the text still looks off-center
            // For example: lineHeight: "40px" (if the avatar height is 40px)
          }}
        >
          Select a Service
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {services.map((service, index) => (
  <button
    key={index}
    onClick={() => onSelect(service)} // Pass full service object
    style={{
      backgroundColor: "#1e3a8a",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "10px 15px",
      cursor: "pointer",
      fontSize: "14px",
      textAlign: "left",
      width: "200px",
    }}
  >
    {service.name}
  </button>
))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;