import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/transparent.jpg"
import './Login.css';

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8081/gestion-stock/auth/Login.php",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);

        navigate("/accueil"); 
      } else {
        setMsg(res.data.message);
      }
    } catch (error) {
      setMsg("Erreur serveur");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-primary mt-4">Bienvenue entrez votre compte</h1>
      <div className="container bg-dark p-4 h-100" style={{ width: "300px", margin: "100px auto" }}>
        <h2 className="text-center text-light">Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        {msg && <p className="text-warning text-center mt-3">{msg}</p>}
      </div>
    </div>
  );
}
