import Booker from './components/Booker';
import Login from './components/Login';
import Signup from './components/Signup';
import Stack from '@mui/material/Stack'
import './App.css';

export default function App() {
  return (
    <main>
      <Stack spacing={4}>
        <Signup />
        <Login />
        <Booker />
      </Stack>
    </main>
  );
}