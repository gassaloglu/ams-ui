import { useState, useEffect, useRef } from "react";
import {
    Box,
    Stack,
    TextField,
    Button,
    Typography,
    Chip,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

// Employee/Management AI Assistant
export default function AiAssistant() {
    // LocalStorage keys
    const LS_MESSAGES_KEY = "mgmt_chatbot_messages";
    const LS_INPUT_KEY = "mgmt_chatbot_input";

    // Load initial state from localStorage
    const getInitialMessages = () => {
        try {
            const stored = localStorage.getItem(LS_MESSAGES_KEY);
            if (stored) return JSON.parse(stored);
        } catch { }
        return [
            {
                sender: "model",
                text: "Hello! 👨‍💼 How can I help you manage flights, employees, or operations today?",
                key: `model-initial-${Date.now()}`,
            },
        ];
    };
    const getInitialInput = () => {
        try {
            const stored = localStorage.getItem(LS_INPUT_KEY);
            if (stored) return JSON.parse(stored);
        } catch { }
        return "";
    };

    const [input, setInput] = useState(getInitialInput);
    const [messages, setMessages] = useState(getInitialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Employee/management ready prompts
    const readyPrompts = [
        "List all flights today",
        "Show pending check-ins",
        "Add a new employee",
        "Show flight delays",
        "List all employees",
        "Show revenue summary",
    ];

    // Helper function to apply basic Markdown to text
    const applyMarkdown = (markdownText) => {
        if (!markdownText) return "";
        let html = markdownText;
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");
        html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
        html = html.replace(/(?<!_)_(?!_)(.*?)(?<!_)_(?!_)/g, "<em>$1</em>");
        html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");
        html = html.replace(/`(.*?)`/g, "<code>$1</code>");
        return html;
    };

    // Format bot message (no flight cards, just markdown/text)
    const formatBotMessage = (text) => {
        return (
            <Typography
                component="div"
                sx={{
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                }}
                dangerouslySetInnerHTML={{ __html: applyMarkdown(text) }}
            />
        );
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                    "http://127.0.0.1:8081/api/v1/employee_rag",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            prompt: promptToSend,
                            history: historyForAPI,
                            context: "employee_management",
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

    const handleRefresh = () => {
        localStorage.removeItem(LS_MESSAGES_KEY);
        localStorage.removeItem(LS_INPUT_KEY);
        setMessages([
            {
                sender: "model",
                text: "Hello! 👨‍💼 How can I help you manage flights, employees, or operations today?",
                key: `model-initial-${Date.now()}`,
            },
        ]);
        setInput("");
    };

    useEffect(() => {
        localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
    }, [messages]);
    useEffect(() => {
        localStorage.setItem(LS_INPUT_KEY, JSON.stringify(input));
    }, [input]);

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                minHeight: 0,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                flex: 1,
            }}
        >
            <Box
                sx={{
                    py: 2,
                    px: 3,
                    borderBottom: "1px solid #E5E7EB",
                    backgroundColor: "#E3F2FD",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "56px",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        color: "#1976d2",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        lineHeight: 1.2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <span role="img" aria-label="sparkles">✨</span>
                    AI Assistant
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
                    <Button
                        onClick={handleRefresh}
                        size="small"
                        startIcon={<RefreshIcon />}
                        sx={{
                            color: "#fff",
                            backgroundColor: "#1976d2",
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: "#1565c0",
                                color: "#fff",
                            },
                            transition: "all 0.2s ease-in-out",
                            ml: 2,
                        }}
                    >
                        New Chat
                    </Button>
                </Tooltip>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: 3,
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    minHeight: 0,
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
                                    message.sender === "user" ? "#1976d2" : "#E9ECEF",
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
                                            message.sender === "user" ? "#ffffff" : "#2E7D32",
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
            <Box
                sx={{
                    p: 2,
                    borderTop: "1px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        pb: 0.5,
                        mb: 1,
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
                    {/* {readyPrompts.map((prompt, index) => (
                        <Chip
                            key={index}
                            label={prompt}
                            onClick={() => handleSend(prompt)}
                            disabled={isLoading}
                            sx={{
                                backgroundColor: "#E3F2FD",
                                color: "#1976d2",
                                borderRadius: "16px",
                                padding: "4px 10px",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                transition: "background-color 0.2s ease",
                                "&:hover": {
                                    backgroundColor: "#90caf9",
                                },
                            }}
                        />
                    ))} */}
                </Stack>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
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
                            borderRadius: "10px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                paddingRight: "8px",
                                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                                "& fieldset": {
                                    borderColor: "#1976d2",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#90caf9",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#1976d2",
                                    borderWidth: "1px",
                                    boxShadow: `0 0 0 2px rgba(25, 118, 210, 0.2)`
                                },
                            },
                            "& .MuiInputBase-input": {
                                padding: "0 12px",
                                fontSize: "0.9rem",
                                lineHeight: 1.0,
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => handleSend(input)}
                        disabled={isLoading || !input.trim()}
                        sx={{
                            backgroundColor: "#1976d2",
                            borderRadius: "10px",
                            minWidth: "auto",
                            padding: "0 12px",
                            height: "46px",
                            boxShadow: "none",
                            transition: "background-color 0.2s ease",
                            "&:hover": {
                                backgroundColor: "#1565c0",
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
        </Box>
    );
}
