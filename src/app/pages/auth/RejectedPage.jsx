import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function RejectedPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Raison du rejet (simulée)
  const rejectionReason =
    "La photo de votre pièce d'identité n'est pas suffisamment claire. Veuillez soumettre une nouvelle photo de meilleure qualité.";

  const handleResubmit = () => {
    if (!message) {
      toast.error("Veuillez ajouter un message si nécessaire");
      return;
    }

    toast.success("Demande envoyée !");
    navigate("/auth/upload-id");
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-destructive">
            Validation refusée
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Votre demande de certification n'a pas été approuvée
          </p>
        </div>

        {/* Rejection reason */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-2">
                Raison du refus
              </p>
              <p className="text-sm text-muted-foreground">{rejectionReason}</p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-primary-lighter border border-primary/20 rounded-lg p-4 mb-6">
          <p className="font-medium text-foreground mb-3">
            Que faire maintenant ?
          </p>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Vérifiez que votre pièce d'identité est valide et lisible</li>
            <li>Prenez une photo claire et bien éclairée</li>
            <li>Soumettez à nouveau votre document</li>
          </ol>
        </div>

        {/* Optional message */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="message">
            Message pour l'administrateur (optionnel)
          </Label>
          <Textarea
            id="message"
            placeholder="Si vous avez des questions ou des précisions à apporter..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Button onClick={handleResubmit} className="w-full" size="lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            Soumettre un nouveau document
          </Button>

          <Button
            onClick={() => navigate("/app")}
            variant="outline"
            className="w-full"
          >
            Revenir au profil
          </Button>
        </div>
      </Card>

      {/* Support */}
      <Card className="p-6">
        <p className="text-sm font-medium text-foreground mb-2">
          Besoin d'assistance ?
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Si vous pensez qu'il s'agit d'une erreur, contactez le support.
        </p>
        <Button variant="ghost" className="w-full">
          Contacter le support
        </Button>
      </Card>
    </div>
  );
}
