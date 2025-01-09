import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// root css romoved to build from scrach
const rootElement = document.body;
const root = createRoot(rootElement);
root.render(
//createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
