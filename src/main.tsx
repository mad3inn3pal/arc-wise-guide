import React from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
