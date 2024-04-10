import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import 'animate.css'

import Gptest from './pages/Gptest.js';

export default function App() {
  const [navToggle, setNavToggle] = useState(false);

  return (
    <div className="app">

      <Router>
        <div> 

          <Switch>
            <Route exact path="/">
              <Gptest />
            </Route>
            <Route path="/gptest">
              <Gptest />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}