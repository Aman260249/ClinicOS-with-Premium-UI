import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Ye line honi chahiye
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      {/* App hamesha BrowserRouter ke andar hona chahiye */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)