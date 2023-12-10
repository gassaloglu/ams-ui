import { Box, AppBar, Toolbar, Typography, IconButton, Stack, Button, Divider } from '@mui/material';
import AirlinesIcon from '@mui/icons-material/Airlines';
import Booker from '../components/Booker';
import hero from '../images/home-hero.png'

import { theme } from '../index';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar position='static'>
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
      </AppBar>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box
          component="img"
          src={hero}
          sx={{ objectFit: 'cover', width: '100%', height: '420px' }}
        />

        <Box
          sx={{
            width: '900px',
            position: 'relative',
            bottom: '88px',
            backgroundColor: theme.palette.background.default,
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          <Booker />
        </Box>
      </Box >
    </>
  );
}