import { FiInbox } from "react-icons/fi";

// Shown whenever a list has nothing to display (no products, no search
// results, no listings yet) — always paired with a next action.
const EmptyState = ({ icon: Icon = FiInbox, title = "Nothing here yet", message, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl bg-[#022c22]/30 border border-dashed border-[#047857]/50">
    <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#02120c] border border-[#047857]/40 text-emerald-400/70 text-3xl shadow-inner">
      <Icon />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">{title}</h3>
    {message && <p className="text-sm text-emerald-200/70 max-w-sm mb-6 leading-relaxed">{message}</p>}
    {action && <div>{action}</div>}
  </div>
);

export default EmptyState;