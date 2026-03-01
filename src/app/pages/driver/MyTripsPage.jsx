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
    api.getMesTrajets().then((data) => setTrips(Array.isArray(data) ? data : [])).catch(() => setTrips([])).finally(() => setLoading(false));
  }, []);

  const active = trips.filter((t) => t.statut === "ACTIF");
  const cancelled = trips.filter((t) => t.statut === "ANNULE");

  const renderTripCard = (trip) => {
    const dt = trip.dateEtHeure ? new Date(trip.dateEtHeure) : null;
    const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
    const timeStr = dt ? dt.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : "";
    return (
      <Card
        key={trip.id}
        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/app/conducteur/trajet/${trip.id}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <Badge className={trip.statut === "ACTIF" ? "bg-success" : "bg-muted"}>
            {trip.statut === "ACTIF" ? "Actif" : "Annulé"}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-foreground">{trip.pointDeDepart}</p>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-foreground">{trip.pointDarrivee}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
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
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{trip.nombreDePlacesDisponibles} places</span>
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
            <h1 className="text-2xl font-bold text-foreground mb-2">
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
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="active" className="relative">
              Actifs
              {active.length > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-success">
                  {active.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cancelled">Annulés</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : active.length > 0 ? (
              active.map(renderTripCard)
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Aucun trajet actif</p>
                <Button onClick={() => navigate("/app/conducteur/creer")}>
                  Créer un trajet
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelled.length > 0 ? cancelled.map(renderTripCard) : (
              <Card className="p-12 text-center">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun trajet annulé</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
