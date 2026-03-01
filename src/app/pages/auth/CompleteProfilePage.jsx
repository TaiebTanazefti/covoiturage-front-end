import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { User, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function CompleteProfilePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !phone) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    toast.success("Profil complété !");
    navigate("/auth/upload-id");
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">Compte</span>
        </div>
        <div className="w-12 h-0.5 bg-primary"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm text-white font-medium">2</span>
          </div>
          <span className="text-sm font-medium text-primary">Profil</span>
        </div>
        <div className="w-12 h-0.5 bg-border"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-medium">3</span>
          </div>
          <span className="text-sm text-muted-foreground">ID</span>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">
            Complétez votre profil
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Ces informations sont nécessaires pour votre sécurité
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(613) 555-0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Pour vous contacter en cas de besoin
            </p>
          </div>

          <Button type="submit" className="w-full">
            Continuer
          </Button>
        </form>
      </Card>
    </div>
  );
}
