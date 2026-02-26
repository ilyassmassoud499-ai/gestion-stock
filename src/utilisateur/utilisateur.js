import axios from "axios";
import { useEffect, useState } from "react";

export default function Utilisateur() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    nom: "",
    service: "",
    id_direction: ""
  });
  const directions = [
  { id: 1, nom: "informatique" },
  { id: 2, nom: "finance" }
 
];

  const API = "http://localhost:8081/gestion-stock/utilisateur/utilisateur.php";

  const loadUtilisateurs = async () => {
    try {
      const res = await axios.get(API);
      setUtilisateurs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUtilisateurs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Ajouter un utilisateur
  const addUtilisateur = async (e) => {
    e.preventDefault();

    if (!form.password) {
      alert("Le mot de passe est obligatoire pour ajouter un utilisateur");
      return;
    }

    try {
      const res = await axios.post(API, form, {
        headers: { "Content-Type": "application/json" }
      });

      if (res.data.success) {
        setForm({ email: "", password: "", nom: "", service: "", id_direction: "" });
        setShowForm(false);
        loadUtilisateurs();
      } else {
        alert(res.data.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur : " + error.message);
    }
  };

  // Modifier un utilisateur
  const handleEdit = (u) => {
    setEditMode(true);
    setEditId(u.id_utilisateur);
    setForm({
      email: u.email,
      password: "", 
      nom: u.nom,
      service: u.service,
      id_direction: u.id_direction
    });
    setShowForm(true);
  };

  const updateUtilisateur = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(API, { id_utilisateur: editId, ...form }, {
        headers: { "Content-Type": "application/json" }
      });

      if (res.data.success) {
        setForm({ email: "", password: "", nom: "", service: "", id_direction: "" });
        setEditMode(false);
        setEditId(null);
        setShowForm(false);
        loadUtilisateurs();
      } else {
        alert(res.data.message || "Erreur lors de la modification");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur : " + error.message);
    }
  };

  // Supprimer un utilisateur
  const deleteUtilisateur = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce utilisateur ?");
    if (!confirmDelete) return;
    try {
      await axios.delete(API, { data: { id_utilisateur: id } });
      loadUtilisateurs();
    } catch (error) {
      console.error(error);
    }
  };

  // Filter un utilisateur
  const filtredUtilisateur = utilisateurs.filter((u) =>
    Object.values(u)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ width: "800px", margin: "40px auto" }}>
      <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Fermer" : editMode ? "Modifier Utilisateur" : "Ajouter Utilisateur"}
      </button>

      {showForm && (
        <form className="container shadow bg-light" style={{ marginTop: "20px" }} onSubmit={editMode ? updateUtilisateur : addUtilisateur}>
          <h2>{editMode ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</h2>

          <input type="email" name="email" placeholder="Email" value={form.email} className="form-control" onChange={handleChange} required /><br />

          <input type="password" name="password" placeholder="Mot de passe" value={form.password} className="form-control" onChange={handleChange} required={!editMode} /><br />

          <input type="text" name="nom" placeholder="Nom" value={form.nom} className="form-control" onChange={handleChange} required /><br />

          <input type="text" name="service" placeholder="Service" value={form.service} className="form-control" onChange={handleChange} required /><br />

         <select
  name="id_direction"
  className="form-control"
  value={form.id_direction}
  onChange={handleChange}
  required
>
  <option value="">-- Choisir une direction --</option>
  {directions.map((d) => (
    <option key={d.id} value={d.id}>
      {d.nom} ({d.id})
    </option>
  ))}
</select>

          <button className="btn btn-success mb-3" type="submit">{editMode ? "Modifier" : "Enregistrer"}</button>
        </form>
      )}

      <hr />
      <h2>Liste des Utilisateurs</h2>

      <input
        type="text"
        placeholder="Filtrer tous les champs..."
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-striped table-hover shadow border border-1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nom</th>
            <th>Service</th>
            <th>ID direction</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtredUtilisateur.map((u) => (
            <tr key={u.id_utilisateur}>
              <td>{u.id_utilisateur}</td>
              <td>{u.email}</td>
              <td>{u.nom}</td>
              <td>{u.service}</td>
              <td>{u.id_direction}</td>
              <td>
                <button className="btn btn-danger me-1" onClick={() => deleteUtilisateur(u.id_utilisateur)}>Supprimer</button>
                <button className="btn btn-warning" onClick={() => handleEdit(u)}>Modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}