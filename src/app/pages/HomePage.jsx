import { useState, useEffect, useRef } from "react";
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
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

// ============================================================
// Composant AddressAutocomplete (Nominatim / OpenStreetMap)
// ============================================================
function AddressAutocomplete({ id, label, placeholder, value, onChange, disabled = false }) {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=ca`;
      const res = await fetch(url, { headers: { "Accept-Language": "fr" } });
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (err) {
      console.error("Erreur Nominatim:", err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const handleSelect = (suggestion) => {
    const address = suggestion.display_name;
    setInputValue(address);
    onChange(address);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2" ref={containerRef} style={{ position: "relative" }}>
      {label && (
        <Label htmlFor={id} className="text-white font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        {isLoading ? (
          <Loader2 className="absolute left-3 top-3 w-5 h-5 animate-spin text-gray-400 z-10" />
        ) : (
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
        )}
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="pl-10 bg-white text-gray-900"
          disabled={disabled}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              maxHeight: "240px",
              overflowY: "auto",
              marginTop: "4px",
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(s);
                }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f5f9",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                <MapPin style={{ width: "16px", height: "16px", color: "#94a3b8", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "14px", color: "#1e293b", lineHeight: "1.4" }}>
                  {s.display_name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Page d'accueil
// ============================================================
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
      `/app/recherche?depart=${departure}&arrivee=${arrival}&date=${date}&places=${seats}`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* Bannière compte non certifié */}
        {!isCertified && (
          <Card className="p-4 bg-warning/10 border-warning/30">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">
                  Compte en attente de certification
                </p>
                <p className="text-sm text-muted-foreground">
                  Vous pourrez rechercher des trajets une fois votre identité validée.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Hero section avec recherche */}
        <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white overflow-visible">
          <h2 className="text-2xl font-bold mb-2">Bienvenue !</h2>
          <p className="text-primary-lighter mb-6">
            Trouvez un trajet ou proposez le vôtre
          </p>

          <form onSubmit={handleSearch} className="space-y-4" style={{ overflow: "visible" }}>

            <AddressAutocomplete
              id="home-departure"
              label="Point de départ"
              placeholder="Ex: Collège La Cité"
              value={departure}
              onChange={setDeparture}
              disabled={!isCertified}
            />

            <AddressAutocomplete
              id="home-arrival"
              label="Destination"
              placeholder="Ex: Centre-ville Ottawa"
              value={arrival}
              onChange={setArrival}
              disabled={!isCertified}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Date et heure</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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
                <Label htmlFor="seats" className="text-white">Places</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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

        {/* Actions rapides pour utilisateurs certifiés */}
        {isCertified && (
          <>
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
                <p className="text-sm font-medium text-foreground mb-1">Demandes en attente</p>
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
                <p className="text-sm font-medium text-foreground mb-1">Réservations à venir</p>
                <p className="text-xs text-muted-foreground">
                  {upcomingBookings === 0
                    ? "Aucune réservation"
                    : `${upcomingBookings} réservation${upcomingBookings > 1 ? "s" : ""}`}
                </p>
              </Card>
            </div>

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
                    <h3 className="font-semibold text-foreground mb-1">Proposer un trajet</h3>
                    <p className="text-sm text-muted-foreground">
                      Vous conduisez ? Partagez votre trajet
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Conseils pour bien covoiturer</h3>
              <div className="space-y-3">
                {[
                  { title: "Soyez ponctuel", desc: "Respectez les horaires convenus" },
                  { title: "Communiquez", desc: "Prévenez en cas de retard ou changement" },
                  { title: "Évaluez vos trajets", desc: "Aidez à maintenir une communauté de confiance" },
                ].map((tip) => (
                  <div key={tip.title} className="flex gap-3">
                    <div className="w-8 h-8 bg-primary-lighter rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tip.title}</p>
                      <p className="text-xs text-muted-foreground">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}