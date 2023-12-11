import { useState } from 'react';
import { axios } from '../index';
import { useAuth } from '../hooks/useAuth';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Login() {
  const { login } = useAuth();

  const [isEmployee, setIsEmployee] = useState(false);
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = (_) => {
    setError(false);
    setAuthFailed(false);
    setLoading(true);

    axios.post('/login', { email, password })
      .then(response => {
        login({ token: response.data.token });
      })
      .catch(error => {
        if (error.response) {
          setAuthFailed(true)
        } else {
          setError(true)
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <Paper sx={{ width: '320px', p: 2 }} variant="outlined">
      <Stack sx={{ width: '100%' }} spacing={2} justifyContent="center">
        <Typography variant="h4">
          Welcome!
        </Typography>

        <Typography level="body2" color="#7B91A7">
          Please sign in to continue.
        </Typography>

        {
          isEmployee
            ? <TextField
              error={authFailed}
              label="Personnel number"
              size="small"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            : <TextField
              error={authFailed}
              label="Email"
              type='email'
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
        }

        <TextField
          error={authFailed}
          label="Password"
          type='password'
          size="small"
          helperText="Please check your credentials."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ToggleButtonGroup
          exclusive
          color="primary"
          size='small'
          fullWidth
          value={isEmployee ? 'employee' : 'user'}
          onChange={(e, v) => setIsEmployee(v === 'employee')}
        >
          <ToggleButton value="user">User</ToggleButton>
          <ToggleButton value="employee">Employee</ToggleButton>
        </ToggleButtonGroup>

        <LoadingButton
          loading={loading}
          disabled={loading}
          variant='contained'
          onClick={handleClick}
        >
          Log in
        </LoadingButton>

        <Typography
          fontSize="small"
          sx={{ alignSelf: 'center' }}
        >
          Don&apos;t have an account?
          <Link underline="none" href="/signup"> Sign up</Link>
        </Typography>

        <Snackbar open={error}>
          <Alert severity="error" variant='filled'>
            An error occurred while requesting credentials.
          </Alert>
        </Snackbar>
      </Stack>
    </Paper>
  )
}