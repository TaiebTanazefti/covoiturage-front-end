import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  Plus,
  Clock,
  CheckCircle,
  History,
} from "lucide-react";
import * as api from "../../lib/api";

export function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMesTrajets()
      .then((data) => setTrips(Array.isArray(data) ? data : []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const active = trips.filter((t) => t.statut === "ACTIF");
  const cancelled = trips.filter((t) => t.statut === "ANNULE");
  const terminated = trips.filter((t) => t.statut === "TERMINE");

  const handleTerminer = async (e, tripId) => {
    e.stopPropagation();
    if (!window.confirm("Confirmer la fin de ce trajet ?")) return;
    try {
      await api.terminerTrajet(tripId);
      const data = await api.getMesTrajets();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };

  const renderTripCard = (trip) => {
    const dt = trip.dateEtHeure ? new Date(trip.dateEtHeure) : null;
    const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
    const timeStr = dt
      ? dt.toLocaleTimeString("fr-CA", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <Card
        key={trip.id}
        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/app/conducteur/trajet/${trip.id}`)}
      >
        {/* 🔥 HEADER AVEC BOUTON MODIFIER */}
        <div className="flex items-start justify-between mb-3">
          <Badge
            className={
              trip.statut === "ACTIF"
                ? "bg-success"
                : trip.statut === "TERMINE"
                ? "bg-blue-600"
                : "bg-muted"
            }
          >
            {trip.statut === "ACTIF" ? "Actif" : trip.statut === "TERMINE" ? "Terminé" : "Annulé"}
          </Badge>

          {trip.statut === "ACTIF" && (
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/app/conducteur/modifier/${trip.id}`);
                }}
              >
                Modifier
              </button>
              <button
                type="button"
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                onClick={(e) => handleTerminer(e, trip.id)}
              >
                Terminer
              </button>
            </div>
          )}
        </div>

        {/* 🔥 CONTENU */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5" />
            <p className="text-sm font-medium">{trip.pointDeDepart}</p>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-destructive mt-0.5" />
            <p className="text-sm font-medium">{trip.pointDarrivee}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timeStr}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <Users className="w-4 h-4" />
              <span>{trip.nombreDePlacesDisponibles} places</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Mes trajets conducteur
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez vos trajets et demandes
            </p>
          </div>

          <Button onClick={() => navigate("/app/conducteur/creer")}>
            <Plus className="w-4 h-4 mr-2" />
            Créer
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="active">
              Actifs ({active.length})
            </TabsTrigger>
            <TabsTrigger value="terminated">Terminés ({terminated.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Annulés</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <p>Chargement...</p>
            ) : active.length > 0 ? (
              active.map(renderTripCard)
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="mb-4">Aucun trajet actif</p>
                <Button onClick={() => navigate("/app/conducteur/creer")}>
                  Créer un trajet
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="terminated" className="space-y-4">
            {terminated.length > 0 ? (
              terminated.map(renderTripCard)
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <p>Aucun trajet terminé</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelled.length > 0 ? (
              cancelled.map(renderTripCard)
            ) : (
              <Card className="p-12 text-center">
                <History className="w-12 h-12 mx-auto mb-4" />
                <p>Aucun trajet annulé</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}