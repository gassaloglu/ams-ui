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
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

// Helper function to format the bot's message
const formatBotMessage = (text) => {
  // Split the text into lines
  const lines = text.split("\n");

  return lines.map((line, index) => {
    // Check if this is a flight item line
    if (line.trim().startsWith("*")) {
      // Process bold text between ** and add line breaks between flight details
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text between **
        .replace(/, \*\*/g, "<br/><strong>") // Add line breaks before bold sections
        .replace(/\*\*, /g, "</strong><br/>") // Add line breaks after bold sections
        .replace(/, /g, "<br/>"); // Add line breaks for other commas

      return (
        <Typography
          key={index}
          component="div"
          sx={{
            mb: 1,
            lineHeight: 1.6,
            "& strong": {
              fontWeight: "bold",
              color: "#1565c0",
            },
          }}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    }

    // Regular line (not a flight item)
    return (
      <Typography key={index} sx={{ mb: 1, lineHeight: 1.6 }}>
        {line}
      </Typography>
    );
  });
};

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there!👋 How can I assist you?" },
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
        { sender: "bot", text: "...", isLoading: true },
      ]);

      try {
        const response = await fetch(
          "http://127.0.0.1:8081/api/v1/query_model",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt }),
          },
        );
        const data = await response.json();

        // Remove loading message and add actual response
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isLoading),
          { sender: "bot", text: data.output },
        ]);
      } catch (error) {
        console.error("Error connecting to chatbot API:", error);
        // Replace loading message with error message
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isLoading),
          {
            sender: "bot",
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
                  ) : message.sender === "bot" ? (
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
