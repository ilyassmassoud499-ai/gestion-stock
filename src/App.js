import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./auth/Login";
import Accueil from "./Accueil/Accueil";
import Materiel from "./materiels/materiel";
import Utilisateur from "./utilisateur/utilisateur";
import Mouvement from "./mouvement/mouvement";
import Affectation from "./affectation/affectation";
import Depot from "./depot/depot";
import Dashboard from "./dashboard/dashboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Route privée : accessible SEULEMENT si connecté */
function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/" replace />;
}

/* Route publique : Login interdit si déjà connecté */
function PublicRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? <Navigate to="/accueil" replace /> : children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">

        {user && <Navbar />}

        <main className="flex-grow-1">
          <Routes>

            {/* LOGIN */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login setUser={setUser} />
                </PublicRoute>
              }
            />

            {/* ROUTES PRIVÉES */}
            <Route path="/accueil" element={<PrivateRoute><Accueil /></PrivateRoute>} />
            <Route path="/materiel" element={<PrivateRoute><Materiel /></PrivateRoute>} />
            <Route path="/utilisateur" element={<PrivateRoute><Utilisateur /></PrivateRoute>} />
            <Route path="/mouvement" element={<PrivateRoute><Mouvement /></PrivateRoute>} />
            <Route path="/affectation" element={<PrivateRoute><Affectation /></PrivateRoute>} />
            <Route path="/depot" element={<PrivateRoute><Depot /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            {/* URL inconnue */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

        {user && <Footer />}
      </div>
    </BrowserRouter>
  );
}

export default App;