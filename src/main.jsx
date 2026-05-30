import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import RestaurantList from './pages/RestaurantList.jsx'
import RestaurantMenu from './pages/RestaurantMenu.jsx'
import OrderTracking from './pages/OrderTracking.jsx'

// HashRouter: GitHub Pages is static hosting, so deep links / refreshes on
// routes like /orders/ord_x would 404 with BrowserRouter. The hash keeps
// routing client-only and refresh-safe.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<RestaurantList />} />
          <Route path="restaurants/:id" element={<RestaurantMenu />} />
          <Route path="orders/:id" element={<OrderTracking />} />
          <Route path="*" element={<RestaurantList />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
