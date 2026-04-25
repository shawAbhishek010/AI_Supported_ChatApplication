import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const links = [
  { to: "/chat", icon: "C", label: "Chat" },
  { to: "/history", icon: "H", label: "History" },
  { to: "/notes", icon: "N", label: "Notes" },
  { to: "/profile", icon: "P", label: "Profile" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="hidden sm:flex sticky top-4 w-20 md:w-64 h-[calc(100vh-2rem)] glass-card m-4 p-4 flex-col gap-6"
    >
      <div className="text-2xl font-bold gradient-text hidden md:block">
        AI Pro
      </div>
      <nav className="flex flex-col gap-4">
        {links.map(({ to, icon, label }) => (
          <Link key={to} to={to} aria-label={label}>
            <motion.div
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === to
                  ? "bg-glass border border-white/20"
                  : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-neon-blue"
              >
                {icon}
              </span>
              <span className="hidden md:inline">{label}</span>
            </motion.div>
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
