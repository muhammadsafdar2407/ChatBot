import React, { useEffect, useState } from "react";
import ChatLayout from "./ChatComponents/ChatLayout";
import axios from "axios";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const ChatLight = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState({});
  const [pinVerified, setPinVerified] = useState({});
  const [awaitingServiceSelection, setAwaitingServiceSelection] = useState({});

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Reset conversation state when switching contacts
  const handleContactSwitch = (contactId) => {
    setSelectedContactId(contactId);
    // Optional: Reset awaiting service selection when switching contacts
    // This prevents confusion if user was mid-selection in another chat
    if (awaitingServiceSelection[contactId]) {
      setAwaitingServiceSelection(prev => ({
        ...prev,
        [contactId]: false
      }));
    }
  };

  // Fetch businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/buisness/get_all_buisness");
        const data = res.data.buisness.map((b, idx) => ({
          id: String(b.id),
          name: b.name,
          avatar: `https://i.pravatar.cc/150?img=${idx + 1}`,
        }));

        setContacts(data);

        // Initialize messages with a PIN request
        const initialMsgs = {};
        data.forEach((c) => {
          initialMsgs[c.id] = [
            {
              direction: "incoming",
              message: "Welcome! Please enter your PIN to proceed.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
            },
          ];
        });

        setMessages(initialMsgs);
        if (data.length) setSelectedContactId(data[0].id);
      } catch (err) {
        console.error("Error fetching businesses", err);
      }
    };

    fetchBusinesses();
  }, []);

  // useEffect(() => {
  //   if (selectedContactId && pinVerified[selectedContactId]) {
  //     fetchInitialServices(selectedContactId);
  //   }
  // }, [selectedContactId, pinVerified]);

  // Fetch initial services and add them to messages
  const fetchInitialServices = async (businessId) => {
    try {
      const response = await axios.get("http://localhost:5000/service/get_all_services", {
        params: {
          buisness_id: businessId,
          parent_service_id: null,
        },
      });

      const data = response.data;
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (Array.isArray(data.services)) {
        const serviceObjects = data.services.map((s) => ({
          name: s.name,
          id: s.id,
        }));

        // Add services as a message in the chat
        setMessages((prev) => ({
          ...prev,
          [businessId]: [
            ...(prev[businessId] || []),
            {
              direction: "incoming",
              message: "",
              timestamp,
              services: serviceObjects,
              messageType: "services"
            },
          ],
        }));
        setAwaitingServiceSelection(prev => ({
          ...prev,
          [businessId]: true
        }));
      } else if (data.message) {
        setMessages((prev) => ({
          ...prev,
          [businessId]: [
            ...(prev[businessId] || []),
            {
              direction: "incoming",
              message: data.message,
              timestamp,
            },
          ],
        }));
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  // Handle user input (PIN or text message)
  const handleSend = async (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // If awaiting service selection and user types something other than selecting a service
    if (awaitingServiceSelection[selectedContactId] && pinVerified[selectedContactId]) {
      setMessages((prev) => ({
        ...prev,
        [selectedContactId]: [
          ...(prev[selectedContactId] || []),
          { direction: "outgoing", message: text, timestamp },
          {
            direction: "incoming",
            message: "Please select a service from above.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      }));
      return;
    }

    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [
        ...(prev[selectedContactId] || []),
        { direction: "outgoing", message: text, timestamp },
      ],
    }));

    if (!pinVerified[selectedContactId]) {
      try {
        const res = await axios.post("http://localhost:5000/user/verifypin", { pin: text }, getAuthHeader());
        if (res.data.message === "pin verified") {
          setPinVerified(prev => ({
            ...prev,
            [selectedContactId]: true
          }));
          setMessages((prev) => ({
            ...prev,
            [selectedContactId]: [
              ...prev[selectedContactId],
              {
                direction: "incoming",
                message: "PIN verified! You can now use the available services.",
                timestamp,
              },
            ],
          }));
          await fetchInitialServices(selectedContactId);
        } else {
          setMessages((prev) => ({
            ...prev,
            [selectedContactId]: [
              ...prev[selectedContactId],
              {
                direction: "incoming",
                message: "Invalid PIN. Please try again.",
                timestamp,
              },
            ],
          }));
        }
      } catch (error) {
        console.error("PIN verification error", error);
      }
    }
  };

  // Handle service click
  const handleServiceClick = async (service) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user-selected service as a message
    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [
        ...(prev[selectedContactId] || []),
        { direction: "outgoing", message: service.name, timestamp },
      ],
    }));

    setAwaitingServiceSelection(prev => ({
      ...prev,
      [selectedContactId]: false
    }));

    // Fetch sub-services based on this service ID
    try {
      const response = await axios.get("http://localhost:5000/service/get_all_services", {
        params: {
          buisness_id: selectedContactId,
          parent_service_id: service.id,
        },
      });

      const data = response.data;
      const newTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (Array.isArray(data.services)) {
        const newServices = data.services.map((s) => ({
          name: s.name,
          id: s.id,
        }));

        // Add new services as another message in the chat
        setMessages((prev) => ({
          ...prev,
          [selectedContactId]: [
            ...(prev[selectedContactId] || []),
            {
              direction: "incoming",
              message: "",
              timestamp: newTimestamp,
              services: newServices,
              messageType: "services"
            },
          ],
        }));
        setAwaitingServiceSelection(prev => ({
          ...prev,
          [selectedContactId]: true
        }));
      } else if (data.message) {
        // If no services found, show fallback message
        setMessages((prev) => ({
          ...prev,
          [selectedContactId]: [
            ...(prev[selectedContactId] || []),
            {
              direction: "incoming",
              message: data.message,
              timestamp: newTimestamp,
            },
          ],
        }));
      }
    } catch (err) {
      console.error("Failed to fetch sub-services", err);
    }
  };

  return (
    <ChatLayout
      contacts={contacts}
      selectedContactId={selectedContactId}
      setSelectedContactId={handleContactSwitch}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      messages={messages}
      handleSend={handleSend}
      handleServiceClick={handleServiceClick}
    />
  );
};

export default ChatLight;