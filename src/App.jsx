import React, { useContext,useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';




// Context
import { ThemeContext } from './ThemeContext';

// Components & Pages
import Admin from './components/Admin';
//import ProductDetails from './components/ProductDetails';

import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Banner from './components/Banner';

import AdminInventory from './pages/AdminInventory';
import CustomerInventory from './pages/CustomerInventory';

import Profile from './pages/Profile ';
import User from './pages/User';
import CategoryAdmin from './pages/CategoryAdmin';
import Orders from './pages/Orders';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import AdminLogin from './pages/AdminLogin';
import ChangePassword from './pages/ChangePassword';
import EditProfile from './pages/EditProfile';
import AdminProfile from './pages/AdminProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Wishlist from './pages/WishList';
import OurProducts from './pages/OurProducts';
import Dashboard from './pages/Dashboard';
import BuyNow from './pages/BuyNow';
import CategoryDetails from './pages/CategoryDetails';
import Categories from './pages/Categories';
import ProductManager from './pages/ProductManager';
import CategoryProducts from './pages/CategoryProducts';
import AddProduct from './pages/AddProduct';
import ShowProducts from './pages/ShowProducts';
import MyOrders from './pages/MyOrders';
import ProductSlider from './pages/ProductSlider';

import Contact from './pages/Contect';

import ProtectedRoute from './components/ProtectedRoute';



import CartCard from './pages/Cart';


import AdminDashboard from './pages/Dashboard';


import AdminPrivateRoute from './components/AdminPrivateRoute';

import CartSidebar from './pages/CartSlider';

import ProductList from './pages/ProductList';

import ForgotPassword from './pages/ForgotPassword';


import ResetPassword from './pages/ResetPossword';

 import Sidebar from './components/Sidebar';
 import Navbar from './components/Navbar';


 import CategoryCards from './pages/CategoryCards';




      

import CartSlider from './pages/CartSlider'; 
import About from './pages/About';

const App = () => {
  const { darkMode } = useContext(ThemeContext);
  const [isCartOpen, setCartOpen] = useState(false); 


  return (
    <div className={darkMode ? 'dark bg-dark text-light' : 'bg-light text-dark'}>
       {/* <div onClick={() => setCartOpen(true)} style={{ cursor: 'pointer' }}>
        🛒 View Cart
      </div> */}
      <CartProvider>
  
        <Router>
          <ToastContainer />
          {/* <CartIcon onClick={() => setCartOpen(true)} />       Add this */}
          <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} /> {/* Add this */}

          <Routes>

{/*         
        <Router>
          <ToastContainer />
          <Routes> */}





            {/* Default Redirect */}
            <Route path="/a" element={<Navigate to="/admin/profile" />} />



<Route path='/about'element={<About/>}/>


            {/* Public Routes */}
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            {/* <Route path="/product/:id" element={<ProductDetails />} /> */}
            <Route path="/category/:categoryId" element={<CategoryProducts />} />
            <Route path="/category/:id" element={<CategoryDetails />} />
            <Route path="/ourproducts" element={<OurProducts />} />
            <Route path="/checkout/:productId" element={<Checkout />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/buy-now/:id" element={<BuyNow />} />
            

            <Route path="/buy-now" element={<BuyNow />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/review/:productId" element={<ReviewForm />} /> */}



            <Route path="/productCard" element={<ProductCard />} />






            <Route path="/categories" element={<Categories />} />
            <Route path="/productslider" element={<ProductSlider />} />
            <Route path="/contact" element={<Contact />} />

            {/* Customer Protected Routes */}
            <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/customer/inventory" element={<ProtectedRoute><CustomerInventory /></ProtectedRoute>} />






<Route path="/category" element={<CategoryCards />} />


 <Route path="/" element={<ProductList />} />
      













<Route path="/cartslider" element={<CartSlider/>} />


      <Route path="/CartCard" element={<CartCard/>} />     

<Route path='/Sidebar' element={<Sidebar/>}/>
<Route path='/Navbar' element={<Navbar/>}/>

<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/reset-password/:token" element={<ResetPassword />}/>

  <Route path="/admin/dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
  <Route path="/admin/profile" element={<AdminPrivateRoute><AdminProfile /></AdminPrivateRoute>} />
  <Route path="/admin/edit" element={<AdminPrivateRoute><EditProfile /></AdminPrivateRoute>} />
  <Route path="/admin/change-password" element={<AdminPrivateRoute><ChangePassword /></AdminPrivateRoute>} />

 <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={
    <AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>
  } />
 


  <Route path="/admin/edit" element={
    <AdminPrivateRoute><EditProfile /></AdminPrivateRoute>
  } />
  <Route path="/admin/change-password" element={
    <AdminPrivateRoute><ChangePassword /></AdminPrivateRoute>
  } />
            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
            <Route path="/admin/inventory" element={<ProtectedRoute><AdminInventory /></ProtectedRoute>} />
            {/* <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} /> */}


<Route path="/admin/orders" element={< Orders/>}/>

            <Route path="/admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute><CategoryAdmin /></ProtectedRoute>} />
            <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/show" element={<ProtectedRoute><ShowProducts /></ProtectedRoute>} />




<Route path="/admin/forgot" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />



            {/* Extra Routes */}
            <Route path="/banner" element={<Banner />} />
            <Route path="/Header" element={<Header />} />

          
          </Routes>


           <ToastContainer
          position="bottom-right"
          autoClose={1500}
          pauseOnHover={false}
          theme="light"
        />
        </Router>
      </CartProvider>
    </div>
  );
};

export default App;
