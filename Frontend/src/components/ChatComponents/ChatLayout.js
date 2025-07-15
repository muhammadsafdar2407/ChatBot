import React from "react";
import { MainContainer } from "@chatscope/chat-ui-kit-react";
import ChatSidebar from "./ChatSidebar";
import MessagePanel from "./MessagePanel";

const ChatLayout = ({
  contacts,
  services,
  selectedContactId,
  setSelectedContactId,
  searchTerm,
  setSearchTerm,
  messages,
  handleSend,
  handleServiceClick,
}) => {
  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden", // prevent scroll on full body
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e0e5ec",
      }}
    >
      <div
        style={{
          height: "90%",
          width: "90%",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
          display: "flex",
          backgroundColor: "#ffffff",
        }}
      >
        <MainContainer responsive style={{ display: "flex", flexGrow: 1 }}>
          <ChatSidebar
            contacts={contacts}
            selectedContactId={selectedContactId}
            setSelectedContactId={setSelectedContactId}
            messages={messages}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <MessagePanel
            contact={selectedContact}
            messages={messages[selectedContactId] || []}
            onSend={handleSend}
            services={services}
            onServiceSelect={handleServiceClick}
          />
        </MainContainer>
      </div>
    </div>
  );
};

export default ChatLayout;
