import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#02120c] text-emerald-100/90 selection:bg-[#10b981]/30 selection:text-white transition-colors duration-300">
    <Navbar />
    <main className="flex-1 w-full flex flex-col">
      {children}
    </main>
    <Footer />
  </div>
);

export default MainLayout;