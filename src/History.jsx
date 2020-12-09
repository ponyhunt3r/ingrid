import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { currencies } from './Converter';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export const useStyles = makeStyles((theme) => ({
  textField: {
    marginRight: 40,
    marginBottom: 20
  },
  paper: {
    height: 290,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

const History = ({ props }) => {
  const classes = useStyles();

  //get values from local storage
  const localStartDate = localStorage.getItem('startDate');
  const localEndDate = localStorage.getItem('endDate');
  const localValue = localStorage.getItem('difference');
  const localCurrency = localStorage.getItem('currency');

  //set initial state with local storage values if available
  const [startDate, setStartDate] = React.useState(
    localStartDate || '2015-03-26'
  );
  const [endDate, setEndDate] = React.useState(localEndDate || '2017-06-13');
  const [calculatedValue, setCalculatedValue] = React.useState(localValue || 0);
  const [currency, setCurrency] = React.useState(localCurrency || 'EUR');

  const [startRate, setStartRate] = React.useState(0);
  const [endRate, setEndRate] = React.useState(0);

  const handleChange = ({ target: { value } }) => {
    setCurrency(value);
    localStorage.setItem('currency', value);
  };
  const clickHandler = async () => {
    try {
      const startRates = await axios.get(
        `https://api.exchangeratesapi.io/${startDate}?base=SEK`
      );
      const startRate = startRates.data.rates[currency];
      const endRates = await axios.get(
        `https://api.exchangeratesapi.io/${endDate}?base=SEK`
      );
      const endRate = endRates.data.rates[currency];
      const ratio =
        startRate > endRate ? endRate / startRate : startRates / endRate;
      const difference = (100 - ratio * 100).toFixed(2);
      const value = `${startRate > endRate ? '-' : ''} ${difference} %`;
      setCalculatedValue(value);
      localStorage.setItem('difference', value);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <h2> How much has the value changed?</h2>
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
              defaultValue="2017-05-24"
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
              onChange={handleChange}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <div>
              <div>
                <Button
                  onClick={clickHandler}
                  variant="contained"
                  color="primary"
                >
                  Calculate
                </Button>
              </div>
              <h3>Value changed by:</h3>
              <TextField
                readonly
                id="standard-basic"
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
export default History;
