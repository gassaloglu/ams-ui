import { useState } from 'react';
import { request } from '../utils/request';
import { useAuth } from '../hooks/useAuth';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Signup() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [signupFailed, setSignupFailed] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = (_) => {
    setError(false);
    setSignupFailed(false);
    setLoading(true);

    request('/login/placeholder')
      .then(res => res.json())
      .then(({ token }) => {
        if (token) {
          login({ token });
        } else {
          setSignupFailed(true);
        }
      })
      .catch(_ => setError(true))
      .finally(() => setLoading(false));
  }

  return (
    <Paper sx={{ width: '320px', p: 2 }} variant="outlined">
      <Stack sx={{ width: '100%' }} spacing={2} justifyContent="center">
        <Typography variant="h5">
          Create your account
        </Typography>

        <Typography level="caption" color="#7B91A7">
          Please fill the required information.
        </Typography>

        <Stack spacing={1}>
          <Stack direction='row' spacing={1}>
            <TextField label="Name" size="small" />
            <TextField label="Surname" size="small" />
          </Stack>

          <TextField error={signupFailed} label="Phone Number" type='tel' size="small" />
          <TextField error={signupFailed} label="Email" type='email' size="small" />
          <TextField label="Password" type='password' size="small" />
        </Stack>

        <LoadingButton
          loading={loading}
          disabled={loading}
          variant='contained'
          onClick={handleClick}
        >
          Sing up
        </LoadingButton>

        <Typography
          fontSize="small"
          sx={{ alignSelf: 'center' }}
        >
          Already a member?
          <Link underline="none" href="/login"> Log in</Link>
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