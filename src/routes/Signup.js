import Box from '@mui/material/Box';
import SingupForm from '../components/Signup';

export default function Signup() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <SingupForm />
    </Box>
  );
}