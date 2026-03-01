import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { MapPin, Calendar, Users, Star, ArrowLeft, Filter } from "lucide-react";
import * as api from "../lib/api";

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("time");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverMap, setDriverMap] = useState({});

  const departure = searchParams.get("depart") || "";
  const arrival = searchParams.get("arrivee") || "";
  const dateParam = searchParams.get("date") || "";

  useEffect(() => {
    setLoading(true);
    const dateOnly = dateParam ? dateParam.slice(0, 10) : undefined;
    api.getTrajets({
      pointDeDepart: departure || undefined,
      pointDarrivee: arrival || undefined,
      date: dateOnly,
    }).then((data) => {
      setTrips(Array.isArray(data) ? data : []);
      return data;
    }).then((data) => {
      const list = Array.isArray(data) ? data : [];
      const ids = [...new Set(list.map((t) => t.utilisateur_id))];
      return Promise.all(ids.map((id) => api.getUser(id).catch(() => null))).then((users) => {
        const map = {};
        ids.forEach((id, i) => { map[id] = users[i]; });
        setDriverMap(map);
      });
    }).catch(() => setTrips([])).finally(() => setLoading(false));
  }, [departure, arrival, dateParam]);

  const displayTrips = [...trips].sort((a, b) => {
    if (sortBy === "time") return new Date(a.dateEtHeure) - new Date(b.dateEtHeure);
    if (sortBy === "rating") return (driverMap[b.utilisateur_id]?.note ?? 0) - (driverMap[a.utilisateur_id]?.note ?? 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/app")}
            className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Résultats</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Chargement..." : `${trips.length} trajet${trips.length !== 1 ? "s" : ""} trouvé${trips.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Search summary */}
        <Card className="p-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{departure}</span>
            </div>
            <div className="w-8 h-0.5 bg-border"></div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-destructive" />
              <span className="font-medium">{arrival}</span>
            </div>
          </div>
        </Card>

        {/* Filters and sorting */}
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Heure de départ</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Note du conducteur</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Results list */}
        <div className="space-y-4">
          {displayTrips.filter((t) => t.statut === "ACTIF").map((trip) => {
            const driver = driverMap[trip.utilisateur_id];
            const driverName = driver ? `${driver.prenom || ""} ${driver.nom || ""}`.trim() || "Conducteur" : "Conducteur";
            const rating = driver?.note != null && driver?.nbreDeNotes > 0 ? (driver.note / driver.nbreDeNotes).toFixed(1) : "-";
            const dt = trip.dateEtHeure ? new Date(trip.dateEtHeure) : null;
            const dateStr = dt ? dt.toLocaleDateString("fr-CA") : "";
            const timeStr = dt ? dt.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : "";
            return (
              <Card
                key={trip.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/app/trajet/${trip.id}`)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {driverName.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{driverName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        <span>{rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-success">Certifié</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-8 bg-border"></div>
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{trip.pointDeDepart}</p>
                        <p className="text-xs text-muted-foreground">{dateStr} à {timeStr}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{trip.pointDarrivee}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {trip.nombreDePlacesDisponibles} place{trip.nombreDePlacesDisponibles > 1 ? "s" : ""} restante{trip.nombreDePlacesDisponibles > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* No results message */}
        {!loading && trips.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun trajet trouvé
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={() => navigate("/app")}>Nouvelle recherche</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
