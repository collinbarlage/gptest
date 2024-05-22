import logo from './logo.svg'
import './App.css'
import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Signup from './components/Signup'
import Game from './components/Game'

function App() {
  return (
    <div className="App">

      <Router>
        <Switch>
          <Route exact path="/">
            <Game />
          </Route>


          <Route path="/signup">
            <Signup />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
