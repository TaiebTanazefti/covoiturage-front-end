import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Car, MapPin, Calendar } from "lucide-react";
import * as api from "../../lib/api";

export function TripsAdminPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrajets().then((data) => setTrips(Array.isArray(data) ? data : [])).catch(() => setTrips([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Trajets</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble des trajets</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : trips.length === 0 ? (
        <Card className="p-12 text-center">
          <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun trajet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {trips.map((t) => {
            const dt = t.dateEtHeure ? new Date(t.dateEtHeure) : null;
            const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
            const timeStr = dt ? dt.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : "";
            return (
              <Card key={t.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{t.pointDeDepart}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-destructive" />
                      <span className="font-medium">{t.pointDarrivee}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{dateStr} {timeStr}</span>
                      <span>{t.nombreDePlacesDisponibles} places</span>
                    </div>
                  </div>
                  <Badge className={t.statut === "ACTIF" ? "bg-success" : "bg-muted"}>{t.statut}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
