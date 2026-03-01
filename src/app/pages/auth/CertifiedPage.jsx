import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";

export function CertifiedPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="p-8 relative overflow-hidden">
        {/* Confetti effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 text-success/20 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute top-8 right-6 text-success/30 animate-bounce delay-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute bottom-12 left-8 text-success/20 animate-bounce delay-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="absolute bottom-8 right-4 text-success/30 animate-bounce delay-300">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="flex flex-col items-center mb-8 relative">
          <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mb-4 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-success">
            Félicitations !
          </h1>
          <p className="text-lg text-center text-muted-foreground">
            Votre compte est certifié
          </p>
        </div>

        <div className="bg-success/10 border border-success/30 rounded-lg p-6 mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Vous faites maintenant partie de
          </p>
          <p className="text-2xl font-bold text-success">Covoiturage La Cité</p>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-8">
          <h3 className="font-semibold text-foreground mb-3">
            Vous pouvez maintenant :
          </h3>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Rechercher et réserver des trajets avec d'autres membres certifiés
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Proposer vos propres trajets en activant le mode conducteur
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Évaluer et être évalué pour une communauté de confiance
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Accéder à l'historique de vos trajets et réservations
            </p>
          </div>
        </div>

        <Button onClick={() => navigate("/app")} className="w-full h-12">
          Commencer à covoiturer
        </Button>
      </Card>
    </div>
  );
}
