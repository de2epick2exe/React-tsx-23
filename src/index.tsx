import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { setupstore } from './store/store';
import { Provider } from 'react-redux';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import 'animate.css';
import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";
import routes from './routes';

 
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const store = setupstore()

root.render(<Provider store={store as any}>
  <React.StrictMode>
    <ChakraProvider >
      <BrowserRouter>
      
      <Navbar   />
      <Routes>
      {routes.map((route, index) => (
          <Route key={index} {...route} />
        ))}
           
           
      </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
