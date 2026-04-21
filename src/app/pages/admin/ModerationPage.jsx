import { useState, useEffect } from "react";
import * as api from "../../lib/api";

export function ModerationPage() {
  const [onglet, setOnglet] = useState("utilisateurs");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [trajets, setTrajets] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    setLoading(true);
    try {
      const [u, t] = await Promise.all([api.getUtilisateurs(), api.getTrajets()]);
      setUtilisateurs(u || []);
      setTrajets(t || []);
    } catch (e) {
      afficherMessage("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  }

  function afficherMessage(texte, type = "success") {
    setMessage({ texte, type });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDesactiver(id) {
    if (!confirm("Désactiver cet utilisateur ?")) return;
    try {
      await api.desactiverUser(id);
      setUtilisateurs(prev =>
        prev.map(u => u.id === id ? { ...u, statut: "inactif" } : u)
      );
      afficherMessage("Utilisateur désactivé.");
    } catch {
      afficherMessage("Erreur lors de la désactivation.", "error");
    }
  }

  async function handleReactiver(id) {
    try {
      await api.reactiverUser(id);
      setUtilisateurs(prev =>
        prev.map(u => u.id === id ? { ...u, statut: "actif" } : u)
      );
      afficherMessage("Utilisateur réactivé.");
    } catch {
      afficherMessage("Erreur lors de la réactivation.", "error");
    }
  }

  async function handleAnnulerTrajet(id) {
    if (!confirm("Annuler ce trajet ?")) return;
    try {
      await api.cancelTrajet(id);
      setTrajets(prev =>
        prev.map(t => t.id === id ? { ...t, statut: "annule" } : t)
      );
      afficherMessage("Trajet annulé.");
    } catch {
      afficherMessage("Erreur lors de l'annulation.", "error");
    }
  }

  async function handleSupprimerTrajet(id) {
    if (!confirm("Supprimer ce trajet définitivement ?")) return;
    try {
      await api.deleteTrajet(id);
      setTrajets(prev => prev.filter(t => t.id !== id));
      afficherMessage("Trajet supprimé.");
    } catch {
      afficherMessage("Erreur lors de la suppression.", "error");
    }
  }

  const utilisateursFiltres = utilisateurs.filter(u =>
    `${u.prenom} ${u.nom} ${u.courriel}`.toLowerCase().includes(recherche.toLowerCase())
  );

  const trajetsFiltres = trajets.filter(t =>
    `${t.pointDeDepart} ${t.pointDarrivee}`.toLowerCase().includes(recherche.toLowerCase())
  );

  const styles = {
    page: { padding: "24px", fontFamily: "sans-serif" },
    titre: { fontSize: "24px", fontWeight: "bold", marginBottom: "4px" },
    sous: { color: "#666", marginBottom: "24px" },
    onglets: { display: "flex", gap: "8px", marginBottom: "20px" },
    onglet: (actif) => ({
      padding: "8px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: actif ? "bold" : "normal",
      background: actif ? "#16a34a" : "#f3f4f6",
      color: actif ? "white" : "#333",
    }),
    recherche: {
      width: "100%", padding: "10px 14px", borderRadius: "8px",
      border: "1px solid #ddd", marginBottom: "16px", fontSize: "14px",
    },
    table: { width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
    th: { padding: "12px 16px", textAlign: "left", background: "#f9fafb", fontSize: "13px", color: "#555", borderBottom: "1px solid #eee" },
    td: { padding: "12px 16px", borderBottom: "1px solid #f0f0f0", fontSize: "14px" },
    badge: (statut) => ({
      padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold",
      background: statut === "actif" ? "#dcfce7" : statut === "annule" ? "#fee2e2" : "#fef9c3",
      color: statut === "actif" ? "#16a34a" : statut === "annule" ? "#dc2626" : "#92400e",
    }),
    btnDanger: {
      padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
      background: "#fee2e2", color: "#dc2626", fontSize: "13px", marginRight: "6px",
    },
    btnSuccess: {
      padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
      background: "#dcfce7", color: "#16a34a", fontSize: "13px",
    },
    toast: (type) => ({
      position: "fixed", bottom: "24px", right: "24px",
      background: type === "error" ? "#dc2626" : "#16a34a",
      color: "white", padding: "12px 20px", borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 1000,
    }),
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.titre}>Modération</h1>
      <p style={styles.sous}>Gérez les utilisateurs et les contenus de la plateforme</p>

      <div style={styles.onglets}>
        <button style={styles.onglet(onglet === "utilisateurs")} onClick={() => setOnglet("utilisateurs")}>
          👥 Utilisateurs ({utilisateurs.length})
        </button>
        <button style={styles.onglet(onglet === "trajets")} onClick={() => setOnglet("trajets")}>
          🚗 Trajets ({trajets.length})
        </button>
      </div>

      <input
        style={styles.recherche}
        placeholder="Rechercher..."
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
      />

      {loading ? (
        <p style={{ color: "#999" }}>Chargement...</p>
      ) : onglet === "utilisateurs" ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Courriel</th>
              <th style={styles.th}>Rôle</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateursFiltres.map(u => (
              <tr key={u.id}>
                <td style={styles.td}>{u.prenom} {u.nom}</td>
                <td style={styles.td}>{u.courriel}</td>
                <td style={styles.td}>{u.role || "passager"}</td>
                <td style={styles.td}>
                  <span style={styles.badge(u.statut)}>{u.statut || "actif"}</span>
                </td>
                <td style={styles.td}>
                  {u.statut !== "inactif" ? (
                    <button style={styles.btnDanger} onClick={() => handleDesactiver(u.id)}>
                      Désactiver
                    </button>
                  ) : (
                    <button style={styles.btnSuccess} onClick={() => handleReactiver(u.id)}>
                      Réactiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Départ</th>
              <th style={styles.th}>Arrivée</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trajetsFiltres.map(t => (
              <tr key={t.id}>
                <td style={styles.td}>{t.pointDeDepart}</td>
                <td style={styles.td}>{t.pointDarrivee}</td>
                <td style={styles.td}>{t.date ? new Date(t.date).toLocaleDateString("fr-CA") : "—"}</td>
                <td style={styles.td}>
                  <span style={styles.badge(t.statut)}>{t.statut || "actif"}</span>
                </td>
                <td style={styles.td}>
                  {t.statut !== "annule" && (
                    <button style={styles.btnDanger} onClick={() => handleAnnulerTrajet(t.id)}>
                      Annuler
                    </button>
                  )}
                  <button style={styles.btnDanger} onClick={() => handleSupprimerTrajet(t.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <div style={styles.toast(message.type)}>{message.texte}</div>}
    </div>
  );
}

export default ModerationPage;