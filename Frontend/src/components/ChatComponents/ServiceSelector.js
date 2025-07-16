import React from "react";

const ServiceSelector = ({ services, onSelect, avatar, contactName, timestamp }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        marginBottom: "10px",
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
          marginTop: "0px",
        }}
      />

      {/* Service Buttons */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: "600",
            fontSize: "16px",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          Select a Service
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => onSelect(service)}
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
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#1e40af";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#1e3a8a";
              }}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: "0.75em",
            opacity: 0.7,
            marginTop: "10px",
            color: "#666",
          }}
        >
          {contactName} • {timestamp}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;