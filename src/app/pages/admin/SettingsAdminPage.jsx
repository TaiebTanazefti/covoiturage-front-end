import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import { Settings, Shield, Bell, Database, Lock } from "lucide-react";
import { toast } from "sonner";

export function SettingsAdminPage() {
  const handleSaveSettings = () => {
    toast.success("Paramètres enregistrés", {
      description: "Les modifications ont été appliquées avec succès.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Paramètres & Sécurité
        </h1>
        <p className="text-muted-foreground">
          Configurer les paramètres de la plateforme
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Paramètres généraux
                </h2>
                <p className="text-sm text-muted-foreground">
                  Configuration de base de la plateforme
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Nom de la plateforme</Label>
                <Input id="platform-name" defaultValue="Covoiturage La Cité" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">
                  Email administrateur principal
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@collegelacite.ca"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inscription ouverte</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux nouveaux utilisateurs de s'inscrire
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Certification automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Certifier automatiquement les emails @collegelacite.ca
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Annuler les modifications</Button>
            <Button onClick={handleSaveSettings}>
              Enregistrer les paramètres
            </Button>
          </div>
        </div>

        {/* Sidebar - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Security Info */}
          <Card className="p-6 bg-warning/10 border-warning/30">
            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  Sécurité des données
                </h3>
                <p className="text-sm text-muted-foreground">
                  Les données sensibles (pièces d'identité) sont chiffrées et
                  accessibles uniquement aux administrateurs autorisés.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
