import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
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
  const rates = [
    {
      name: 'USD',
      value: null
    },
    {
      name: 'EUR',
      value: null
    },
    {
      name: 'SGD',
      value: null
    }
  ];
  const [currency, setCurrency] = React.useState('EUR');
  const [calculatedValue, setCalculatedValue] = React.useState(0);
  const [value, setValue] = React.useState(200);
  const handleChange = ({ target: { value } }) => {
    setCurrency(value);
    axios.get(`https://api.exchangeratesapi.io/latest?base=SEK`).then((res) => {
      setCalculatedValue(200 * res.data.rates[value]);
    });
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
                value={calculatedValue}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Converter;
