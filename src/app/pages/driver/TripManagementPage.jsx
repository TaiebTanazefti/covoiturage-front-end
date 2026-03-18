import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import * as api from "../../lib/api";

export function TripManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getTrajet(id).then(setTrip).catch(() => setTrip(null));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    api.getTrajetReservations(id).then((data) => setReservations(Array.isArray(data) ? data : [])).catch(() => setReservations([]));
  }, [id]);

  useEffect(() => {
    if (!trip) setLoading(false);
    else setLoading(false);
  }, [trip]);

  const handleCancelTrip = async () => {
    if (!confirm("Annuler ce trajet ? Les réservations associées seront annulées.")) return;
    setSubmitting(true);
    try {
      await api.cancelTrajet(id);
      toast.success("Trajet annulé");
      setTrip((t) => (t ? { ...t, statut: "ANNULE" } : null));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (reservationId) => {
    setSubmitting(true);
    try {
      await api.acceptReservation(reservationId);
      toast.success("Réservation acceptée");
      setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, statut: "ACCEPTEE" } : r)));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefuse = async (reservationId) => {
    setSubmitting(true);
    try {
      await api.refuseReservation(reservationId);
      toast.success("Réservation refusée");
      setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, statut: "REFUSEE" } : r)));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{loading ? "Chargement..." : "Trajet introuvable"}</p>
        {!loading && !trip && <Button className="ml-4" onClick={() => navigate("/app/conducteur/mes-trajets")}>Mes trajets</Button>}
      </div>
    );
  }

  const dt = trip.dateEtHeure ? new Date(trip.dateEtHeure) : null;
  const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
  const timeStr = dt ? dt.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : "";
  const pending = reservations.filter((r) => r.statut === "EN_ATTENTE");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/app/conducteur/mes-trajets")}
            className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Gestion du trajet</h1>
            <Badge className={trip.statut === "ACTIF" ? "bg-success" : "bg-muted"}>
              {trip.statut === "ACTIF" ? "Actif" : "Annulé"}
            </Badge>
          </div>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Itinéraire</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{trip.pointDeDepart}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-destructive" />
              <span>{trip.pointDarrivee}</span>
            </div>
            <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{dateStr}</span>
              <span>{timeStr}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{trip.nombreDePlacesDisponibles} places</span>
            </div>
          </div>
        </Card>

        {trip.statut === "ACTIF" && (
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Demandes en attente</h3>
            {pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune demande en attente</p>
            ) : (
              <div className="space-y-3">
                {pending.map((r) => {
                  const p = r.passager || {};
                  const name = `${p.prenom || ""} ${p.nom || ""}`.trim() || "Passager";
                  return (
                    <div key={r.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-muted">{name.slice(0, 2) || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{name}</p>
                          {p.courriel && <p className="text-xs text-muted-foreground">{p.courriel}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAccept(r.id)} disabled={submitting}>Accepter</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRefuse(r.id)} disabled={submitting}>Refuser</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {trip.statut === "ACTIF" && (
  <>
    <Button
      variant="destructive"
      onClick={handleCancelTrip}
      disabled={submitting}
    >
      Annuler ce trajet
    </Button>

    <Button
      type="button"
      className="bg-blue-600 text-white mt-4"
      onClick={() => navigate(`/app/conducteur/modifier/${trip.id}`)}
    >
      Modifier le trajet
    </Button>
  </>
)}
      </div>
    </div>
  );
}
