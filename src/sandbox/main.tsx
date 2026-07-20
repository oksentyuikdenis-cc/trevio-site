import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SphereLab } from './SphereLab'
import '../styles/global.css'

createRoot(document.getElementById('lab-root')!).render(
  <StrictMode>
    <SphereLab />
  </StrictMode>,
)
