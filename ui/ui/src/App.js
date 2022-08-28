import "./App.css";
import Person from "./components/persons/Person";
import AddOrEdit from "./components/persons/AddOrEdit";
import AddOrEditEvents from "./components/events/AddOrEditEvents";
import Event from "./components/events/Event";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import React from 'react'
import git from './symbole-github-violet.png';

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import View from "./components/persons/View";

function App() {
  return (
    <BrowserRouter>
      <div class="container text-left" className="App">       
      <Header/>      
     
          <Routes >
            <Route exact path="/" element={<Person/>} />
            <Route exact path="*" element={<Person/>} />
            <Route exact path="/persons" element={<Person/>} />
            <Route exact path="/persons/addoredit/:id" element={<AddOrEdit/>} />
            <Route exact path="/persons/view/:id" element={<View/>} />
            <Route exact path="/events" element={<Event/>} />
            <Route exact path="/events/addoredit/:id" element={<AddOrEditEvents/>} />
          </Routes >
          
        <br/>
        <br/>
      <footer style={{backgroundColor: '#ECEDEE', position : "fixed", bottom: '0px', left : '0px', width: '100%'}}>
                
        <h4 style={{fontSize:"15px", fontWeight: '400', color : 'gray'}}>Events App &nbsp;
        <span style={{fontWeight:'700', cursor: 'pointer'}}><img src={git} alt={'Git'} style={{width:'15px', marginTop:'-4px'}}/>Github</span></h4>   
        
      </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
