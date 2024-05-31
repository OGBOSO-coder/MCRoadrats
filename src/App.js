import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import palvelut from './components/pages/palvelut';
import hallitus from './components/pages/hallitus';
import rottaralli from './components/pages/rottaralli';
import SignUp from './components/pages/SignUp';
import History from './components/pages/History';
import Testi from './components/pages/kirjautuminen';

function App() {
  return (
    <BrowserRouter basename="/uudet/build">
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/palvelut' component={palvelut} />
          <Route path='/hallitus' component={hallitus} />
          <Route path='/rottaralli' component={rottaralli} />
          <Route path='/historia' component={History}/>
          <Route path='/jaseneksi' component={SignUp} />
          <Route path='/admin' component={Testi} />
        </Switch>
        </BrowserRouter>
  );
}

export default App;
