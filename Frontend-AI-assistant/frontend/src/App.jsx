import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import History from "./pages/History";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token } = useAuth();
  return (
    <BrowserRouter>
      <div className="relative min-h-screen flex">
        {token && <Sidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          {token && <Navbar />}
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={<Navigate to={token ? "/chat" : "/login"} replace />}
              />
              <Route
                path="/login"
                element={token ? <Navigate to="/chat" replace /> : <Login />}
              />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <History />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <PrivateRoute>
                    <Notes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={<Navigate to={token ? "/chat" : "/login"} replace />}
              />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </BrowserRouter>
  );
}
