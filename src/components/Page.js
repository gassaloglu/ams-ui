import { Stack } from "@mui/material";
import AppBar from "./AppBar";
import Chatbot from "./ChatBot";

export default function Page({ children }) {
  return (
    <Stack sx={{ minHeight: "100vh", position: "relative" }}>
      <AppBar />
      {children}
      <Chatbot />
    </Stack>
  );
}

export function EmptyPage({ children }) {
  return (
    <Stack sx={{ width: '100%', height: '100vh' }}>
      {children}
    </Stack>
  );
}