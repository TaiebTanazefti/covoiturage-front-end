import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { ArrowLeft, Car, AlertCircle, Upload, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import * as api from "../../lib/api";

export function SignupPage() {
  const navigate = useNavigate();
  const { register, refreshMe } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@collegeLaCité.ca") && !email.endsWith("@collegelacite.ca")) {
      toast.error("Veuillez utiliser votre email institutionnel La Cité");
      return;
    }

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!prenom || !nom || !telephone) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setSubmitting(true);
    try {
      await register(
        {
          courriel: email,
          password,
          nom,
          prenom,
          role: "PASSAGER",
          telephone: String(telephone).replace(/\D/g, "") || "0",
        },
        { autoLogin: true }
      );
      await refreshMe();

      if (idFile) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result;
            resolve(typeof dataUrl === "string" ? dataUrl.replace(/^data:image\/\w+;base64,/, "") : "");
          };
          reader.onerror = reject;
          reader.readAsDataURL(idFile);
        });
        await api.submitPieceIdentite(base64);
        toast.success("Compte créé. Votre pièce d'identité a été envoyée pour validation.");
        navigate("/auth/en-attente");
      } else {
        toast.success("Compte créé. Envoyez votre pièce d'identité pour être validé.");
        navigate("/auth/upload-id");
      }
    } catch (err) {
      if (err.status === 409) {
        toast.error("Courriel déjà utilisé");
      } else {
        toast.error(err.body?.message || err.message || "Erreur lors de l'inscription");
      }
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
          <h1 className="text-2xl font-bold text-center mb-2">Inscription</h1>
          <p className="text-sm text-muted-foreground text-center">
            Créez votre compte Covoiturage La Cité
          </p>
        </div>

        <div className="bg-info/10 border border-info/30 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm text-info-foreground">
            Vous devez utiliser votre email institutionnel La Cité pour vous
            inscrire
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              type="text"
              placeholder="Votre prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              type="text"
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(613) 555-0123"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </div>
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
            <p className="text-xs text-muted-foreground">
              Utilisez votre adresse email La Cité
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Retapez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Pièce d&apos;identité</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Carte d&apos;étudiant, permis de conduire ou carte d&apos;identité (requise pour la validation par l&apos;administrateur)
            </p>
            <label className="block">
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {idFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="w-10 h-10 text-primary" />
                    <p className="font-medium text-foreground">{idFile.name}</p>
                    <p className="text-xs text-muted-foreground">Cliquez pour changer</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <p className="font-medium text-foreground">Cliquez pour sélectionner un fichier</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            Créer mon compte
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link to="/auth/connexion" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
