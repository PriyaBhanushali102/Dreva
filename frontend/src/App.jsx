import './App.css'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { hydrateAuth } from "./store/slices/authSlice.js";
import { Toaster } from 'react-hot-toast';
import { Header, Footer } from "./components/index.js";
import {
  Home, Login, Register, Profile,
  Products, ProductDetailPage, Cart,
  Checkout, OrderHistory, OrderConfirmation,
  VendorDashboard, VendorProducts, VendorOrders,
  VendorReviews, AddProduct, EditProduct,
} from "./pages/pages.js";

const MainLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <main className='flex-1'><Outlet /></main>
      <Footer />
    </div>
  );
};

const BlankLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return <div className='min-h-screen bg-gray-50'><Outlet /></div>;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem("user");
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(hydrateAuth({ user: parsedUser, token, isVendor: parsedUser.isVendor || false }));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route path="/login"                  element={<Login />} />
          <Route path="/register"               element={<Register />} />
          <Route path="/checkout"               element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/"             element={<Home />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/users/cart"   element={<Cart />} />
          <Route path="/profile"      element={<Profile />} />
          <Route path="/orders"       element={<OrderHistory />} />

          <Route path="/vendor/dashboard"    element={<VendorDashboard />} />
          <Route path="/vendor/products"     element={<VendorProducts />} />
          <Route path="/vendor/products/add" element={<AddProduct />} />
          <Route path="/vendor/products/:id" element={<EditProduct />} />
          <Route path="/vendor/orders"       element={<VendorOrders />} />
          <Route path="/vendor/reviews"      element={<VendorReviews />} />
        </Route>
      </Routes>

      <Toaster
        position='top-right'
        toastOptions={{ duration: 3000, style: { background: "#363636", color: "#fff" } }}
      />
    </>
  );
}

export default App;