import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BrowseProducts from "./pages/BrowseProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import SellProduct from "./pages/SellProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import MyProducts from "./pages/MyProducts.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <>
      {/* Dark Greenish Themed Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#022c22", // brand-card
            color: "#d1fae5",      // base-content
            border: "1px solid #047857", // brand-dark
            fontFamily: "Inter, sans-serif",
            fontSize: "0.9rem",
          },
          iconTheme: {
            primary: "#10b981", // brand-DEFAULT
            secondary: "#02120c", // brand-bg
          },
        }}
      />
      
      {/* Routes are wrapped by MainLayout individually inside each page component */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<BrowseProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/sell" element={<ProtectedRoute><SellProduct /></ProtectedRoute>} />
        <Route path="/products/:id/edit" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        <Route path="/my-products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;