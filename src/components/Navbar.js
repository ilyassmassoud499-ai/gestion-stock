import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // Recharge pour cacher Navbar et Footer
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/Accueil">Gestion du Stock</Link>

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
              <Link className="nav-link" to="/Dashboard">Dashboard</Link>
            </li>
           
          
            <li className="nav-item">
              <button className="btn btn-danger ms-3" onClick={logout}>deconnexion</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
