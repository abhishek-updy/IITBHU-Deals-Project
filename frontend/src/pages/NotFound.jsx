import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";

const NotFound = () => (
  <MainLayout>
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      
      <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#10b981] to-[#047857] drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-2">
        404
      </div>
      
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-wide">
        This listing has been taken down
      </h1>
      
      <p className="text-emerald-200/70 text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
        The page you're looking for doesn't exist, or the product may have already been removed from IITBHU Deals.
      </p>
      
      <Link to="/">
        <Button variant="primary" className="px-8 py-3 text-lg font-bold shadow-xl shadow-emerald-900/20">
          Back to Home
        </Button>
      </Link>
      
    </div>
  </MainLayout>
);

export default NotFound;