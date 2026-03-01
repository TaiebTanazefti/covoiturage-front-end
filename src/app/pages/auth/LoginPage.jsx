import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { ArrowLeft, Car } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success("Connexion réussie !");
      navigate(user?.role === "ADMIN" ? "/admin/dashboard" : "/app");
    } catch (err) {
      const msg = err.body?.message || err.message;
      toast.error(msg || "Identifiants invalides");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-primary hover:text-primary-dark"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </button>

      <Card className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Connexion</h1>
          <p className="text-sm text-muted-foreground text-center">
            Connectez-vous avec votre email La Cité
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email institutionnel</Label>
            <Input
              id="email"
              type="email"
              placeholder="prenom.nom@collegeLaCité.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            Se connecter
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              to="/auth/inscription"
              className="text-primary hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
