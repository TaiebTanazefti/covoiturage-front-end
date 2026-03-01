import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Star,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import * as api from "../lib/api";

export function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getTrajet(id).then(setTrip).catch(() => setTrip(null)).finally(() => setLoading(false));
  }, [id]);

  const handleRequest = async () => {
    if (!trip) return;
    setSubmitting(true);
    try {
      await api.createReservation(trip.id);
      setIsDialogOpen(false);
      toast.success("Demande de réservation envoyée !");
      navigate("/app/reservations");
    } catch (err) {
      toast.error(err.body?.message || err.message || "Erreur");
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
  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Trajet introuvable</p>
        <Button onClick={() => navigate("/app")}>Retour</Button>
      </div>
    );
  }

  const driver = trip.conducteur || {};
  const driverName = `${driver.prenom || ""} ${driver.nom || ""}`.trim() || "Conducteur";
  const rating = driver.nbreDeNotes > 0 ? (driver.note / driver.nbreDeNotes).toFixed(1) : "-";
  const dt = trip.dateEtHeure ? new Date(trip.dateEtHeure) : null;
  const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
  const timeStr = dt ? dt.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : "";
  const canBook = trip.statut === "ACTIF" && trip.nombreDePlacesDisponibles > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Détail du trajet</h1>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-white text-xl">
                {driverName.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{driverName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span>{rating}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-success">Certifié</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Itinéraire</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <div className="w-0.5 h-16 bg-border"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{trip.pointDeDepart}</p>
                <p className="text-sm font-medium text-primary mt-1">{timeStr}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-destructive mt-1"></div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{trip.pointDarrivee}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {trip.nombreDePlacesDisponibles} place{trip.nombreDePlacesDisponibles > 1 ? "s" : ""} disponible{trip.nombreDePlacesDisponibles > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {canBook && (
        <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Places restantes</p>
                <p className="text-2xl font-bold text-primary">{trip.nombreDePlacesDisponibles}</p>
              </div>
              <Badge className="bg-success text-lg px-4 py-2">Gratuit</Badge>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="w-full h-12">
              Demander une réservation
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demande de réservation</DialogTitle>
            <DialogDescription>
              Confirmez votre demande de réservation pour ce trajet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                placeholder="Bonjour, je souhaite réserver une place..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleRequest} disabled={submitting}>Envoyer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
