import React, { useEffect, useRef } from "react";
import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import CustomChatHeader from "./CustomChatHeader";
import ServiceSelector from "./ServiceSelector";

const MessagePanel = ({
  contact,
  messages,
  onSend,
  services,
  onServiceSelect,
}) => {
  const messageListRef = useRef(null);

  // Scroll to bottom when messages or services change
  useEffect(() => {
    if (messageListRef.current) {
      const node = messageListRef.current;
      node.scrollTop = node.scrollHeight;
    }
  }, [messages, services]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
      }}
    >
      {/* Header */}
      {contact && (
        <CustomChatHeader
          avatar={contact.avatar}
          name={contact.name}
          status="Online"
        />
      )}

      <ChatContainer
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Scrollable area with messages and services */}
        <MessageList
          ref={messageListRef}
          scrollBehavior="smooth"
          style={{
            flexGrow: 1,
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#f9fbfd",
            backgroundImage: `url('https://www.transparenttextures.com/patterns/clean-textile.png')`,
            backgroundRepeat: "repeat",
          }}
        >
          {/* Render all messages */}
          {messages?.length === 0 ? (
            <Message
              model={{
                direction: "incoming",
                message: "Hi, how can I help you today?",
                position: "normal",
              }}
            />
          ) : (
            messages.map((msg, idx) => (
              <Message
                key={idx}
                model={{
                  direction: msg.direction,
                  message: msg.message,
                  position: "normal",
                }}
                style={{
                  marginBottom: "10px",
                  maxWidth: "75%",
                  paddingLeft: "0px",
                  alignSelf:
                    msg.direction === "outgoing" ? "flex-end" : "flex-start",
                }}
              >
                <Message.Footer
                  sender={msg.direction === "incoming" ? contact.name : "You"}
                  timestamp={msg.timestamp}
                  style={{
                    fontSize: "0.75em",
                    opacity: 0.7,
                    marginTop: "5px",
                    textAlign:
                      msg.direction === "outgoing" ? "right" : "left",
                  }}
                />
                <Avatar
                  src={
                    msg.direction === "incoming"
                      ? contact.avatar
                      : "https://i.pravatar.cc/150?img=6"
                  }
                  name={
                    msg.direction === "incoming" ? contact.name : "You"
                  }
                />
              </Message>
            ))
          )}

          {/* Render services below messages if verified */}
          {services?.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <ServiceSelector
                services={services}
                onSelect={onServiceSelect}
                avatar={contact?.avatar}
                contactName={contact?.name}
              />
            </div>
          )}
        </MessageList>

        {/* Input bar */}
        <MessageInput
          placeholder="Type your message..."
          onSend={onSend}
          attachButton={false}
          style={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e0e0e0",
            padding: "15px 20px",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
          }}
        />
      </ChatContainer>
    </div>
  );
};

export default MessagePanel;
