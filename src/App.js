import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import MainLayout from './layouts/MainLayout';
import Contact from './pages/Contact';
import About from './pages/About';
import Tests from './pages/Tests';
import ProductPage from './pages/ProductPage';

class App extends Component {
  render() {
    return (
      <>
      <Router>
        <Routes>
          <Route path='/' element={<MainLayout/>}>
                <Route path='' element={<Home/>}/>
                <Route path='about' element={<About/>}/>
                <Route path='contact' element={<Contact/>}/>
                <Route path='tests' element={<Tests/>}/>
                <Route path='products' element={<ProductPage/>}/>
          </Route>
        </Routes>
      </Router>
      </>
    );
  }
}

export default App;
