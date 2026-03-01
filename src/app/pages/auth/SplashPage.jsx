import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Car, Shield, Users, Check } from "lucide-react";

export function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-lighter to-white flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-lg">
          <Car className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-center text-primary mb-3">
          Covoiturage La Cité
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-md">
          Partagez vos trajets en toute sécurité avec la communauté du Collège
          La Cité
        </p>

        {/* Features */}
        <div className="w-full max-w-md space-y-4 mb-12">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-lighter rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Sécurité garantie
              </h3>
              <p className="text-sm text-muted-foreground">
                Membres certifiés uniquement avec validation d'identité
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-lighter rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Communauté exclusive
              </h3>
              <p className="text-sm text-muted-foreground">
                Réservé aux membres de La Cité avec email institutionnel
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-lighter rounded-xl flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                100% gratuit
              </h3>
              <p className="text-sm text-muted-foreground">
                Aucun frais, partagez simplement vos trajets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          onClick={() => navigate("/auth/inscription")}
          className="w-full h-14 text-lg"
        >
          Commencer
        </Button>
        <Button
          onClick={() => navigate("/auth/connexion")}
          variant="outline"
          className="w-full h-14 text-lg"
        >
          J'ai déjà un compte
        </Button>
      </div>
    </div>
  );
}
