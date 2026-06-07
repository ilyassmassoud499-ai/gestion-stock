import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toast";

export default function Mouvement() {
  const [mouvements, setMouvements] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id_materiel: "",
    type_mouvement: "",
    date_mouvement: "",
  });

  const API_MOUVEMENT = "http://localhost:8081/gestion-stock/mouvement/mouvement.php";
  const API_MATERIEL = "http://localhost:8081/gestion-stock/Materiels/Materiel.php";

  useEffect(() => {
    loadMouvements();
    loadMateriels();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
  };

  const loadMouvements = async () => {
    try {
      const res = await axios.get(API_MOUVEMENT);
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setMouvements(data);
    } catch (error) {
      console.error("Erreur chargement mouvements:", error);
      showToast("Erreur de chargement des mouvements", "error");
      setMouvements([]);
    }
  };

  const loadMateriels = async () => {
    try {
      const res = await axios.get(API_MATERIEL);
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setMateriels(data);
    } catch (error) {
      console.error("Erreur chargement matériels:", error);
      setMateriels([]);
    }
  };

  const getMateriel = (id) => materiels.find((m) => String(m.id_materiel) === String(id));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.id_materiel) newErrors.id_materiel = "Veuillez remplir tous les champs correctement!";
    if (!form.type_mouvement) newErrors.type_mouvement = "Le type de mouvement est requis !";
    if (!form.date_mouvement) newErrors.date_mouvement = "La date du mouvement est obligatoire !";
    setErrors(newErrors);
    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Affiche le message d'erreur spécifique du premier champ vide
      const firstError = Object.values(validationErrors)[0];
      showToast(firstError, "error");
      return;
    }
    try {
      const res = editMode 
        ? await axios.put(API_MOUVEMENT, { id_mouvement: editId, ...form })
        : await axios.post(API_MOUVEMENT, form);

      if (res.data.success !== false) {
        showToast(editMode ? "Données mises à jour avec succès." : "Données ajoutées avec succès.", "success");
        resetForm();
        loadMouvements();
      } else {
        showToast(res.data.message || "Erreur lors de l'enregistrement", "error");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      showToast(editMode ? "Échec de la mise à jour des données." : "Échec de l'ajout des données.", "error");
    }
  };

  const resetForm = () => {
    setForm({ id_materiel: "", type_mouvement: "", date_mouvement: "" });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
    setErrors({});
  };

  const deleteMouvement = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce mouvement ?");
    if (!confirmDelete) return;
    try {
      const res = await axios.delete(API_MOUVEMENT, { data: { id_mouvement: id } });
      if (res.data.success !== false) {
        showToast("Données supprimées avec succès.", "success");
        loadMouvements();
      } else {
        showToast(res.data.message || "Erreur de suppression", "error");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      showToast("Échec de la suppression des données.", "error");
    }
  };

  const filtered = mouvements.filter((m) => {
    const mat = getMateriel(m.id_materiel);
    const data = [m.type_mouvement || "", m.date_mouvement || "", mat?.marque || "", mat?.numero_serie || ""].join(" ").toLowerCase();
    return data.includes(search.toLowerCase());
  });

  return (
    <motion.div 
      className="dashboard-panel container py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary m-0">Flux de Stock (Mouvements)</h2>
        <button className={`btn ${showForm ? "btn-secondary" : "btn-success"}`} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fermer" : "Nouveau Mouvement"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <form className="card shadow-sm border-0 bg-light p-4 mb-4" onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Matériel</label>
                  <select name="id_materiel" className={`form-select ${errors.id_materiel ? "is-invalid" : ""}`} value={form.id_materiel} onChange={handleChange}>
                    <option value="">-- Choisir --</option>
                    {materiels.map(m => <option key={m.id_materiel} value={m.id_materiel}>{m.marque} ({m.numero_serie})</option>)}
                  </select>
                  {errors.id_materiel && <div className="text-danger small mt-1">{errors.id_materiel}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Type de mouvement</label>
                  <select name="type_mouvement" className={`form-select ${errors.type_mouvement ? "is-invalid" : ""}`} value={form.type_mouvement} onChange={handleChange}>
                    <option value="">-- Type --</option>
                    <option value="entrer">Entrée</option>
                    <option value="sortie">Sortie</option>
                  </select>
                  {errors.type_mouvement && <div className="text-danger small mt-1">{errors.type_mouvement}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Date</label>
                  <input type="date" name="date_mouvement" className={`form-control ${errors.date_mouvement ? "is-invalid" : ""}`} value={form.date_mouvement} onChange={handleChange} />
                  {errors.date_mouvement && <div className="text-danger small mt-1">{errors.date_mouvement}</div>}
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
        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input className="form-control border-start-0" placeholder="Rechercher un mouvement..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Matériel</th>
              <th>Type</th>
              <th>Date</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const mat = getMateriel(m.id_materiel);
              return (
                <motion.tr layout key={m.id_mouvement}>
                  <td><span className="fw-bold">{mat?.marque}</span> <br/><small className="text-muted">{mat?.numero_serie}</small></td>
                  <td>
                      <span className={`badge ${m.type_mouvement === 'entrer' || m.type_mouvement === 'entrée' ? 'bg-success' : 'bg-danger'}`}>
                        {(m.type_mouvement || "INCONNU").toUpperCase()}
                    </span>
                  </td>
                  <td>{m.date_mouvement}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-end">
                      <button 
                        className="btn btn-outline-warning btn-sm" 
                        onClick={() => {
                          setEditMode(true);
                          setEditId(m.id_mouvement);
                          setForm({ 
                            id_materiel: m.id_materiel, 
                            type_mouvement: m.type_mouvement || m.types_mouvement, 
                            date_mouvement: m.date_mouvement 
                          });
                          setShowForm(true);
                        }}
                      >
                        Modifier
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => deleteMouvement(m.id_mouvement)}>Supprimer</button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Toast 
        {...toast} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />
    </motion.div>
  );
}