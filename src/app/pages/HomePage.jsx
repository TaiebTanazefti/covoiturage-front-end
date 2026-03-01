import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("1");
  const [pendingRequests, setPendingRequests] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState(0);

  const isCertified = user?.valide === 1;
  const isDriverModeActive = user?.role === "CONDUCTEUR";

  useEffect(() => {
    if (!user) return;
    api.getMesReservations().then((reservations) => {
      const pending = reservations.filter((r) => r.statut === "EN_ATTENTE").length;
      const accepted = reservations.filter((r) => r.statut === "ACCEPTEE").length;
      setPendingRequests(pending);
      setUpcomingBookings(accepted);
    }).catch(() => {});
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/app/recherche?depart=${departure}&arrivee=${arrival}&date=${date}&places=${seats}`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header banner pour utilisateurs non certifiés */}
        {!isCertified && (
          <Card className="p-4 bg-warning/10 border-warning/30">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">
                  Compte en attente de certification
                </p>
                <p className="text-sm text-muted-foreground">
                  Vous pourrez rechercher des trajets une fois votre identité
                  validée.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Hero section with search */}
        <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white">
          <h2 className="text-2xl font-bold mb-2">Bienvenue !</h2>
          <p className="text-primary-lighter mb-6">
            Trouvez un trajet ou proposez le vôtre
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="departure" className="text-white">
                Point de départ
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="departure"
                  type="text"
                  placeholder="Ex: Collège La Cité"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="pl-10 bg-white"
                  required
                  disabled={!isCertified}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrival" className="text-white">
                Destination
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="arrival"
                  type="text"
                  placeholder="Ex: Centre-ville Ottawa"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="pl-10 bg-white"
                  required
                  disabled={!isCertified}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">
                  Date et heure
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10 bg-white"
                    required
                    disabled={!isCertified}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats" className="text-white">
                  Places
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    max="8"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="pl-10 bg-white"
                    required
                    disabled={!isCertified}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-primary hover:bg-white/90"
              size="lg"
              disabled={!isCertified}
            >
              Rechercher un trajet
            </Button>
          </form>
        </Card>

        {/* Quick actions for certified users */}
        {isCertified && (
          <>
            {/* Pending requests and upcoming bookings */}
            <div className="grid grid-cols-2 gap-4">
              <Card
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/app/reservations")}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  {pendingRequests > 0 && (
                    <Badge variant="destructive">{pendingRequests}</Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Demandes en attente
                </p>
                <p className="text-xs text-muted-foreground">
                  {pendingRequests === 0
                    ? "Aucune demande"
                    : `${pendingRequests} demande${pendingRequests > 1 ? "s" : ""}`}
                </p>
              </Card>

              <Card
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/app/reservations")}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  {upcomingBookings > 0 && (
                    <Badge className="bg-success">{upcomingBookings}</Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Réservations à venir
                </p>
                <p className="text-xs text-muted-foreground">
                  {upcomingBookings === 0
                    ? "Aucune réservation"
                    : `${upcomingBookings} réservation${upcomingBookings > 1 ? "s" : ""}`}
                </p>
              </Card>
            </div>

            {/* Driver mode CTA */}
            {isDriverModeActive && (
              <Card
                className="p-6 bg-primary-lighter border-primary/20 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/app/conducteur/creer")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Proposer un trajet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Vous conduisez ? Partagez votre trajet
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Tips section */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Conseils pour bien covoiturer
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-lighter rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Soyez ponctuel
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Respectez les horaires convenus
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-lighter rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Communiquez
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Prévenez en cas de retard ou changement
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-lighter rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Évaluez vos trajets
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Aidez à maintenir une communauté de confiance
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
