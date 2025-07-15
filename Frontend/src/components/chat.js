import React, { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationList,
  Conversation,
  Sidebar,
  ConversationHeader,
  Avatar,
} from "@chatscope/chat-ui-kit-react";

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const contacts = [
  { id: "1", name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
];

const initialMessages = {
  "1": [
    { direction: "incoming", message: "Hi from Alice!", timestamp: "10:00 AM" },
  ],
  "2": [
    { direction: "incoming", message: "Hey there, I'm Bob.", timestamp: "10:30 AM" },
  ],
  "3": [
    { direction: "incoming", message: "Charlie here!", timestamp: "9:45 AM" },
  ],
};

const ChatComponent = () => {
  const [selectedContactId, setSelectedContactId] = useState("1");
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId);

  const handleSend = (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [
        ...prev[selectedContactId],
        { direction: "outgoing", message: text, timestamp },
      ],
    }));
  };

  const getLastMessage = (contactId) => {
    const msgs = messages[contactId];
    if (!msgs || msgs.length === 0) return { text: "", timestamp: "" };

    const last = msgs[msgs.length - 1];
    return { text: last.message, timestamp: last.timestamp || "" };
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      backgroundColor: "#0f0f0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        height: "95%",
        width: "95%",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
      }}>
        <MainContainer responsive>

          {/* Sidebar */}
          <Sidebar position="left" scrollable style={{ backgroundColor: "#1a1a1a", color: "#e0e0e0", borderRight: "1px solid #333" }}>

            {/* Company Name */}
            <div style={{ 
              padding: "20px", 
              fontSize: "20px", 
              fontWeight: "bold", 
              borderBottom: "1px solid #333",
              backgroundColor: "#1a1a1a",
              color: "#ffffff"
            }}>
              Support Assistant
            </div>

            {/* Search */}
            <div style={{ padding: "10px" }}>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #444",
                  fontSize: "14px",
                  backgroundColor: "#2a2a2a",
                  color: "#e0e0e0",
                }}
              />
            </div>

            {/* Contact List */}
            <ConversationList>
              {filteredContacts.map((contact) => {
                const last = getLastMessage(contact.id);
                return (
                  <div key={contact.id} style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: selectedContactId === contact.id ? "#2a2a2a" : "transparent",
                    borderBottom: "1px solid #333",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => setSelectedContactId(contact.id)}
                  onMouseEnter={(e) => {
                    if (selectedContactId !== contact.id) {
                      e.currentTarget.style.backgroundColor = "#222";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedContactId !== contact.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}>
                    <Avatar 
                      src={contact.avatar} 
                      name={contact.name} 
                      size="sm"
                      style={{ marginRight: "12px" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: "600", 
                        fontSize: "14px", 
                        color: "#ffffff",
                        marginBottom: "2px"
                      }}>
                        {contact.name}
                      </div>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#888",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {last.text || "No messages"}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: "11px", 
                      color: "#666",
                      marginLeft: "8px"
                    }}>
                      {last.timestamp}
                    </div>
                  </div>
                );
              })}
            </ConversationList>
          </Sidebar>

          {/* Chat Area */}
          <ChatContainer style={{ backgroundColor: "#1e1e1e" }}>
            <ConversationHeader 
              style={{ 
                backgroundColor: "#1a1a1a", 
                borderBottom: "1px solid #333", 
                padding: "12px 16px",
                color: "#ffffff"
              }}
            >
              <Avatar src={selectedContact.avatar} name={selectedContact.name} />
              <ConversationHeader.Content
                userName={selectedContact.name}
                info="Online"
                style={{ color: "#ffffff" }}
              />
            </ConversationHeader>

            <MessageList scrollBehavior="smooth" style={{ 
              padding: "10px 20px",
              backgroundColor: "#1e1e1e"
            }}>
              {(messages[selectedContactId] || []).map((msg, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: msg.direction === "outgoing" ? "flex-end" : "flex-start",
                  marginBottom: "12px"
                }}>
                  <div style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "18px",
                    backgroundColor: msg.direction === "outgoing" ? "#0084ff" : "#2a2a2a",
                    color: "#ffffff",
                    fontSize: "14px",
                    lineHeight: "1.4"
                  }}>
                    {msg.message}
                    <div style={{
                      fontSize: "11px",
                      color: msg.direction === "outgoing" ? "#cccccc" : "#888",
                      marginTop: "4px",
                      textAlign: "right"
                    }}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </MessageList>

            <div style={{ 
              backgroundColor: "#1a1a1a", 
              padding: "12px", 
              borderTop: "1px solid #333",
            }}>
              <MessageInput
                placeholder="Type your message..."
                onSend={handleSend}
                attachButton={false}
                style={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444",
                  borderRadius: "20px",
                  color: "#e0e0e0",
                  padding: "8px 12px",
                }}
              />
            </div>
          </ChatContainer>

        </MainContainer>
      </div>
    </div>
  );
};

export default ChatComponent;