import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';
import { Provider } from 'react-redux';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <App />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
