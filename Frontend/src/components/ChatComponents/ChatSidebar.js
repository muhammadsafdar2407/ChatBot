import React from "react";
import { Sidebar, ConversationList } from "@chatscope/chat-ui-kit-react";
import CustomSearchBar from "./CustomSearchBar";
import ContactItem from "./ContactItem";

const ChatSidebar = ({
  contacts,
  selectedContactId,
  setSelectedContactId,
  messages,
  searchTerm,
  setSearchTerm,
}) => {
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLastMessage = (contactId) => {
    const msgs = messages[contactId];
    if (!msgs?.length) return { text: "No messages yet.", timestamp: "" };
    const last = msgs[msgs.length - 1];
    return { text: last.message, timestamp: last.timestamp || "" };
  };

  return (
    <Sidebar
      position="left"
      scrollable
      style={{
        backgroundColor: "#f0f2f5",
        minWidth: "280px",
        maxWidth: "350px",
        borderRight: "1px solid #e0e0e0",
      }}
    >
      <div
        style={{
          height: "70.5px",
          padding: "20px 25px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1e3a8a",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        💬 Support Assistant
      </div>

      <div style={{ padding: "15px" }}>
        <CustomSearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <ConversationList>
        {filteredContacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isActive={selectedContactId === contact.id}
            onClick={() => setSelectedContactId(contact.id)}
            lastMessage={getLastMessage(contact.id)}
          />
        ))}
      </ConversationList>
    </Sidebar>
  );
};

export default ChatSidebar;
