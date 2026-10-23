import { useEffect } from "react";

// Lightweight confirmation modal (used for "delete product" and similar
// destructive actions). Closes on Escape or backdrop click.
const Modal = ({ open, title, children, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#022c22] border border-[#047857] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="text-lg font-bold text-white mb-4 border-b border-[#047857]/40 pb-3 tracking-wide">
            {title}
          </h3>
        )}
        <div className="text-emerald-100/90 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;