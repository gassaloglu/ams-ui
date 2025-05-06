import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "How can I assist you?" },
    { sender: "user", text: "Plan a vacation for me" },
    {
      sender: "bot",
      text: "Here are vacation plans:\nAntalya - Izmir\nIstanbul - Izmir",
    },
  ]);

  const readyPrompts = [
    "Give me Izmir - Istanbul flights in this month",
    "Can you help me with my account?",
    "Tell me about your services.",
  ];
  /*
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");
    }
  };
*/

  const handleSend = async (prompt = input) => {
    if (prompt.trim()) {
      setMessages([...messages, { sender: "user", text: prompt }]);
      setInput("");

      // Send user input to the backend
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

        // Add the bot's response to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.output },
        ]);
      } catch (error) {
        console.error("Error connecting to chatbot API:", error);
      }
    }
  };

  // const handlePromptClick = (prompt) => {
  //   setMessages([...messages, { sender: "user", text: prompt }]);
  //   handleSend();
  // };

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
              }}
            >
              {messages.map((message, index) => (
                <Typography
                  key={index}
                  sx={{
                    textAlign: message.sender === "user" ? "right" : "left",
                    alignSelf:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    backgroundColor:
                      message.sender === "user" ? "#1E3A8A" : "#E2E8F0",
                    color: message.sender === "user" ? "#ffffff" : "#1E293B",

                    mb: 1,
                    p: 1,
                    borderRadius: "8px",
                    display: "inline-block",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                  }}
                >
                  {message.text}
                </Typography>
              ))}
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
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
              onClick={handleSend}
              sx={{
                backgroundColor: "#1565c0",
                "&:hover": {
                  backgroundColor: "#0d47a1",
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </Box>
      )}
    </>
  );
}
