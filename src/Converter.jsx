import React, { useEffect, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
export const useStyles = makeStyles((theme) => ({
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
export const currencies = [
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

const Converter = (props) => {
  const classes = useStyles();

  const rates = useMemo(() => {
    return [
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
  }, []);
  useEffect(() => {
    if (rates.some((r) => r.value === null)) {
      axios
        .get(`https://api.exchangeratesapi.io/latest?base=SEK`)
        .then((res) => {
          rates.map((rate) => (rate.value = res.data.rates[rate.name]));
        });
    }
  }, [rates]);
  const findRate = (value) => rates.find((rate) => rate.name === value).value;
  const [currency, setCurrency] = React.useState('EUR');
  const [calculatedValue, setCalculatedValue] = React.useState(0);
  const [amount, setAmount] = React.useState(200);
  const handleChange = ({ target: { value } }) => {
    setCurrency(value);
    //this can be modfied so we will calculate given amount of SEK
    //but in my opinion requirements clearly state to calculate fixed value of 200
    setCalculatedValue(amount * findRate(value).toFixed(4));
  };
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <h2> Currency converter </h2>
            <TextField value={amount} id="standard-basic" label="SEK" />
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
