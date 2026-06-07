import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
      <div className="container">
        <Link className="navbar-brand text-primary" to="/accueil">Gestion du Stock</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item">
              <Link className="nav-link" to="/materiel">Materiel</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/utilisateur">Utilisateur</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mouvement">mouvement</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/affectation">Affectation</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/depot">Depot</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
