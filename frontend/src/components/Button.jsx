// Generic button wrapper so every CTA in the app shares the same variants,
// sizing, loading state, and disabled behavior.
const Button = ({
  children,
  variant = "primary", // primary | outline | ghost | danger
  size = "md", // md | sm
  block = false,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
  ...rest
}) => {
  // Base styling for all buttons
  let variantClasses = "";

  switch (variant) {
    case "outline":
      variantClasses = "border border-[#047857] text-emerald-300 hover:bg-[#047857]/20 hover:text-white";
      break;
    case "ghost":
      variantClasses = "text-emerald-300 hover:bg-[#047857]/20 hover:text-white bg-transparent";
      break;
    case "danger":
      variantClasses = "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20";
      break;
    case "primary":
    default:
      variantClasses = "bg-[#10b981] text-white hover:bg-[#059669] shadow-lg shadow-emerald-900/30 font-medium";
      break;
  }

  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-xs rounded-md" : "px-4 py-2 text-sm rounded-lg";
  const blockClass = block ? "w-full flex justify-center" : "inline-flex justify-center items-center";
  const stateClass = disabled || loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer active:scale-[0.98] transition-all duration-150";

  const classes = [
    "font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
    variantClasses,
    sizeClasses,
    blockClass,
    stateClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;