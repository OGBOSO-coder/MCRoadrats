import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Palvelut from './components/pages/palvelut'; // Make sure to use capital letters for component imports
import Hallitus from './components/pages/hallitus';
import Rottaralli from './components/pages/rottaralli';
import SignUp from './components/pages/SignUp';
import History from './components/pages/History';
import Testi from './components/pages/kirjautuminen';

function App() {
  return (
    <HashRouter basename="/">
      <Navbar />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/palvelut' exact component={Palvelut} />
        <Route path='/hallitus' exact component={Hallitus} />
        <Route path='/rottaralli' exact component={Rottaralli} />
        <Route path='/historia' exact component={History} />
        <Route path='/jaseneksi' exact component={SignUp} />
        <Route path='/admin' exact component={Testi} />
      </Switch>
    </HashRouter>
  );
}

export default App;
