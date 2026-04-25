import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/chat", label: "Chat" },
  { to: "/history", label: "History" },
  { to: "/notes", label: "Notes" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 glass-card mx-3 mt-3 px-4 py-3 backdrop-blur-md sm:mx-4 sm:mt-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xl font-bold gradient-text sm:text-2xl">
          AI Study Pro
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full text-sm font-semibold neon-glow"
        >
          Logout
        </button>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-sm sm:hidden">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-lg bg-white/10 px-2 py-2 hover:text-neon-blue transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
