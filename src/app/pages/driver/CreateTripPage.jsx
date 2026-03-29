import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card } from "../../components/ui/card";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Plus,
  Minus,
  Wifi,
  Music,
  Wind,
  Smartphone,
  Dog,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import * as api from "../../lib/api";

// ============================================================
// Composant AddressAutocomplete
// Utilise l'API Nominatim (OpenStreetMap) - gratuit, sans clé
// ============================================================
/**
 * @component AddressAutocomplete
 * @description Champ d'adresse avec suggestions automatiques comme Google Maps.
 *              Utilise l'API Nominatim (OpenStreetMap), gratuit et sans clé API.
 * @param {string} id - Identifiant HTML du champ
 * @param {string} label - Étiquette affichée au-dessus du champ
 * @param {string} placeholder - Texte indicatif dans le champ
 * @param {string} value - Valeur actuelle du champ
 * @param {function} onChange - Fonction appelée lors d'un changement de valeur
 * @param {string} iconColor - Classe CSS de couleur pour l'icône MapPin
 * @param {string} error - Message d'erreur à afficher sous le champ
 * @param {boolean} disabled - Si true, désactive le champ
 */
function AddressAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  iconColor = "text-primary",
  error,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Synchronise avec la valeur externe (mode édition)
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Ferme les suggestions si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * @function fetchSuggestions
   * @description Interroge l'API Nominatim pour obtenir des suggestions d'adresses canadiennes
   * @param {string} query - Texte saisi par l'utilisateur
   */
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=5&countrycodes=ca`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "fr" },
      });
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
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
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (suggestion) => {
    const address = suggestion.display_name;
    setInputValue(address);
    onChange(address);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <Label htmlFor={id}>
          {label} <span className="text-destructive">*</span>
        </Label>
      )}
      <div className="relative">
        {isLoading ? (
          <Loader2 className="absolute left-3 top-3 w-5 h-5 animate-spin text-muted-foreground" />
        ) : (
          <MapPin className={`absolute left-3 top-3 w-5 h-5 ${iconColor}`} />
        )}
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className={`pl-10 ${error ? "border-destructive" : ""}`}
          disabled={disabled}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                onMouseDown={() => handleSelect(s)}
                className="flex items-start gap-2 px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-0"
              >
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground leading-snug">
                  {s.display_name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
}

// ============================================================
// Options d'équipements disponibles dans le trajet
// ============================================================
const amenityOptions = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "music", label: "Musique", icon: Music },
  { id: "ac", label: "Climatisation", icon: Wind },
  { id: "charger", label: "Chargeur", icon: Smartphone },
  { id: "pets", label: "Animaux acceptés", icon: Dog },
  { id: "electric", label: "Voiture électrique", icon: Zap },
];

// ============================================================
// Page principale : Créer ou Modifier un trajet
// ============================================================
/**
 * @component CreateTripPage
 * @description Page de création et de modification d'un trajet de covoiturage.
 *              En mode création : affiche un formulaire vide.
 *              En mode modification : charge les données existantes via l'API.
 */
export function CreateTripPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(isEditMode);

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [errors, setErrors] = useState({});

  // Charge les données du trajet existant en mode modification
  useEffect(() => {
    if (!isEditMode) return;
    api.getTrajet(id)
      .then((trip) => {
        setDeparture(trip.pointDeDepart || "");
        setArrival(trip.pointDarrivee || "");
        if (trip.dateEtHeure) {
          const dt = new Date(trip.dateEtHeure);
          setDate(dt.toISOString().split("T")[0]);
          setTime(dt.toTimeString().slice(0, 5));
        }
        setSeats(trip.nombreDePlacesDisponibles || 1);
        setNotes(trip.notes || "");
        setSelectedAmenities(trip.amenities || []);
      })
      .catch(() => {
        toast.error("Impossible de charger le trajet");
        navigate("/app/conducteur/mes-trajets");
      })
      .finally(() => setLoadingTrip(false));
  }, [id]);

  /**
   * @function validateForm
   * @description Valide les champs obligatoires du formulaire
   * @returns {boolean} true si le formulaire est valide
   */
  const validateForm = () => {
    const newErrors = {};
    if (!departure.trim()) newErrors.departure = "Le point de départ est requis";
    if (!arrival.trim()) newErrors.arrival = "La destination est requise";
    if (!date) newErrors.date = "La date est requise";
    if (!time) newErrors.time = "L'heure est requise";
    if (date && time) {
      const selectedDateTime = new Date(`${date}T${time}`);
      if (selectedDateTime < new Date()) {
        newErrors.date = "La date et l'heure doivent être dans le futur";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSeatsChange = (increment) => {
    if (increment && seats < 6) setSeats(seats + 1);
    else if (!increment && seats > 1) setSeats(seats - 1);
  };

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((a) => a !== amenityId)
        : [...prev, amenityId]
    );
  };

  /**
   * @function handleSubmit
   * @description Soumet le formulaire pour créer ou modifier un trajet
   * @param {Event} e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }
    setIsLoading(true);
    const dateEtHeure = `${date}T${time}`;
    const payload = {
      pointDeDepart: departure.trim(),
      pointDarrivee: arrival.trim(),
      dateEtHeure,
      nombreDePlacesDisponibles: seats,
    };
    try {
      if (isEditMode) {
        await api.updateTrajet(id, payload);
        toast.success("Trajet modifié avec succès !");
        navigate(`/app/conducteur/trajet/${id}`);
      } else {
        await api.createTrajet(payload);
        toast.success("Trajet publié avec succès !");
        navigate("/app/conducteur/mes-trajets");
      }
    } catch (err) {
      toast.error(err.body?.message || err.message || "Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);
  const isFormValid = departure && arrival && date && time;

  if (loadingTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement du trajet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleCancel}
            className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditMode ? "Modifier le trajet" : "Créer un trajet"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditMode
                ? "Modifiez les informations de votre trajet"
                : "Proposez votre trajet à la communauté"}
            </p>
          </div>
        </div>

        {/* Avis de certification */}
        <Card className="p-4 mb-6 bg-success/10 border-success/30">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Statut vérifié</p>
              <p className="text-muted-foreground">
                Seuls les utilisateurs certifiés peuvent proposer un trajet.
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1 : Informations du trajet */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Informations du trajet
            </h2>
            <div className="space-y-5">

              {/* Point de départ avec autocomplete */}
              <AddressAutocomplete
                id="departure"
                label="Point de départ"
                placeholder="Ex: Collège La Cité, 801 Aviation Pkwy"
                value={departure}
                onChange={(val) => {
                  setDeparture(val);
                  if (errors.departure) setErrors((prev) => ({ ...prev, departure: "" }));
                }}
                iconColor="text-primary"
                error={errors.departure}
                disabled={isLoading}
              />

              {/* Destination avec autocomplete */}
              <AddressAutocomplete
                id="arrival"
                label="Destination"
                placeholder="Ex: Centre-ville Ottawa, Rideau Centre"
                value={arrival}
                onChange={(val) => {
                  setArrival(val);
                  if (errors.arrival) setErrors((prev) => ({ ...prev, arrival: "" }));
                }}
                iconColor="text-destructive"
                error={errors.arrival}
                disabled={isLoading}
              />

              {/* Date et Heure */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
                      }}
                      className={`pl-10 ${errors.date ? "border-destructive" : ""}`}
                      disabled={isLoading}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.date}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">
                    Heure <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                        if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                      }}
                      className={`pl-10 ${errors.time ? "border-destructive" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.time && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* Nombre de places */}
              <div className="space-y-2">
                <Label>
                  Nombre de places disponibles <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleSeatsChange(false)}
                    disabled={seats <= 1 || isLoading}
                    className="h-12 w-12"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary-lighter rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">{seats}</span>
                    <span className="text-sm text-muted-foreground">place{seats > 1 ? "s" : ""}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleSeatsChange(true)}
                    disabled={seats >= 6 || isLoading}
                    className="h-12 w-12"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Minimum 1 place, maximum 6 places</p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Commentaires (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ex: Point de rencontre précis, consignes particulières..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  disabled={isLoading}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">{notes.length}/500 caractères</p>
              </div>
            </div>
          </Card>

          {/* Section 2 : Options */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">Options et préférences</h2>
            <p className="text-sm text-muted-foreground mb-4">Indiquez les équipements disponibles</p>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.id);
                const Icon = amenity.icon;
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-foreground border-border hover:border-primary hover:bg-primary-lighter"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{amenity.label}</span>
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Section 3 : Règles */}
          <Card className="p-6 bg-warning/10 border-warning/30">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Règles importantes</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Annuler un trajet annulera toutes les réservations associées</li>
                  <li>Les passagers concernés seront notifiés automatiquement</li>
                  <li>Vous êtes responsable de la sécurité de vos passagers</li>
                  <li>Respectez les horaires et points de rencontre convenus</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Boutons d'action */}
          <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-border p-4 shadow-lg">
            <div className="container mx-auto space-y-3">
              <Button type="submit" className="w-full h-12" disabled={!isFormValid || isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isEditMode ? "Modification en cours..." : "Publication en cours..."}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {isEditMode ? "Enregistrer les modifications" : "Publier le trajet"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleCancel} disabled={isLoading}>
                Annuler
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}