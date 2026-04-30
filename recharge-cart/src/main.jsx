import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from '@shopify/polaris'
import '@shopify/polaris/build/esm/styles.css'
import './index.css'
import RechargeCart from './RechargeCart.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider i18n={{}}>
      <RechargeCart />
    </AppProvider>
  </StrictMode>,
)
