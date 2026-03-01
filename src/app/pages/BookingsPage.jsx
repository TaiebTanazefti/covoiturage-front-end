import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
} from "lucide-react";
import * as api from "../lib/api";

export function BookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [reservations, setReservations] = useState([]);
  const [tripMap, setTripMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMesReservations().then((list) => {
      const arr = list || [];
      setReservations(arr);
      const ids = [...new Set(arr.map((r) => r.trajet_id))];
      return Promise.all(ids.map((id) => api.getTrajet(id).catch(() => null))).then((trips) => {
        const map = {};
        ids.forEach((id, i) => { map[id] = trips[i]; });
        setTripMap(map);
      });
    }).catch(() => setReservations([])).finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "EN_ATTENTE":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            En attente
          </Badge>
        );
      case "ACCEPTEE":
        return <Badge className="bg-success">Acceptée</Badge>;
      case "REFUSEE":
        return <Badge variant="destructive">Refusée</Badge>;
      case "ANNULEE":
        return (
          <Badge variant="secondary" className="bg-muted">
            Annulée
          </Badge>
        );
      default:
        return null;
    }
  };

  const pending = reservations.filter((r) => r.statut === "EN_ATTENTE");
  const accepted = reservations.filter((r) => r.statut === "ACCEPTEE");
  const refused = reservations.filter((r) => r.statut === "REFUSEE");
  const cancelled = reservations.filter((r) => r.statut === "ANNULEE");
  const history = []; // completed: would need trip date in past

  const renderBookingCard = (booking) => {
    const trip = tripMap[booking.trajet_id];
    const driverName = trip?.conducteur ? `${trip.conducteur.prenom || ""} ${trip.conducteur.nom || ""}`.trim() : "—";
    const dt = trip?.dateEtHeure ? new Date(trip.dateEtHeure) : null;
    const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
    const timeStr = dt ? dt.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : "";
    return (
    <Card
      key={booking.id}
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/app/reservation/${booking.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-white">
              {driverName.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{driverName}</p>
            <p className="text-xs text-muted-foreground">Conducteur</p>
          </div>
        </div>
        {getStatusBadge(booking.statut)}
      </div>

      <div className="space-y-2">
        {trip && (
          <>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-foreground">{trip.pointDeDepart}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-foreground">{trip.pointDarrivee}</p>
            </div>
          </>
        )}
        <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Mes réservations
          </h1>
          <p className="text-sm text-muted-foreground">
            Gérez vos demandes et trajets réservés
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="pending" className="relative">
              En attente
              {pending.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted">Acceptées</TabsTrigger>
            <TabsTrigger value="refused">Refusées</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : pending.length > 0 ? (
              pending.map(renderBookingCard)
            ) : (
              <Card className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune demande en attente</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {accepted.length > 0 ? accepted.map(renderBookingCard) : (
              <Card className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune réservation acceptée</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="refused" className="space-y-4">
            {refused.length > 0 ? refused.map(renderBookingCard) : (
              <Card className="p-12 text-center">
                <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune réservation refusée</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelled.length > 0 ? cancelled.map(renderBookingCard) : (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune réservation annulée</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.length > 0 ? history.map(renderBookingCard) : (
              <Card className="p-12 text-center">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun trajet terminé</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
