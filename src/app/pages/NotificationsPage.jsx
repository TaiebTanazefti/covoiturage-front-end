import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Bell, Calendar, Clock, CheckCircle, XCircle, Clock3 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

export function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role === "CONDUCTEUR") {
      // ✅ Conducteur : charger ses trajets puis les demandes EN_ATTENTE
      api.getMesTrajets()
        .then(async (trajets) => {
          const list = Array.isArray(trajets) ? trajets.filter(t => t.statut === "ACTIF") : [];
          const allItems = [];
          await Promise.all(list.map(async (trajet) => {
            try {
              const reservations = await api.getTrajetReservations(trajet.id);
              if (Array.isArray(reservations)) {
                reservations.forEach(r => {
                  allItems.push({ ...r, trajet });
                });
              }
            } catch {
              // ignore
            }
          }));
          // Trier EN_ATTENTE en premier
          allItems.sort((a, b) => {
            const order = { EN_ATTENTE: 0, ACCEPTEE: 1, REFUSEE: 2, ANNULEE: 3 };
            return (order[a.statut] ?? 9) - (order[b.statut] ?? 9);
          });
          setItems(allItems);
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else {
      // ✅ Passager : charger ses réservations avec les infos du trajet
      api.getMesReservations()
        .then(async (data) => {
          const list = Array.isArray(data) ? data : [];
          const withTrip = await Promise.all(list.map(async (r) => {
            try {
              const trajet = await api.getTrajet(r.trajet_id);
              return { ...r, trajet };
            } catch {
              return r;
            }
          }));
          withTrip.sort((a, b) => {
            const order = { EN_ATTENTE: 0, ACCEPTEE: 1, REFUSEE: 2, ANNULEE: 3 };
            return (order[a.statut] ?? 9) - (order[b.statut] ?? 9);
          });
          setItems(withTrip);
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const getStatusIcon = (statut) => {
    if (statut === "ACCEPTEE") return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (statut === "REFUSEE") return <XCircle className="w-5 h-5 text-destructive" />;
    return <Clock3 className="w-5 h-5 text-warning" />;
  };

  const getStatusLabel = (statut) => {
    if (statut === "ACCEPTEE") return { label: "Acceptée", color: "bg-success" };
    if (statut === "REFUSEE") return { label: "Refusée", color: "bg-destructive" };
    if (statut === "ANNULEE") return { label: "Annulée", color: "bg-muted" };
    return { label: "En attente", color: "bg-warning" };
  };

  const getMessage = (item) => {
    const trajet = item.trajet || {};
    const depart = trajet.pointDeDepart || "?";
    const arrivee = trajet.pointDarrivee || "?";

    if (user.role === "CONDUCTEUR") {
      const passager = item.passager || {};
      const name = `${passager.prenom || ""} ${passager.nom || ""}`.trim() || "Un passager";
      if (item.statut === "EN_ATTENTE") return `${name} demande une place : ${depart} → ${arrivee}`;
      if (item.statut === "ACCEPTEE") return `Vous avez accepté ${name} pour ${depart} → ${arrivee}`;
      if (item.statut === "REFUSEE") return `Vous avez refusé ${name} pour ${depart} → ${arrivee}`;
      return `Réservation de ${name}`;
    } else {
      const conducteur = trajet.conducteur || {};
      const name = `${conducteur.prenom || ""} ${conducteur.nom || ""}`.trim() || "Le conducteur";
      if (item.statut === "EN_ATTENTE") return `Votre demande pour ${depart} → ${arrivee} est en attente`;
      if (item.statut === "ACCEPTEE") return `${name} a accepté votre réservation pour ${depart} → ${arrivee} ✅`;
      if (item.statut === "REFUSEE") return `${name} a refusé votre réservation pour ${depart} → ${arrivee}`;
      return "Notification de réservation";
    }
  };

  const getPersonName = (item) => {
    if (user.role === "CONDUCTEUR") {
      const p = item.passager || {};
      return `${p.prenom || ""} ${p.nom || ""}`.trim() || "?";
    } else {
      const c = item.trajet?.conducteur || {};
      return `${c.prenom || ""} ${c.nom || ""}`.trim() || "?";
    }
  };

  const handleClick = (item) => {
    if (user.role === "CONDUCTEUR") {
      navigate(`/app/conducteur/trajet/${item.trajet?.id || item.trajet_id}`);
    } else {
      navigate(`/app/reservation/${item.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-12">Chargement...</p>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Aucune notification pour l'instant</p>
          </Card>
        ) : (
          items.map((item, index) => {
            const { label, color } = getStatusLabel(item.statut);
            const trajet = item.trajet || {};
            const dt = trajet.dateEtHeure ? new Date(trajet.dateEtHeure) : null;
            const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
            const timeStr = dt ? dt.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : "";
            const personName = getPersonName(item);

            return (
              <Card
                key={item.id ?? index}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleClick(item)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {personName.slice(0, 2).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{personName}</p>
                      <Badge className={`${color} text-white text-xs`}>{label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{getMessage(item)}</p>
                    {trajet.pointDeDepart && (
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{dateStr}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeStr}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getStatusIcon(item.statut)}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
