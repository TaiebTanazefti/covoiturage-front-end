import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { MapPin, Calendar, Users, ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";
import * as api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ratingSent, setRatingSent] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);

  useEffect(() => {
    api.getReservation(id).then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, [id]);

  const isDriver = data?.trajet && user?.id === data.trajet.utilisateur_id;
  const isPassenger = data && user?.id === data.utilisateur_id;
  const canAcceptRefuse = isDriver && data?.statut === "EN_ATTENTE";
  const canCancel = isPassenger && (data?.statut === "EN_ATTENTE" || data?.statut === "ACCEPTEE");
  const tripDate = data?.trajet?.dateEtHeure ? new Date(data.trajet.dateEtHeure) : null;
  const tripPast = tripDate && tripDate < new Date();
  const canRate = data?.statut === "ACCEPTEE" && tripPast && !ratingSent;
  const rateTargetId = canRate && isPassenger ? data?.trajet?.utilisateur_id : canRate && isDriver ? data?.utilisateur_id : null;

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await api.acceptReservation(id);
      toast.success("Réservation acceptée");
      setData((d) => (d ? { ...d, statut: "ACCEPTEE" } : null));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefuse = async () => {
    setSubmitting(true);
    try {
      await api.refuseReservation(id);
      toast.success("Réservation refusée");
      setData((d) => (d ? { ...d, statut: "REFUSEE" } : null));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setSubmitting(true);
    try {
      await api.cancelReservation(id);
      toast.success("Réservation annulée");
      setData((d) => (d ? { ...d, statut: "ANNULEE" } : null));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRate = async () => {
    if (!rateTargetId || ratingValue < 1 || ratingValue > 5) return;
    setSubmitting(true);
    try {
      await api.noteUser(rateTargetId, ratingValue);
      toast.success("Merci pour votre évaluation");
      setRatingSent(true);
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Réservation introuvable</p>
        <Button onClick={() => navigate("/app/reservations")}>Mes réservations</Button>
      </div>
    );
  }

  const trip = data.trajet || {};
  const driver = data.conducteur || {};
  const passenger = data.passager || {};
  const driverName = `${driver.prenom || ""} ${driver.nom || ""}`.trim() || "—";
  const passengerName = `${passenger.prenom || ""} ${passenger.nom || ""}`.trim() || "—";
  const dt = trip.dateEtHeure ? new Date(trip.dateEtHeure) : null;
  const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
  const timeStr = dt ? dt.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : "";

  const statusBadge = () => {
    switch (data.statut) {
      case "EN_ATTENTE":
        return <Badge className="bg-warning/10 text-warning">En attente</Badge>;
      case "ACCEPTEE":
        return <Badge className="bg-success">Acceptée</Badge>;
      case "REFUSEE":
        return <Badge variant="destructive">Refusée</Badge>;
      case "ANNULEE":
        return <Badge variant="secondary">Annulée</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/app/reservations")}
            className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Détail de la réservation</h1>
            {statusBadge()}
          </div>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Trajet</h3>
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
              <span className="flex items-center gap-1">{timeStr}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{trip.nombreDePlacesDisponibles} places</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Conducteur</h3>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">{driverName.slice(0, 2) || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{driverName}</p>
              {driver.courriel && <p className="text-sm text-muted-foreground">{driver.courriel}</p>}
            </div>
          </div>
        </Card>

        {isDriver && (
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Passager</h3>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-muted">{passengerName.slice(0, 2) || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{passengerName}</p>
                {passenger.courriel && <p className="text-sm text-muted-foreground">{passenger.courriel}</p>}
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-col gap-2">
          {canAcceptRefuse && (
            <>
              <Button onClick={handleAccept} disabled={submitting}>Accepter</Button>
              <Button variant="destructive" onClick={handleRefuse} disabled={submitting}>Refuser</Button>
            </>
          )}
          {canCancel && (
            <Button variant="outline" onClick={handleCancel} disabled={submitting}>Annuler ma réservation</Button>
          )}
          {canRate && rateTargetId && (
            <Card className="p-4">
              <p className="text-sm font-medium mb-2">{isPassenger ? "Noter le conducteur" : "Noter le passager"}</p>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRatingValue(n)}
                    className="p-1 rounded hover:bg-muted"
                  >
                    <Star className={`w-8 h-8 ${ratingValue >= n ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <Button onClick={handleRate} disabled={submitting || ratingValue < 1}>Envoyer la note</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
