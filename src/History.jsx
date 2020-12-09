import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { currencies } from './Converter';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';
import { red } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
  textField: {
    marginRight: 40,
    marginBottom: 20
  },
  paper: {
    height: 360,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  red: {
    color: theme.palette.error.main
  },
  green: {
    color: theme.palette.success.main
  }
}));

const History = ({ props }) => {
  const classes = useStyles();

  //get values from local storage
  const localStartDate = localStorage.getItem('startDate');
  const localEndDate = localStorage.getItem('endDate');
  const localValue = localStorage.getItem('difference');
  const localCurrency = localStorage.getItem('currency');
  const localStartRate = localStorage.getItem('startRate');
  const localEndRate = localStorage.getItem('endRate');

  //set initial state with local storage values if available
  const [startDate, setStartDate] = React.useState(
    localStartDate || '2015-03-26'
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [endDate, setEndDate] = React.useState(localEndDate || '2017-06-13');
  const [calculatedValue, setCalculatedValue] = React.useState(localValue || 0);
  const [currency, setCurrency] = React.useState(localCurrency || 'EUR');
  const [startRate, setStartRate] = React.useState(localStartRate, 0);
  const [endRate, setEndRate] = React.useState(localEndRate, 0);

  //handle currency change
  const handleCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
  };

  //calculate difference
  const getValuationDifference = async () => {
    try {
      setIsLoading(true);
      //fetch start and end value and wait for the results
      const startRates = await axios.get(
        `https://api.exchangeratesapi.io/${startDate}?base=SEK`
      );
      const startRate = startRates.data.rates[currency].toFixed(4);
      const endRates = await axios.get(
        `https://api.exchangeratesapi.io/${endDate}?base=SEK`
      );
      const endRate = endRates.data.rates[currency].toFixed(4);
      //do the math how much has the value changes in chosen period
      const ratio =
        startRate > endRate ? endRate / startRate : startRate / endRate;
      const difference = (100 - ratio * 100).toFixed(2);
      const value = `${startRate > endRate ? '-' : ''} ${difference} %`;

      //set values so result can be displayed
      setCalculatedValue(value);
      setStartRate(startRate);
      setEndRate(endRate);
      setIsLoading(false);

      //save all the values into localstorage
      localStorage.setItem('difference', value);
      localStorage.setItem('currency', currency);
      localStorage.setItem('startRate', startRate);
      localStorage.setItem('endRate', endRate);
      localStorage.setItem('startDate', startDate);
      localStorage.setItem('endDate', endDate);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };
  const resultClass =
    calculatedValue.toString().indexOf('-') > -1 ? classes.red : classes.green;
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <h2> How much has the SEK value changed?</h2>
            <TextField
              id="date"
              label="Start date"
              type="date"
              value={startDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              onChange={(event) => {
                setStartDate(event.target.value);
              }}
            />
            <TextField
              id="date"
              label="End date"
              type="date"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
              }}
            />
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
              <div>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    onClick={getValuationDifference}
                    variant="contained"
                    color="primary"
                  >
                    Calculate
                  </Button>
                )}
              </div>
              <h3>Value changed by:</h3>
              <div>
                <TextField
                  readOnly
                  id="start"
                  label={startDate}
                  value={startRate}
                  className={classes.textField}
                />
                <TextField readOnly id="end" label={endDate} value={endRate} />
              </div>
              <h3 className={resultClass}>{calculatedValue}</h3>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default History;
