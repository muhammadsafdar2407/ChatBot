import React from "react";
import { Conversation, Avatar } from "@chatscope/chat-ui-kit-react";

const ContactItem = ({ contact, isActive, onClick, lastMessage }) => (
  <Conversation
    name={contact.name}
    info={lastMessage.text}
    lastActivityTime={lastMessage.timestamp}
    active={isActive}
    onClick={onClick}
    style={{
      backgroundColor: isActive ? "#e6f2ff" : "transparent",
      color: "#333",
      cursor: "pointer",
      padding: "12px 15px",
      borderBottom: "1px solid #eee",
    }}
  >
    <Avatar src={contact.avatar} name={contact.name} />
  </Conversation>
);

export default ContactItem;
