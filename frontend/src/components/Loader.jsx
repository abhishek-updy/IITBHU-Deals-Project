// Simple full-width spinner used while data is being fetched.
const Loader = () => (
  <div className="flex items-center justify-center w-full py-16">
    <div 
      className="animate-spin rounded-full h-12 w-12 border-4 border-[#047857]/30 border-t-[#10b981]" 
      role="status" 
      aria-label="Loading" 
    />
  </div>
);

export default Loader;