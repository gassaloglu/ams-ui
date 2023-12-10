import Box from '@mui/material/Box';
import LoginForm from '../components/Login';

export default function Login() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <LoginForm />
    </Box>
  );
}