import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Accueil from "./Accueil/Accueil";
import Materiel from "./materiels/materiel";
import Utilisateur from "./utilisateur/utilisateur";
import Mouvement from "./mouvement/mouvement";
import Affectation from "./affectation/affectation";
import Depot from "./depot/depot";
import Dashboard from "./dashboard/dashboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">

        <Navbar />

        <main className="flex-grow-1">
          <Routes>

            {/* Routes publiques */}
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/materiel" element={<Materiel />} />
            <Route path="/utilisateur" element={<Utilisateur />} />
            <Route path="/mouvement" element={<Mouvement />} />
            <Route path="/affectation" element={<Affectation />} />
            <Route path="/depot" element={<Depot />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Page d'accueil par défaut */}
            <Route path="/" element={<Navigate to="/accueil" replace />} />

            {/* URL inconnue */}
            <Route path="*" element={<Navigate to="/accueil" replace />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;