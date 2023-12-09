import Booker from '../components/Booker';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Stack from '@mui/material/Stack'

export default function Home() {
  return (
    <main>
      <Stack spacing={4}>
        <Booker />
      </Stack>
    </main>
  );
}