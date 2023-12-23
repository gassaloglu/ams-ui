import { Stack } from "@mui/material"
import AppBar from "./AppBar"

export default function Page({ children }) {
  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <AppBar />
      {children}
    </Stack>
  );
}