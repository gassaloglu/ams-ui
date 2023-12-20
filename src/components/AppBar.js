import { useAuth } from '../hooks/useAuth';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Stack, Button, Divider } from '@mui/material';
import AirlinesIcon from '@mui/icons-material/Airlines';

export default function AppBar() {
  const { user, logout } = useAuth();

  return (
    <MuiAppBar position='sticky'>
      <Toolbar>
        <IconButton
          disableRipple
          size='large'
          edge='start'
          color='inherit'
          aria-label='logo'
        >
          <AirlinesIcon />
        </IconButton>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          AIRLINES COMPANY
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          divider={<Divider variant='' orientation="vertical" flexItem />}
        >
          <Button href='/project' variant='text' color='inherit'>Project Details</Button>
          <Button href='/about' variant='text' color='inherit'>About us</Button>
          <Button href='/signup' variant='text' color='inherit'>Sign up</Button>
          {
            user
              ? <Button onClick={() => logout()} variant='text' color='inherit'>Log out</Button>
              : <Button href='/login' variant='text' color='inherit'>Log in</Button>
          }
        </Stack>
      </Toolbar>
    </MuiAppBar>
  );
}

