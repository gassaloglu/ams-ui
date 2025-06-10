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
  Tooltip,
} from "@mui/material";

import {
  SmartToy as SmartToyIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  AccessTime as AccessTimeIcon,
  Flight as FlightIcon,
  ConfirmationNumber as ConfirmationNumberIcon, // For booking button
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// Main Chatbot component
export default function Chatbot() {
  // LocalStorage keys
  const LS_MESSAGES_KEY = "chatbot_messages";
  const LS_ISOPEN_KEY = "chatbot_isOpen";
  const LS_INPUT_KEY = "chatbot_input";

  // Load initial state from localStorage
  const getInitialMessages = () => {
    try {
      const stored = localStorage.getItem(LS_MESSAGES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        sender: "model",
        text: "Hi there!👋 How can I assist you today?",
        key: `model-initial-${Date.now()}`,
      },
    ];
  };
  const getInitialIsOpen = () => {
    try {
      const stored = localStorage.getItem(LS_ISOPEN_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return false;
  };
  const getInitialInput = () => {
    try {
      const stored = localStorage.getItem(LS_INPUT_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return "";
  };

  const [input, setInput] = useState(getInitialInput);
  const [isOpen, setIsOpen] = useState(getInitialIsOpen);
  const [messages, setMessages] = useState(getInitialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const readyPrompts = [
    "Give me Izmir - Istanbul flights in this month",
    "Plan me a summer vacation",
    "Plan me a winter vacation",
  ];

  const navigate = useNavigate();

  // Helper function to apply basic Markdown to text
  const applyMarkdown = (markdownText) => {
    if (!markdownText) return "";
    let html = markdownText;

    // Bold: **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

    // Italics: *text* or _text_ (ensure not part of bold)
    html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
    html = html.replace(/(?<!_)_(?!_)(.*?)(?<!_)_(?!_)/g, "<em>$1</em>");

    // Strikethrough: ~~text~~
    html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");
    // Inline code: `text`
    html = html.replace(/`(.*?)`/g, "<code>$1</code>");

    return html;
  };

  // FlightCards component
  const FlightCards = ({ flights }) => {
    const LS_CURRENT_INDEX_KEY = "flightcards_currentIndex";
    const getInitialCurrentIndex = () => {
      try {
        const stored = localStorage.getItem(LS_CURRENT_INDEX_KEY);
        if (stored) return JSON.parse(stored);
      } catch {}
      return 0;
    };
    const [currentIndex, setCurrentIndex] = useState(getInitialCurrentIndex);

    useEffect(() => {
      localStorage.setItem(LS_CURRENT_INDEX_KEY, JSON.stringify(currentIndex));
    }, [currentIndex]);

    if (!Array.isArray(flights) || flights.length === 0) {
      return (
        <Typography
          sx={{ my: 2, textAlign: "center", color: "text.secondary" }}
        >
          No flight information to display.
        </Typography>
      );
    }
    const flight = flights[currentIndex];

    if (!flight || typeof flight !== "object" || !flight.flight_number) {
      return (
        <Typography
          sx={{ my: 2, textAlign: "center", color: "text.secondary" }}
        >
          Invalid flight data encountered.
        </Typography>
      );
    }

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

    const handleBookNow = () => {
      navigate(`/booking/${flight.id}/essentials`);
    };

    return (
      <Box sx={{ position: "relative", width: "100%", my: 2 }}>
        {flights.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": { backgroundColor: "grey.100" },
                width: 36,
                height: 36,
              }}
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": { backgroundColor: "grey.100" },
                width: 36,
                height: 36,
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}

        <Card
          sx={{
            width: "100%",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            },
          }}
        >
          <CardContent sx={{ padding: "20px !important", flexGrow: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  {flight.flight_number}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {flight.departure_airport} → {flight.destination_airport}
                </Typography>
              </Stack>
              <Chip
                label={flight.flight_type}
                size="small"
                sx={{
                  backgroundColor: "primary.light",
                  color: "white",
                  fontWeight: 500,
                }}
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Departure: {formatDateTime(flight.departure_datetime)}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ pl: 0 }}
              >
                <FlightIcon
                  fontSize="small"
                  color="primary"
                  sx={{ transform: "rotate(90deg)", ml: 0.2, mr: 0.8 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Duration:{" "}
                  {calculateDuration(
                    flight.departure_datetime,
                    flight.arrival_datetime,
                  )}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Arrival: {formatDateTime(flight.arrival_datetime)}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h6"
                color="primary.main"
                sx={{ fontWeight: "bold" }}
              >
                {flight.price || "N/A"} TRY
              </Typography>
            </Stack>

            {flights.length > 1 && (
              <Typography
                variant="caption"
                display="block"
                textAlign="center"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                Flight {currentIndex + 1} of {flights.length}
              </Typography>
            )}
          </CardContent>
          <Divider />
          <Box sx={{ p: 2, pt: 1.5 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<ConfirmationNumberIcon />}
              onClick={handleBookNow}
              sx={{
                fontWeight: "bold",
                borderRadius: "8px",
                py: 1,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              Book Now
            </Button>
          </Box>
        </Card>
      </Box>
    );
  };

  const formatBotMessage = (text) => {
    const parts = [];
    let lastIndex = 0;

    const combinedRegex = /```json\s*?\n([\s\S]*?)\n```|(\[[\s\S]*?\])/gs;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        });
      }

      const jsonStringContent = match[1] || match[2];

      if (jsonStringContent) {
        try {
          const potentialData = JSON.parse(jsonStringContent.trim());
          if (
            Array.isArray(potentialData) &&
            potentialData.length > 0 &&
            potentialData.every(
              (f) =>
                typeof f === "object" &&
                f !== null &&
                "id" in f &&
                "flight_number" in f &&
                "departure_airport" in f &&
                "destination_airport" in f &&
                "departure_datetime" in f &&
                "arrival_datetime" in f,
            )
          ) {
            parts.push({
              type: "flights",
              content: potentialData,
            });
          }
        } catch (e) {
          // console.warn("JSON parsing failed or not flight data:", jsonStringContent, e);
        }
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex),
      });
    }

    return (
      <>
        {parts.map((part, index) => {
          if (part.type === "text" && part.content.trim()) {
            const htmlContent = applyMarkdown(part.content.trim());
            return (
              <Typography
                key={`text-${index}`}
                component="div"
                sx={{
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );
          } else if (part.type === "flights") {
            return (
              <FlightCards key={`flights-${index}`} flights={part.content} />
            );
          }
          return null;
        })}
      </>
    );
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (promptArg) => {
    const promptToSend =
      typeof promptArg === "string" && promptArg.trim() !== ""
        ? promptArg.trim()
        : input.trim();

    if (promptToSend) {
      const userMessage = {
        sender: "user",
        text: promptToSend,
        key: `user-${Date.now()}`,
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setIsLoading(true);

      const loadingMessageKey = `model-loading-${Date.now()}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "model",
          text: "...",
          isLoading: true,
          key: loadingMessageKey,
        },
      ]);

      try {
        const historyForAPI = messages
          .filter((msg) => !msg.isLoading)
          .slice(-10)
          .map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            content: msg.text,
          }));

        const response = await fetch(
          "http://127.0.0.1:8081/api/v1/query_model",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: promptToSend,
              history: historyForAPI,
            }),
          },
        );
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API error: ${response.status} - ${errorData}`);
        }
        const data = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.key !== loadingMessageKey),
          {
            sender: "model",
            text: data.output || "Sorry, I didn't get a valid response.",
            key: `model-${Date.now()}`,
          },
        ]);
      } catch (error) {
        console.error("Error connecting to chatbot API:", error);
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.key !== loadingMessageKey),
          {
            sender: "model",
            text: "Sorry, I encountered an error. Please try again.",
            key: `model-error-${Date.now()}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setInput("");
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleRefresh = () => {
    // Clear localStorage
    localStorage.removeItem(LS_MESSAGES_KEY);
    localStorage.removeItem(LS_ISOPEN_KEY);
    localStorage.removeItem(LS_INPUT_KEY);
    
    // Reset state
    setMessages([
      {
        sender: "model",
        text: "Hi there!👋 How can I assist you today?",
        key: `model-initial-${Date.now()}`,
      },
    ]);
    setInput("");
  };

  // Persist state to localStorage on change
  useEffect(() => {
    localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem(LS_ISOPEN_KEY, JSON.stringify(isOpen));
  }, [isOpen]);
  useEffect(() => {
    localStorage.setItem(LS_INPUT_KEY, JSON.stringify(input));
  }, [input]);

  return (
    <>
      <IconButton
        onClick={toggleChatbot}
        sx={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#007AFF",
          color: "white",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
          boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
          transition:
            "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#005ecb",
            transform: "scale(1.05)",
          },
        }}
      >
        <SmartToyIcon sx={{ fontSize: "32px" }} />
      </IconButton>

      {/* If you want the Slide transition for the chat window, you'd wrap this Box:
          <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit timeout={300}>
            <Box sx={{...}}> ... </Box>
          </Slide>
      */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: "110px",
            right: "30px",
            width: { xs: "calc(100vw - 30px)", sm: "580px" }, // Made popup wider
            height: "75vh", // Made popup taller
            maxHeight: "700px", // Adjusted maxHeight
            backgroundColor: "#ffffff",
            boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
            p: 0,
            borderRadius: "16px",
            zIndex: 1200,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              py: 1,
              px: 2,
              borderBottom: "1px solid #E5E7EB",
              backgroundColor: "#F9FAFB",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "48px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1F2937",
                fontWeight: 600,
                fontSize: "1rem",
                lineHeight: 1.2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span role="img" aria-label="plane">✈️</span>
              Flight Assistant
            </Typography>
            <Tooltip 
              title="Start a new conversation" 
              placement="bottom"
              arrow
              sx={{
                '& .MuiTooltip-tooltip': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  fontSize: '0.8rem',
                  padding: '6px 10px',
                }
              }}
            >
              <IconButton
                onClick={handleRefresh}
                size="small"
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: "16px",
              backgroundColor: "#F3F4F6",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.key}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    backgroundColor:
                      message.sender === "user" ? "#007AFF" : "#E9ECEF",
                    color: message.sender === "user" ? "#ffffff" : "#212529",
                    p: "10px 14px",
                    borderRadius:
                      message.sender === "user"
                        ? "20px 20px 4px 20px"
                        : "20px 20px 20px 4px",
                    maxWidth: "85%",
                    wordWrap: "break-word",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  {message.isLoading ? (
                    <CircularProgress
                      size={20}
                      sx={{
                        color:
                          message.sender === "user" ? "#ffffff" : "#007AFF",
                      }}
                    />
                  ) : message.sender === "model" ? (
                    formatBotMessage(message.text)
                  ) : (
                    <Typography
                      sx={{
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                      }}
                    >
                      {message.text}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box // Quick responses area
            sx={{
              p: 1, // Reduced padding for smaller footer section
              borderTop: "1px solid #E5E7EB",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                pb: 0.5,
                "&::-webkit-scrollbar": { height: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#bdbdbd",
                  borderRadius: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                  borderRadius: "6px",
                },
              }}
            >
              {readyPrompts.map((prompt, index) => (
                <Chip
                  key={index}
                  label={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: "#E3F2FD",
                    color: "#0D47A1",
                    borderRadius: "16px",
                    padding: "4px 10px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#BBDEFB",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Stack // Footer: Input and Send button
            direction="row"
            spacing={1}
            sx={{
              p: 0.5, // Reduced padding for smaller footer section
              borderTop: "1px solid #E5E7EB",
              backgroundColor: "#FFFFFF", // Kept solid white as per user's last provided code
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              multiline
              rows={1}
              maxRows={3}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              sx={{
                backgroundColor: "#F3F4F6",
                borderRadius: "10px", // Adjusted for a more compact look
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px", // Match above
                  paddingRight: "8px",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "#CFD8DC",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                    borderWidth: "1px",
                    boxShadow: `0 0 0 2px rgba(0, 122, 255, 0.2)`,
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "0 12px", // Reduced padding for smaller height
                  fontSize: "0.9rem", // Reduced font size
                  lineHeight: 1.0, // Adjusted line height
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              sx={{
                backgroundColor: "#007AFF",
                borderRadius: "10px", // Match TextField
                minWidth: "auto",
                padding: "0 12px", // Adjusted padding
                height: "46px", // Reduced height to match new TextField height
                boxShadow: "none",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#005ecb",
                  boxShadow: "none",
                },
                "&:disabled": {
                  backgroundColor: "#E0E0E0",
                  color: "#A0A0A0",
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
