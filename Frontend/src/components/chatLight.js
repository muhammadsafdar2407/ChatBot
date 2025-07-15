import React, { useEffect, useState } from "react";
import ChatLayout from "./ChatComponents/ChatLayout";
import axios from "axios";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const ChatLight = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState({});
  const [services, setServices] = useState([]);
  const [pinVerified, setPinVerified] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
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
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

  useEffect(() => {
  if (selectedContactId && pinVerified) {
    fetchServices(selectedContactId, null); // load fresh services
  }
}, [selectedContactId, pinVerified]);

  // Fetch services
  const fetchServices = async (businessId, parentServiceId = null) => {
  try {
    setServices([]); // Clear before fetch
    const response = await axios.get("http://localhost:5000/service/get_all_services", {
      params: {
        buisness_id: businessId,
        parent_service_id: parentServiceId ?? null,
      },
    });

    const data = response.data;
    if (Array.isArray(data.services)) {
      const serviceObjects = data.services.map((s) => ({
        name: s.name,
        id: s.id, // Assuming backend returns id too
      }));
      setServices(serviceObjects);
    } else if (data.message) {
      setServices([]);
      setMessages((prev) => ({
        ...prev,
        [businessId]: [
          ...(prev[businessId] || []),
          {
            direction: "incoming",
            message: data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      }));
    }
  } catch (err) {
    console.error("Failed to fetch services:", err);
  }
};

  // Handle user input (PIN or message)
  const handleSend = async (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [
        ...(prev[selectedContactId] || []),
        { direction: "outgoing", message: text, timestamp },
      ],
    }));

    if (!pinVerified) {
      try {
        const res = await axios.post("http://localhost:5000/user/verifypin", { pin: text }, getAuthHeader());
        if (res.data.message === "pin verified") {
          setPinVerified(true);
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
          await fetchServices(selectedContactId);
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
  // Step 1: Add user-selected service as a message
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  setMessages((prev) => ({
    ...prev,
    [selectedContactId]: [
      ...(prev[selectedContactId] || []),
      { direction: "outgoing", message: service.name, timestamp },
    ],
  }));

  // Step 2: Fetch sub-services based on this service ID
  try {
    const response = await axios.get("http://localhost:5000/service/get_all_services", {
      params: {
        buisness_id: selectedContactId,
        parent_service_id: service.id,
      },
    });

    const data = response.data;

    if (Array.isArray(data.services)) {
      const newServices = data.services.map((s) => ({
        name: s.name,
        id: s.id,
      }));
      setServices(newServices);
      console.log(services);
    } else if (data.message) {
      // If no services found, show fallback message
      setServices([]); // Clear old buttons
      setMessages((prev) => ({
        ...prev,
        [selectedContactId]: [
          ...(prev[selectedContactId] || []),
          {
            direction: "incoming",
            message: data.message,
            timestamp,
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
      services={pinVerified ? services : []}
      selectedContactId={selectedContactId}
      setSelectedContactId={setSelectedContactId}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      messages={messages}
      handleSend={handleSend}
      handleServiceClick={handleServiceClick}
    />
  );
};

export default ChatLight;
