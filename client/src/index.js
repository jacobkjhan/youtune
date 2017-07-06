import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import store from './store.js';
import App from './app.js';

//load main css
import './public/stylesheets/index.scss';

ReactDOM.render(
  (<Provider store={store} >
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>),
  document.getElementById('app'));

// const Vex = require("vexflow");

// var VF = Vex.Flow;
// var div = document.getElementById("boo");
// var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

// renderer.resize(500, 500);
// var context = renderer.getContext();
// context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

// var stave = new VF.Stave(10,40,400);

// stave.addClef("treble").addTimeSignature("4/4");
// stave.setContext(context).draw();
