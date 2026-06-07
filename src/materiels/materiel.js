import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toast";
import "./materiel.css";

const API_BASES = [
  "http://localhost/gestion-stock",
  "http://localhost:8081/gestion-stock",
];

export default function Materiel() {
  const [materiels, setMateriels] = useState([]);
  const [depot, setDepot] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const [form, setForm] = useState({
    marque: "",
    modele: "",
    numero_serie: "",
    date_achat: "",
    etat: "",
    id_depot: "",
  });

  const API = "/Materiels/Materiel.php";
  const DEPOT_API = "/Depot/depot.php";

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
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

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!form.marque.trim()) {
      newErrors.marque = "La marque est requise";
    }
    if (!form.modele.trim()) {
      newErrors.modele = "Le modèle est requis";
    }
    if (!form.numero_serie.trim()) {
      newErrors.numero_serie = "Le numéro de série est requis";
    }
    if (!form.date_achat) {
      newErrors.date_achat = "La date d'achat est requise";
    }
    if (!form.etat) {
      newErrors.etat = "L'état est requis";
    }
    if (!form.id_depot) {
      newErrors.id_depot = "Le dépôt est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadMateriel = async () => {
    try {
      setLoading(true);
      const res = await sendRequest(API, "get");
      setMateriels(resolveResponseData(res));
    } catch (error) {
      console.error(error);
      showToast(
        "Erreur lors du chargement des matériels: " + (error.response?.data?.message || error.message),
        "error"
      );
      setMateriels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepot = async () => {
    try {
      const res = await sendRequest(DEPOT_API, "get");
      setDepot(resolveResponseData(res));
    } catch (error) {
      console.error("Erreur lors du chargement des dépôts :", error);
      showToast("Erreur lors du chargement des dépôts", "error");
      setDepot([]);
    }
  };

  useEffect(() => {
    loadMateriel();
    loadDepot();
  }, []);

  // Changement des inputs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Ajouter matériel
  const addMateriel = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Veuillez remplir tous les champs correctement", "error");
      return;
    }

    try {
      setLoading(true);
      await sendRequest(API, "post", form);
      
      setForm({
        marque: "",
        modele: "",
        numero_serie: "",
        date_achat: "",
        etat: "",
        id_depot: "",
      });
      setErrors({});
      setShowForm(false);
      
      showToast("Matériel ajouté avec succès ✓", "success");
      await loadMateriel();
    } catch (error) {
      console.error("Erreur ajout matériel:", error);
      const message = error.response?.data?.message || error.message || "Erreur lors de l'ajout du matériel";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Modifier matériel
  const updateMateriel = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Veuillez remplir tous les champs correctement", "error");
      return;
    }

    try {
      setLoading(true);
      await sendRequest(API, "put", { id_materiel: editId, ...form });
      
      setForm({
        marque: "",
        modele: "",
        numero_serie: "",
        date_achat: "",
        etat: "",
        id_depot: "",
      });
      setErrors({});
      setEditMode(false);
      setEditId(null);
      setShowForm(false);
      
      showToast("Matériel modifié avec succès ✓", "success");
      await loadMateriel();
    } catch (error) {
      console.error("Erreur modification matériel:", error);
      const message = error.response?.data?.message || error.message || "Erreur lors de la modification du matériel";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Éditer matériel
  const handleEdit = (m) => {
    setEditMode(true);
    setEditId(m.id_materiel);
    setForm({
      marque: m.marque,
      modele: m.modele,
      numero_serie: m.numero_serie,
      date_achat: m.date_achat,
      etat: m.etat,
      id_depot: m.id_depot,
    });
    setErrors({});
    setShowForm(true);
  };

  // Supprimer matériel avec confirmation
  const deleteMateriel = async (id, marque) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le matériel "${marque}" ?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await sendRequest(API, "delete", { id_materiel: id });
      showToast("Matériel supprimé avec succès ✓", "success");
      await loadMateriel();
    } catch (error) {
      console.error("Erreur suppression matériel:", error);
      const message = error.response?.data?.message || error.message || "Erreur lors de la suppression du matériel";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getDepotLabel = (id) => {
    const found = depot.find((d) => String(d.id_depot) === String(id));
    if (!found) return id || "—";
    const address = found.adresse || found.adress || "";
    return `${found.nom}${address ? ` — ${address}` : ""}`;
  };

  // Filtrer matériels
  const filteredMateriels = materiels.filter((m) =>
    Object.values(m)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div className="materiel-container">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      <motion.h1 className="page-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        📦 Gestion des Matériels
      </motion.h1>

      <motion.button
        className="btn btn-success btn-add mb-3"
        onClick={() => {
          setShowForm(!showForm);
          setEditMode(false);
          setForm({
            marque: "",
            modele: "",
            numero_serie: "",
            date_achat: "",
            etat: "",
            id_depot: "",
          });
          setErrors({});
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showForm ? "✕ Fermer" : "➕ Ajouter Matériel"}
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.form
            className="form-container"
            onSubmit={editMode ? updateMateriel : addMateriel}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2>{editMode ? "✏️ Modifier un matériel" : "➕ Ajouter un matériel"}</h2>

            <div className="form-group">
              <label>Marque *</label>
              <input
                type="text"
                name="marque"
                placeholder="Ex: Dell, HP, Canon..."
                value={form.marque}
                className={`form-control ${errors.marque ? "is-invalid" : ""}`}
                onChange={handleChange}
              />
              {errors.marque && <span className="error-message">{errors.marque}</span>}
            </div>

            <div className="form-group">
              <label>Modèle *</label>
              <input
                type="text"
                name="modele"
                placeholder="Ex: XPS 13, ProBook 450..."
                value={form.modele}
                className={`form-control ${errors.modele ? "is-invalid" : ""}`}
                onChange={handleChange}
              />
              {errors.modele && <span className="error-message">{errors.modele}</span>}
            </div>

            <div className="form-group">
              <label>Numéro de série *</label>
              <input
                type="text"
                name="numero_serie"
                placeholder="Ex: SN123456789..."
                value={form.numero_serie}
                className={`form-control ${errors.numero_serie ? "is-invalid" : ""}`}
                onChange={handleChange}
              />
              {errors.numero_serie && <span className="error-message">{errors.numero_serie}</span>}
            </div>

            <div className="form-group">
              <label>Date d'achat *</label>
              <input
                type="date"
                name="date_achat"
                value={form.date_achat}
                className={`form-control ${errors.date_achat ? "is-invalid" : ""}`}
                onChange={handleChange}
              />
              {errors.date_achat && <span className="error-message">{errors.date_achat}</span>}
            </div>

            <div className="form-group">
              <label>État *</label>
              <select
                name="etat"
                className={`form-control ${errors.etat ? "is-invalid" : ""}`}
                value={form.etat}
                onChange={handleChange}
              >
                <option value="">-- Choisir état --</option>
                <option value="neuf">🆕 Neuf</option>
                <option value="bon">✅ Bon</option>
                <option value="a_reparer">🔧 À réparer</option>
                <option value="hors_service">❌ Hors service</option>
              </select>
              {errors.etat && <span className="error-message">{errors.etat}</span>}
            </div>

            <div className="form-group">
              <label>Dépôt *</label>
              <select
                name="id_depot"
                className={`form-control ${errors.id_depot ? "is-invalid" : ""}`}
                value={form.id_depot}
                onChange={handleChange}
              >
                <option value="">-- Choisir un dépôt --</option>
                {depot.map((d) => (
                  <option key={d.id_depot} value={d.id_depot}>
                    {d.nom} - {d.adress}
                  </option>
                ))}
              </select>
              {errors.id_depot && <span className="error-message">{errors.id_depot}</span>}
            </div>

            <div className="form-actions">
              <motion.button
                type="submit"
                className="btn btn-success"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "⏳ Traitement..." : editMode ? "✏️ Modifier" : "💾 Enregistrer"}
              </motion.button>
              <motion.button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditMode(false);
                  setErrors({});
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Annuler
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.hr className="my-4" />

      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        📋 Liste des Matériels
      </motion.h2>

      <motion.input
        type="text"
        placeholder="🔍 Filtrer tous les champs..."
        className="form-control mb-3 search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && (
        <motion.div className="loading-spinner" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} />
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Numéro série</th>
              <th>État</th>
              <th>Date achat</th>
              <th>Dépôt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMateriels.length > 0 ? (
              filteredMateriels.map((m, index) => (
                <motion.tr
                  key={m.id_materiel}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(102, 126, 234, 0.1)" }}
                >
                  <td>{m.id_materiel}</td>
                  <td>{m.marque}</td>
                  <td>{m.modele}</td>
                  <td className="serial-number">{m.numero_serie}</td>
                  <td>
                    <span className={`badge badge-${m.etat}`}>
                      {m.etat === "neuf" && "🆕"}
                      {m.etat === "bon" && "✅"}
                      {m.etat === "a_reparer" && "🔧"}
                      {m.etat === "hors_service" && "❌"} {m.etat}
                    </span>
                  </td>
                  <td>{new Date(m.date_achat).toLocaleDateString("fr-FR")}</td>
                  <td>{getDepotLabel(m.id_depot)}</td>
                  <td>
                    <div className="action-buttons">
                      <motion.button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(m)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✏️ Modifier
                      </motion.button>
                      <motion.button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteMateriel(m.id_materiel, m.marque)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🗑️ Supprimer
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  Aucun matériel trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredMateriels.length > 0 && (
        <motion.p className="results-count" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          📊 Total: {filteredMateriels.length} matériel(s)
        </motion.p>
      )}
    </motion.div>
  );
}
