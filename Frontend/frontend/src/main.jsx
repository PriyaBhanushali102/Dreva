import './index.css'
import React from 'react'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import store from './store/store.js'
import { Provider } from 'react-redux'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  Home,
  Login,
  Register,
  Profile,
  Products,
  ProductDetailPage,
  Cart,
  Checkout,
  OrderHistory,
  OrderConfirmation,
  VendorDashboard,
  VendorProducts,
  VendorOrders,
  VendorReviews,
  AddProduct,
  EditProduct,
} from "./pages/pages.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "users/cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "profile", element: <Profile /> },
      { path: "orders", element: <OrderHistory /> },
      { path: "order-confirmation/:id", element: <OrderConfirmation /> },

      // Vendor
      { path: "vendor/dashboard", element: <VendorDashboard /> },
      { path: "vendor/products", element: <VendorProducts /> },
      { path: "vendor/products/add", element: <AddProduct /> },
      { path: "vendor/products/:id", element: <EditProduct /> },
      { path: "vendor/orders", element: <VendorOrders /> },
      { path: "vendor/reviews", element: <VendorReviews/>},
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
)
