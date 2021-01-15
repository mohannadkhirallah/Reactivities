import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/styles.css';
import App from './app/layout/App';
import {BrowserRouter} from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';
import ScrollToTop from './app/layout/ScrollToTop';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <ScrollToTop>
    <App/>
    </ScrollToTop>,
    </BrowserRouter>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
