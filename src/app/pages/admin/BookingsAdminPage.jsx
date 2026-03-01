import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Calendar } from "lucide-react";
import * as api from "../../lib/api";

export function BookingsAdminPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReservations().then((data) => setReservations(Array.isArray(data) ? data : [])).catch(() => setReservations([])).finally(() => setLoading(false));
  }, []);

  const statusLabel = (s) => {
    switch (s) {
      case "EN_ATTENTE": return "En attente";
      case "ACCEPTEE": return "Acceptée";
      case "REFUSEE": return "Refusée";
      case "ANNULEE": return "Annulée";
      default: return s;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Réservations</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble des réservations</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : reservations.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune réservation</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <Card key={r.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Réservation #{r.id}</p>
                <p className="font-medium">Trajet #{r.trajet_id} — Utilisateur #{r.utilisateur_id}</p>
              </div>
              <Badge variant={r.statut === "ACCEPTEE" ? "default" : r.statut === "REFUSEE" || r.statut === "ANNULEE" ? "secondary" : "outline"}>
                {statusLabel(r.statut)}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
