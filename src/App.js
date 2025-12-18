import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home"
import MainLayout from './layouts/MainLayout';
import Contact from './pages/Contact';
import About from './pages/About';
import Collection from './pages/Collection';
import Login from './pages/authenticate/Login';
import Register from './pages/authenticate/Register';
import Rings from './pages/Rings';
import Bracelet from './pages/Bracelet';
import Necklace from './pages/Necklace';
import Earings from './pages/Earings';
import Dashboard from './pages/admin/Dashboard';
import Set from './pages/Set';
import Cart from './pages/Cart';
import Item from './pages/Item';
import ScrollToTop from './services/ScrollToTop';


class App extends Component {
  render() {
    return (
      <>
      <Router>
        <ScrollToTop/>
        <Routes>
          <Route path='/' element={<MainLayout/>}>
                <Route path='' element={<Home/>}/>
                <Route path='about' element={<About/>}/>
                <Route path='contact' element={<Contact/>}/>
                <Route path='collection' element={<Collection/>}/>
                <Route path='rings' element={<Rings/>}/>
                <Route path='bracelets' element={<Bracelet/>}/>
                <Route path='necklace' element={<Necklace/>}/>
                <Route path='earings' element={<Earings/>}/>
                <Route path='set' element={<Set/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path='cart' element={<Cart/>}/>
                {/*<Route path='register' element={<Register/>}/>*/}
                <Route path='backoffice' element={<Dashboard/>}/> 
                <Route path='item/:id' element={<Item/>}/>
          </Route>
      
        </Routes>
      </Router>
      </>
    );
  }
}

export default App;
