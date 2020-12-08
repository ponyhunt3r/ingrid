import './App.css';
import React from 'react';

import Converter from './Converter';
import History from './History';
import Nav from './Nav';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Nav />
      <div>
        <Route path="/" exact component={Converter} />
        <Route path="/converter" component={Converter} />
        <Route path="/history" component={History} />
      </div>
    </Router>
  );
}

export default App;
