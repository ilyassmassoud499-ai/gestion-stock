import axios from "axios";
import { useCallback, useEffect, useState } from "react"; // Ajout de useCallback
import { AnimatePresence, motion } from "framer-motion";
import Toast from "../components/Toast";

const API_BASES = [
  "http://localhost/gestion-stock",
  "http://localhost:8081/gestion-stock",
];

export default function Affectation() {
  const [affectations, setAffectations] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id_materiel: "",
    id_utilisateur: "",
    date_affectation: "",
  }); 

  const API_AFFECTATION = "/Affectation/Affectation.php";
  const API_MATERIEL = "/Materiels/Materiel.php";
  const API_UTILISATEUR = "/utilisateur/utilisateur.php";

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, visible: true });
  }, []);

  const resolveResponseData = (res) =>
    Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

  const sendRequest = useCallback(
    async (path, method = "get", payload = null) => {
      let lastError = null;
      for (const base of API_BASES) {
        try {
          const url = `${base}${path}`;
          return await axios({ method, url, data: payload });
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError;
    },
    []
  );

  const loadAffectations = useCallback(async () => {
    try {
      const res = await sendRequest(API_AFFECTATION, "get");
      setAffectations(resolveResponseData(res));
    } catch (error) {
      console.error("Erreur lors du chargement des affectations:", error);
      setAffectations([]);
      showToast("Erreur de chargement des données", "error");
    }
  }, [API_AFFECTATION, sendRequest, showToast]);

  const loadMateriels = useCallback(async () => {
    try {
      const res = await sendRequest(API_MATERIEL, "get");
      setMateriels(resolveResponseData(res));
    } catch (error) {
      console.error("Erreur lors du chargement des matériels:", error);
      setMateriels([]);
    }
  }, [API_MATERIEL, sendRequest]);

  const loadUtilisateurs = useCallback(async () => {
    try {
      const res = await sendRequest(API_UTILISATEUR, "get");
      setUtilisateurs(resolveResponseData(res));
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setUtilisateurs([]);
    }
  }, [API_UTILISATEUR, sendRequest]);

  useEffect(() => {
    loadAffectations();
    loadMateriels();
    loadUtilisateurs();
  }, [loadAffectations, loadMateriels, loadUtilisateurs]);

  const getMateriel = (id) =>
    materiels.find((m) => m.id_materiel == id);

  const getUtilisateur = (id) =>
    utilisateurs.find((u) => u.id_utilisateur == id);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
    
  const validateForm = () => {
    const newErrors = {};
    if (!form.id_materiel) newErrors.id_materiel = "Le matériel est requis";
    if (!form.id_utilisateur) newErrors.id_utilisateur = "L'utilisateur est requis";
    if (!form.date_affectation) newErrors.date_affectation = "La date est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    
  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Veuillez remplir tous les champs correctement", "error");
      return;
    }
    try {
      if (editMode) {
        await sendRequest(API_AFFECTATION, "put", {
          id_affectation: editId,
          ...form,
        });
      } else {
        await sendRequest(API_AFFECTATION, "post", form);
      }
      showToast(editMode ? "Données mises à jour avec succès." : "Données ajoutées avec succès.", "success");
      resetForm();
      loadAffectations();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'affectation:", error);
      showToast(editMode ? "Échec de la mise à jour des données." : "Échec de l'ajout des données.", "error");
    }
  };

  const resetForm = () => {
    setForm({ id_materiel: "", id_utilisateur: "", date_affectation: "" });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
    setErrors({});
  };

  const deleteAffectation = async (id) => {
    if (!window.confirm("Supprimer cette affectation ?")) return;
    try {
      await sendRequest(API_AFFECTATION, "delete", { id_affectation: id });
      showToast("Données supprimées avec succès.", "success");
      loadAffectations();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'affectation:", error);
      showToast("Échec de la suppression des données.", "error");
    }
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
    <motion.div 
      className="dashboard-panel container py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary m-0">Gestion des Affectations</h2>
        <button
          className={`btn ${showForm ? "btn-secondary" : "btn-success"}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Fermer" : "Nouvelle Affectation"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              className="card shadow-sm border-0 bg-light p-4 mb-4"
              onSubmit={submit}
            >
              <h4 className="mb-3">{editMode ? "Modifier" : "Ajouter"} une affectation</h4>
              
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Matériel</label>
                  <select
                    name="id_materiel"
                    className={`form-select ${errors.id_materiel ? "is-invalid" : ""}`}
                    value={form.id_materiel}
                    onChange={handleChange}
                  >
                    <option value="">-- Choisir matériel --</option>
                    {materiels.map((m) => (
                      <option key={m.id_materiel} value={m.id_materiel}>
                        {m.marque} ({m.numero_serie})
                      </option>
                    ))}
                  </select>
                  {errors.id_materiel && <div className="text-danger small mt-1">{errors.id_materiel}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Utilisateur</label>
                  <select
                    name="id_utilisateur"
                    className={`form-select ${errors.id_utilisateur ? "is-invalid" : ""}`}
                    value={form.id_utilisateur}
                    onChange={handleChange}
                  >
                    <option value="">-- Choisir utilisateur --</option>
                    {utilisateurs.map((u) => (
                      <option key={u.id_utilisateur} value={u.id_utilisateur}>
                        {u.nom} ({u.email})
                      </option>
                    ))}
                  </select>
                  {errors.id_utilisateur && <div className="text-danger small mt-1">{errors.id_utilisateur}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Date d'affectation</label>
                  <input
                    type="date"
                    name="date_affectation"
                    className={`form-control ${errors.date_affectation ? "is-invalid" : ""}`}
                    value={form.date_affectation}
                    onChange={handleChange}
                  />
                  {errors.date_affectation && <div className="text-danger small mt-1">{errors.date_affectation}</div>}
                </div>
              </div>

              <div className="mt-4">
                <button className="btn btn-primary px-4 me-2" type="submit">
                  {editMode ? "Mettre à jour" : "Enregistrer"}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card border-0 shadow-sm p-3">
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                className="form-control border-start-0 ps-0"
                placeholder="Filtrer les affectations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>Matériel</th>
                <th>N° Série</th>
                <th>Utilisateur</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const mat = getMateriel(a.id_materiel);
                const user = getUtilisateur(a.id_utilisateur);
                return (
                  <motion.tr layout key={a.id_affectation}>
                    <td><span className="fw-bold">{mat?.marque || "—"}</span></td>
                    <td>{mat?.numero_serie || "—"}</td>
                    <td>{user?.nom || "—"} <br/><small className="text-muted">{user?.email}</small></td>
                    <td>{a.date_affectation}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          className="btn btn-outline-warning btn-sm"
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
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteAffectation(a.id_affectation)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            {filtered.length === 0 && ( // Affichage du message si la liste est vide
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">Aucune affectation trouvée</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      <Toast
        {...toast}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </motion.div>
  );
}