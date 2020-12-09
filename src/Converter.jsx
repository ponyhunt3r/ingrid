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
    value: 'GBP',
    label: 'GBP',
    sign: '£'
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
    return (
      JSON.parse(localStorage.getItem('rates')) || [
        {
          name: 'USD',
          value: null
        },
        {
          name: 'GBP',
          value: null
        },
        {
          name: 'SGD',
          value: null
        }
      ]
    );
  }, []);
  const findRate = (currencyName) =>
    rates.find((rate) => rate.name === currencyName).value;
  const fetchRates = useEffect(() => {
    //fetch the actual valuation on component mount only when there is no data yes
    //TODO this would need fix if we would need to refresh the rate every day
    if (rates?.some((r) => r.value === null)) {
      axios
        .get(`https://api.exchangeratesapi.io/latest?base=SEK`)
        .then((res) => {
          //save every desired currency so there is no need for redundant calls
          rates.map((rate) => (rate.value = res.data.rates[rate.name]));
          localStorage.setItem('rates', JSON.stringify(rates));
        })
        // inform user when it is impossible to get the info
        .catch((error) => alert(error));
    }
  }, [rates]);
  //local storage values
  const localAmount = localStorage.getItem('amount');
  const localCurrency = localStorage.getItem('currency');

  //set initial state, take local storage values if available
  const [amount, setAmount] = React.useState(localAmount || 200);
  const [currency, setCurrency] = React.useState(localCurrency || 'GBP');
  const [calculatedValue, setCalculatedValue] = React.useState(
    (amount * findRate(currency))?.toFixed(2) || 0
  );
  const handleAmountChange = ({ target: { value } }) => {
    if (isNaN(value)) return;
    setAmount(value);
    setCalculatedValue((value * findRate(currency))?.toFixed(2));
    localStorage.setItem('amount', value);
  };
  const handleCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
    setCalculatedValue((amount * findRate(value))?.toFixed(2));

    localStorage.setItem('currency', value);
  };
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <h2> Currency converter </h2>
            <TextField
              value={amount}
              onChange={handleAmountChange}
              id="amount"
              label="SEK"
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
              onChange={handleCurrencyChange}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <div>
              <TextField
                readOnly
                id="symbol"
                label={currencies.find((cur) => cur.value === currency)?.sign}
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
