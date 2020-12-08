import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withRouter } from 'react-router-dom';

const Nav = (props) => {
  const routes = ['converter', 'history'];
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.history.push(routes[newValue]);
  };
  return (
    <AppBar position="static">
      <Tabs value={value} onChange={handleChange} aria-label="navbar">
        <Tab label="Converter" />
        <Tab label="History" />
      </Tabs>
    </AppBar>
  );
};
export default withRouter(Nav);
