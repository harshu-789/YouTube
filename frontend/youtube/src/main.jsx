import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store/userAuth.js';      // <-- your Redux store
import App   from './App.jsx';             // <-- the router root
import './index.css';                      // <-- your Tailwind/etc

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);