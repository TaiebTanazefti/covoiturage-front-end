import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Star,
  Settings,
  Shield,
  HelpCircle,
  FileText,
  Mail,
  Car,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshMe, logout } = useAuth();
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isDriverMode = user?.role === "CONDUCTEUR";
  const displayName = user
    ? `${user.prenom || ""} ${user.nom || ""}`.trim() || user.courriel
    : "";
  const rating =
    user?.nbreDeNotes > 0 ? (user.note / user.nbreDeNotes).toFixed(1) : "—";

  const handleDriverModeToggle = (checked) => {
    if (checked) {
      setShowDriverDialog(true);
    } else {
      setToggling(true);
      api
        .setModePassager()
        .then(() => refreshMe())
        .then(() => toast.success("Mode conducteur désactivé"))
        .catch(() => toast.error("Erreur"))
        .finally(() => setToggling(false));
    }
  };

  const confirmDriverMode = () => {
    setShowDriverDialog(false);
    setToggling(true);
    api
      .setModeConducteur()
      .then(() => refreshMe())
      .then(() => toast.success("Mode conducteur activé !"))
      .catch(() => toast.error("Erreur"))
      .finally(() => setToggling(false));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile header */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary text-white text-2xl">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {displayName || "Profil"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {user?.courriel}
                  </p>
                </div>
                {user?.valide === 1 ? (
                  <Badge className="bg-success">
                    <Shield className="w-3 h-3 mr-1" />
                    Certifié
                  </Badge>
                ) : (
                  <Badge variant="secondary">En attente</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-medium">{rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-lighter rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">—</p>
              <p className="text-xs text-muted-foreground">
                En tant que passager
              </p>
            </div>
            <div className="bg-primary-lighter rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">—</p>
              <p className="text-xs text-muted-foreground">
                En tant que conducteur
              </p>
            </div>
          </div>
        </Card>

        {/* Driver mode toggle */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-lighter rounded-xl flex items-center justify-center flex-shrink-0">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Mode conducteur
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Activez pour proposer vos trajets aux autres membres
              </p>

              <div className="flex items-center gap-3">
                <Switch
                  id="driver-mode"
                  checked={isDriverMode}
                  onCheckedChange={handleDriverModeToggle}
                />
                <Label htmlFor="driver-mode" className="font-normal">
                  {isDriverMode ? "Activé" : "Désactivé"}
                </Label>
              </div>

              {isDriverMode && (
                <div className="mt-4 flex items-center gap-2 text-sm text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span>Vous pouvez créer et gérer des trajets</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Contact info */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Informations personnelles
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{user?.courriel}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-foreground">
                {user?.telephone != null ? String(user.telephone) : "—"}
              </span>
            </div>
          </div>
        </Card>

        {/* Security info */}
        <Card className="p-6 bg-primary-lighter border-primary/20">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">
                Sécurité et confidentialité
              </p>
              <p className="text-muted-foreground">
                Vos pièces d'identité sont stockées de manière sécurisée et
                accessibles uniquement par les administrateurs.
              </p>
            </div>
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          Déconnexion
        </Button>
      </div>

      {/* Driver mode activation dialog */}
      <AlertDialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activer le mode conducteur</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>En activant le mode conducteur, vous pourrez :</p>
              <ul className="space-y-2 text-sm list-disc list-inside text-foreground">
                <li>Créer et publier vos trajets</li>
                <li>Gérer les demandes de réservation</li>
                <li>Modifier ou annuler vos trajets</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                Vous restez responsable du respect du code de la route et de la
                sécurité de vos passagers.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDriverMode}>
              Activer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
