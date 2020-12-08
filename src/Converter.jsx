import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 190,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

const Converter = (props) => {
  const classes = useStyles();
  const currencies = [
    {
      value: 'USD',
      label: 'USD',
      sign: '$'
    },
    {
      value: 'EUR',
      label: 'EUR',
      sign: '€'
    },
    {
      value: 'SGD',
      label: 'SGD',
      sign: 'S$'
    }
  ];
  const [currency, setCurrency] = React.useState('EUR');
  const [value, setValue] = React.useState(200);
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <h2> Currency converter </h2>
            <TextField
              value={value}
              id="standard-basic"
              label="SEK"
              inputType="number"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <h2>Currency of choice</h2>
            <TextField
              id="standard-select-currency"
              select
              label="Select"
              value={currency}
              onChange={handleChange}
              helperText="Please select your currency"
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <div>
              <TextField
                readonly
                id="standard-basic"
                label={currencies.find((cur) => cur.value === currency)?.sign}
                inputType="number"
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Converter;
