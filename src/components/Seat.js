import { Box, IconButton, Stack, Typography, Grid } from '@mui/material';
import { EventSeat as SeatIcon } from '@mui/icons-material';
import { chunk, zip } from 'underscore';

const color = {
  occupied: 'primary.main',
  vacant: 'grey',
  selected: 'orange',
}

export const SeatDescription = ({ variant, label }) => (
  <Stack spacing={1} direction='row' alignItems='center'>
    <SeatIcon sx={{ fontSize: 60, color: color[variant] }} />
    <Typography fontWeight='bold'> {label} </Typography>
  </Stack>
);

const SeatBase = ({ variant, onClick }) => (
  <Box>
    <IconButton onClick={onClick}>
      <SeatIcon sx={{ fontSize: 60, color: color[variant] }} />
    </IconButton>
  </Box >
);

const OccupiedSeat = () => <SeatBase variant='occupied' />;
const VacantSeat = ({ selected, onClick }) => <SeatBase variant={selected ? 'selected' : 'vacant'} onClick={onClick} />

function SeatPlanRow({ occupation, row, columns, onClick }) {
  const seats = [];
  let accumulator = 0;
  for (const column of columns) {
    const slice = occupation
      .slice(accumulator, column)
      .map(ocp => ocp ? <OccupiedSeat /> : <VacantSeat onClick={onClick} />);

    seats.push(slice);
    seats.push(<Typography> Empty </Typography>);
  }

  return (
    <Grid container>

    </Grid>
  );
}

export function SeatPlan(props) {
  const sum = props.columns.reduce((a, b) => a + b);
  const gaps = props.columns.length;
  const rows = chunk(props.occupation, sum);

  return (
    <Grid container>
      {rows.map((row, index) =>
        <Grid container key={`row-${index}`}>
          <Grid item> {index + 1}</Grid>
          <Typography>Berkay</Typography>
          <Grid item> {index + 1}</Grid>
        </Grid>
      )}
    </Grid>
  );
}

// <Grid item xs={ } key={seatNumber}>
// <Box display='flex' alignItems="center" justifyContent="center">
//   <Seat number={seatNumber} />
// </Box>
// </Grid>