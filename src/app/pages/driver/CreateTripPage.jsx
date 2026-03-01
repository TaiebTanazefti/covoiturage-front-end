import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
} from "lucide-react";
import { toast } from "sonner";
import * as api from "../../lib/api";

const amenityOptions = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "music", label: "Musique", icon: Music },
  { id: "ac", label: "Climatisation", icon: Wind },
  { id: "charger", label: "Chargeur", icon: Smartphone },
  { id: "pets", label: "Animaux acceptés", icon: Dog },
  { id: "electric", label: "Voiture électrique", icon: Zap },
];

export function CreateTripPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Validation errors
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!departure.trim()) {
      newErrors.departure = "Le point de départ est requis";
    }

    if (!arrival.trim()) {
      newErrors.arrival = "La destination est requise";
    }

    if (!date) {
      newErrors.date = "La date est requise";
    }

    if (!time) {
      newErrors.time = "L'heure est requise";
    }

    // Vérifier que la date n'est pas dans le passé
    if (date && time) {
      const selectedDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      if (selectedDateTime < now) {
        newErrors.date = "La date et l'heure doivent être dans le futur";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSeatsChange = (increment) => {
    if (increment && seats < 6) {
      setSeats(seats + 1);
    } else if (!increment && seats > 1) {
      setSeats(seats - 1);
    }
  };

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    setIsLoading(true);
    const dateEtHeure = `${date}T${time}`;

    try {
      await api.createTrajet({
        pointDeDepart: departure.trim(),
        pointDarrivee: arrival.trim(),
        dateEtHeure,
        nombreDePlacesDisponibles: seats,
      });
      toast.success("Trajet publié avec succès !");
      navigate("/app/conducteur/mes-trajets");
    } catch (err) {
      toast.error(err.body?.message || err.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isFormValid = departure && arrival && date && time;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* Header */}
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
              Créer un trajet
            </h1>
            <p className="text-sm text-muted-foreground">
              Proposez votre trajet à la communauté
            </p>
          </div>
        </div>

        {/* Certification notice */}
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
          {/* Section 1: Informations du trajet */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Informations du trajet
            </h2>

            <div className="space-y-5">
              {/* Départ */}
              <div className="space-y-2">
                <Label htmlFor="departure">
                  Point de départ <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-primary" />
                  <Input
                    id="departure"
                    type="text"
                    placeholder="Ex: Collège La Cité, 801 Aviation Pkwy"
                    value={departure}
                    onChange={(e) => {
                      setDeparture(e.target.value);
                      if (errors.departure) {
                        setErrors((prev) => ({ ...prev, departure: "" }));
                      }
                    }}
                    className={`pl-10 ${errors.departure ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.departure && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.departure}
                  </p>
                )}
              </div>

              {/* Arrivée */}
              <div className="space-y-2">
                <Label htmlFor="arrival">
                  Destination <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-destructive" />
                  <Input
                    id="arrival"
                    type="text"
                    placeholder="Ex: Centre-ville Ottawa, Rideau Centre"
                    value={arrival}
                    onChange={(e) => {
                      setArrival(e.target.value);
                      if (errors.arrival) {
                        setErrors((prev) => ({ ...prev, arrival: "" }));
                      }
                    }}
                    className={`pl-10 ${errors.arrival ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.arrival && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.arrival}
                  </p>
                )}
              </div>

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
                        if (errors.date) {
                          setErrors((prev) => ({ ...prev, date: "" }));
                        }
                      }}
                      className={`pl-10 ${errors.date ? "border-destructive" : ""}`}
                      disabled={isLoading}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.date}
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
                        if (errors.time) {
                          setErrors((prev) => ({ ...prev, time: "" }));
                        }
                      }}
                      className={`pl-10 ${errors.time ? "border-destructive" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.time && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* Nombre de places */}
              <div className="space-y-2">
                <Label htmlFor="seats">
                  Nombre de places disponibles{" "}
                  <span className="text-destructive">*</span>
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
                    <span className="text-2xl font-bold text-primary">
                      {seats}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      place{seats > 1 ? "s" : ""}
                    </span>
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
                <p className="text-xs text-muted-foreground">
                  Minimum 1 place, maximum 6 places
                </p>
              </div>

              {/* Notes / Commentaires */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Commentaires (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ex: Point de rencontre précis, consignes particulières, détours possibles..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  disabled={isLoading}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {notes.length}/500 caractères
                </p>
              </div>
            </div>
          </Card>

          {/* Section 2: Options et préférences */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Options et préférences
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Indiquez les équipements et services disponibles
            </p>

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

          {/* Section 3: Règles et validation */}
          <Card className="p-6 bg-warning/10 border-warning/30">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">
                    Règles importantes
                  </p>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>
                      Annuler un trajet annulera toutes les réservations
                      associées
                    </li>
                    <li>
                      Les passagers concernés seront notifiés automatiquement
                    </li>
                    <li>
                      Vous êtes responsable de la sécurité de vos passagers
                    </li>
                    <li>
                      Respectez les horaires et points de rencontre convenus
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-border p-4 shadow-lg">
            <div className="container mx-auto space-y-3">
              <Button
                type="submit"
                className="w-full h-12"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Publier le trajet
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Annuler
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
