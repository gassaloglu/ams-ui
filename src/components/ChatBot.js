import { useState, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  SmartToy as SmartToyIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  AccessTime as AccessTimeIcon,
  Flight as FlightIcon,
} from "@mui/icons-material";

// FlightCard component for displaying single flight with navigation
const FlightCard = ({ flights }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flights.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < flights.length - 1 ? prev + 1 : 0));
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (flights.length === 0) return null;

  const flight = flights[currentIndex];

  return (
    <Box sx={{ position: "relative", width: "100%", my: 2 }}>
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: -20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          backgroundColor: "white",
          boxShadow: 1,
          "&:hover": { backgroundColor: "grey.100" },
        }}
      >
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>

      <Card
        sx={{
          width: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {flight.flight_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {flight.departure_airport} → {flight.destination_airport}
            </Typography>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {formatDateTime(flight.departure_datetime)}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ ml: 3 }}
            >
              <FlightIcon
                fontSize="small"
                color="action"
                sx={{ transform: "rotate(90deg)" }}
              />
              <Typography variant="body2">
                {calculateDuration(
                  flight.departure_datetime,
                  flight.arrival_datetime,
                )}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {formatDateTime(flight.arrival_datetime)}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              {flight.departure_gate_number
                ? `Gate ${flight.departure_gate_number}`
                : "Gate not assigned"}
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              ${flight.price || "N/A"}
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            sx={{ mt: 1 }}
          >
            Flight {currentIndex + 1} of {flights.length}
          </Typography>
        </CardContent>
      </Card>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: -20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          backgroundColor: "white",
          boxShadow: 1,
          "&:hover": { backgroundColor: "grey.100" },
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

// Helper function to extract flights from text
const extractFlights = (text) => {
  const jsonMatches = text.match(/\[.*?\]/gs) || [];
  const flights = [];
  let remainingText = text;

  jsonMatches.forEach((match) => {
    try {
      const parsed = JSON.parse(match);
      if (Array.isArray(parsed)) {
        flights.push(...parsed);
        remainingText = remainingText.replace(match, "");
      }
    } catch (e) {
      console.error("Error parsing flight data:", e);
    }
  });

  return { flights, remainingText };
};

// Format bot message function
const formatBotMessage = (text) => {
  const { flights, remainingText } = extractFlights(text);

  return (
    <>
      {remainingText.trim() && (
        <Typography sx={{ mb: 2, lineHeight: 1.6 }}>{remainingText}</Typography>
      )}
      {flights.length > 0 && <FlightCard flights={flights} />}
    </>
  );
};

// Main Chatbot component
export default function Chatbot() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "model", text: "Hi there!👋 How can I assist you?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const readyPrompts = [
    "Give me Izmir - Istanbul flights in this month",
    "Plan me a summer vacation",
    "Plan me a winter vacation",
    "What is the biggest plane you have?",
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (prompt = input) => {
    if (prompt.trim()) {
      const newMessages = [...messages, { sender: "user", text: prompt }];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      // Add temporary loading message
      setMessages((prev) => [
        ...prev,
        { sender: "model", text: "...", isLoading: true },
      ]);

      try {
        const response = await fetch(
          "http://127.0.0.1:8081/api/v1/query_model",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt, history: messages }),
          },
        );
        const data = await response.json();

        // Remove loading message and add actual response
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isLoading),
          { sender: "model", text: data.output },
        ]);
      } catch (error) {
        console.error("Error connecting to chatbot API:", error);
        // Replace loading message with error message
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isLoading),
          {
            sender: "model",
            text: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <IconButton
        onClick={toggleChatbot}
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#1565c0",
          color: "white",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1100,
          "&:hover": {
            backgroundColor: "#0d47a1",
          },
        }}
      >
        <SmartToyIcon sx={{ fontSize: "30px" }} />
      </IconButton>

      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "600px",
            maxWidth: "100%",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            p: 2,
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <Stack direction="column" spacing={2}>
            <Box
              sx={{
                height: "300px",
                overflowY: "auto",
                mb: 2,
                p: 1,
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: message.sender === "user" ? "right" : "left",
                    alignSelf:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    backgroundColor:
                      message.sender === "user" ? "#1E3A8A" : "#E2E8F0",
                    color: message.sender === "user" ? "#ffffff" : "#1E293B",
                    mb: 0,
                    p: 1.5,
                    borderRadius: "8px",
                    display: "inline-flex",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                    minWidth: "40px",
                  }}
                >
                  {message.isLoading ? (
                    <CircularProgress size={20} />
                  ) : message.sender === "model" ? (
                    <Box sx={{ lineHeight: 1.3 }}>
                      {formatBotMessage(message.text)}
                    </Box>
                  ) : (
                    <Typography sx={{ lineHeight: 1.3 }}>
                      {message.text}
                    </Typography>
                  )}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                mb: 2,
                p: 1,
              }}
            >
              {readyPrompts.map((prompt, index) => (
                <Chip
                  key={index}
                  label={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: "#e3f2fd",
                    color: "#1565c0",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSend();
                  }
                }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "4px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#888",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1565c0",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={() => handleSend(input)}
                disabled={isLoading || !input.trim()}
                sx={{
                  backgroundColor: "#1565c0",
                  minWidth: "80px",
                  "&:hover": {
                    backgroundColor: "#0d47a1",
                  },
                  "&:disabled": {
                    backgroundColor: "#e0e0e0",
                    color: "#a0a0a0",
                  },
                }}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
}
