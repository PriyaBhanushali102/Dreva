import './App.css'
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { hydrateAuth } from "./store/slices/authSlice.js";
import { Toaster } from 'react-hot-toast';
import { Header, Footer } from "./components/index.js"
function App() {
  const dispatch = useDispatch();

  useEffect(() => { 
    // axios.js ya App.jsx mein add karo
console.log('All Env Variables:', import.meta.env);
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Mode:', import.meta.env.MODE);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem("user");
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(hydrateAuth({
          user: parsedUser,
          token: token,
          isVendor: parsedUser.isVendor || false,
        }));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      
      <main className='flex-1'>
        <Outlet />
      </main>

      <Footer />

      {/* Global Toasts */}
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default App
