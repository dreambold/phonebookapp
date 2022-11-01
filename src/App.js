import React, { useState, useEffect } from 'react';
import { Route, Link } from "react-router-dom";
import Home from './component/Home/Homepage';

function App() {

  return (
    <React.Fragment>
      <div className='container'>
            <Route path="/home" component={Home} />
            <Route exact path="/" component={Home} />
    
          </div>
     
    </React.Fragment>

  );
}

export default App;

