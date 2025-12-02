import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@/app/globals.css'

import ReLoopApp from '@/app/page.jsx'

const rootEl = document.getElementById('root')
createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReLoopApp />
    </BrowserRouter>
  </React.StrictMode>
)
