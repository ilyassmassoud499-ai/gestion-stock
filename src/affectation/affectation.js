import axios from "axios";
import { useEffect, useState } from "react";

export default function Affectation() {
  const [affectations, setAffectations] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id_materiel: "",
    id_utilisateur: "",
    date_affectation: "",
  });

  const API_AFFECTATION =
    "http://localhost:8081/gestion-stock/Affectation/Affectation.php";
  const API_MATERIEL =
    "http://localhost:8081/gestion-stock/Materiels/Materiel.php";
  const API_UTILISATEUR =
    "http://localhost:8081/gestion-stock/utilisateur/utilisateur.php";

  useEffect(() => {
    loadAffectations();
    loadMateriels();
    loadUtilisateurs();
  }, []);

  const loadAffectations = async () => {
    const res = await axios.get(API_AFFECTATION);
    setAffectations(res.data);
  };

  const loadMateriels = async () => {
    const res = await axios.get(API_MATERIEL);
    setMateriels(res.data);
  };

  const loadUtilisateurs = async () => {
    const res = await axios.get(API_UTILISATEUR);
    setUtilisateurs(res.data);
  };

  const getMateriel = (id) =>
    materiels.find((m) => m.id_materiel === id);

  const getUtilisateur = (id) =>
    utilisateurs.find((u) => u.id_utilisateur === id);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
    
    

  const submit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(API_AFFECTATION, {
        id_affectation: editId,
        ...form,
      });
    } else {
      await axios.post(API_AFFECTATION, form);
    }
    resetForm();
    loadAffectations();
  };

  const resetForm = () => {
    setForm({ id_materiel: "", id_utilisateur: "", date_affectation: "" });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
  };

  const deleteAffectation = async (id) => {
    if (!window.confirm("Supprimer cette affectation ?")) return;
    await axios.delete(API_AFFECTATION, {
      data: { id_affectation: id },
    });
    loadAffectations();
  };

  //  FILTRAGE COMPLET (affectation + matériel + utilisateur)
  const filtered = affectations.filter((a) => {
    const mat = getMateriel(a.id_materiel);
    const user = getUtilisateur(a.id_utilisateur);

    const data = [
      a.id_affectation,
      a.id_materiel,
      mat?.marque,
      mat?.numero_serie,
      a.id_utilisateur,
      user?.email,
      user?.nom,
      a.date_affectation,
    ]
      .join(" ")
      .toLowerCase();

    return data.includes(search.toLowerCase());
  });

  return (
    <div style={{ width: "900px", margin: "40px auto" }}>
      <button
        className="btn btn-success"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Fermer" : "Ajouter Affectation"}
      </button>

      {showForm && (
        <form
          className="container shadow bg-light p-3 mt-3"
          onSubmit={submit}
        >
          <h2>{editMode ? "Modifier Affectation" : "Ajouter Affectation"}</h2>

          <select
            name="id_materiel"
            className="form-control mb-2"
            value={form.id_materiel}
            onChange={handleChange}
            required
          >
            <option value="">-- Choisir matériel --</option>
            {materiels.map((m) => (
              <option key={m.id_materiel} value={m.id_materiel}>
                {m.id_materiel} - {m.marque} ({m.numero_serie})
              </option>
            ))}
          </select>

          <select
            name="id_utilisateur"
            className="form-control mb-2"
            value={form.id_utilisateur}
            onChange={handleChange}
            required
          >
            <option value="">-- Choisir utilisateur --</option>
            {utilisateurs.map((u) => (
              <option key={u.id_utilisateur} value={u.id_utilisateur}>
                {u.id_utilisateur} - {u.email} ({u.nom})
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date_affectation"
            className="form-control mb-2"
            value={form.date_affectation}
            onChange={handleChange}
            required
          />

          <button className="btn btn-success">
            {editMode ? "Modifier" : "Enregistrer"}
          </button>
        </form>
      )}

      <hr />

      <input
        className="form-control mb-3"
        placeholder="Filtrer tous les champs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-striped table-hover shadow">
        <thead>
          <tr>
            <th>ID affectation</th>
            <th>ID matériel</th>
            <th>Marque Materiel</th>
            <th>Numéro série Materiel</th>
            <th>ID utilisateur</th>
            <th>Email Utilisateur</th>
            <th>Nom utilisateur</th>
            <th>Date affectation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => {
            const mat = getMateriel(a.id_materiel);
            const user = getUtilisateur(a.id_utilisateur);

            return (
              <tr key={a.id_affectation}>
                <td>{a.id_affectation}</td>
                <td>{a.id_materiel}</td>
                <td>{mat?.marque || "—"}</td>
                <td>{mat?.numero_serie || "—"}</td>
                <td>{a.id_utilisateur}</td>
                <td>{user?.email || "—"}</td>
                <td>{user?.nom || "—"}</td>
                <td>{a.date_affectation}</td>
                <td className=" d-flex gap-2 justify-content-between">
                  <button
                    className="btn btn-danger me-1"
                    onClick={() => deleteAffectation(a.id_affectation)}
                  >
                    Supprimer
                  </button>
                  <button
                    className="btn btn-warning "
                    onClick={() => {
                      setEditMode(true);
                      setEditId(a.id_affectation);
                      setForm({
                        id_materiel: a.id_materiel,
                        id_utilisateur: a.id_utilisateur,
                        date_affectation: a.date_affectation,
                      });
                      setShowForm(true);
                    }}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}