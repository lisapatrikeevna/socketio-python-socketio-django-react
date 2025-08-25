import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from "./router";
import { store } from "./bll/store";
import './styles/index.scss';
import { Provider } from "react-redux";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </StrictMode>
)
