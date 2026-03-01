import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Clock, Shield, CheckCircle, AlertCircle } from "lucide-react";

export function PendingCertificationPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Clock className="w-10 h-10 text-warning" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">
            En attente de validation
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Votre compte est en cours de vérification
          </p>
        </div>

        {/* Status cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Email vérifié</p>
              <p className="text-sm text-muted-foreground">
                Votre email institutionnel a été vérifié
              </p>
            </div>
          </div>

          <div className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">
                Profil complété
              </p>
              <p className="text-sm text-muted-foreground">
                Vos informations personnelles sont enregistrées
              </p>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">
                Validation d'identité en cours
              </p>
              <p className="text-sm text-muted-foreground">
                Un administrateur vérifie votre pièce d'identité
              </p>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-primary-lighter border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-2">
                Accès limité pendant la validation
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Vous ne pouvez pas rechercher de trajets</li>
                <li>• Vous ne pouvez pas créer de trajets</li>
                <li>• Vous pouvez consulter votre profil</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            Délai de validation habituel
          </p>
          <p className="text-2xl font-bold text-primary">24 à 48 heures</p>
        </div>

        <Button
          onClick={() => navigate("/app")}
          variant="outline"
          className="w-full"
        >
          Accéder à mon profil
        </Button>
      </Card>

      {/* Support */}
      <Card className="p-6">
        <p className="text-sm font-medium text-foreground mb-2">
          Besoin d'aide ?
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Si vous avez des questions sur votre validation, contactez le support.
        </p>
        <Button variant="ghost" className="w-full">
          Contacter le support
        </Button>
      </Card>
    </div>
  );
}
