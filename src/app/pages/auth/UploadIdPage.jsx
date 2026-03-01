import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Upload, CheckCircle, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import * as api from "../../lib/api";

export function UploadIdPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/auth/connexion", { replace: true });
  }, [user, loading, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !preview) {
      toast.error("Veuillez sélectionner une pièce d'identité");
      return;
    }
    setSubmitting(true);
    try {
      const base64 = preview.replace(/^data:image\/\w+;base64,/, "");
      await api.submitPieceIdentite(base64);
      toast.success("Pièce d'identité envoyée pour validation !");
      navigate("/auth/en-attente");
    } catch (err) {
      if (err.status === 401) navigate("/auth/connexion");
      else toast.error(err.body?.message || "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
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
        <div className="w-12 h-0.5 bg-success"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">Profil</span>
        </div>
        <div className="w-12 h-0.5 bg-primary"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm text-white font-medium">3</span>
          </div>
          <span className="text-sm font-medium text-primary">ID</span>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">
            Pièce d'identité
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Pour garantir la sécurité de tous
          </p>
        </div>

        {/* Security notice */}
        <div className="bg-primary-lighter border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">
                Confidentialité garantie
              </p>
              <p className="text-muted-foreground">
                Votre pièce d'identité est stockée de manière sécurisée et
                accessible uniquement par les administrateurs pour validation.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upload area */}
          {!file ? (
            <label className="block">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-lighter/50 transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium text-foreground mb-1">
                  Cliquez pour télécharger
                </p>
                <p className="text-sm text-muted-foreground">
                  Carte d'étudiant, permis de conduire ou carte d'identité
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-foreground">
                      Document téléchargé
                    </p>
                    <p className="text-sm text-muted-foreground">{file.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-primary hover:text-primary-dark"
                >
                  {showPreview ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Preview (blurred) */}
              {showPreview && preview && (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={preview}
                    alt="Aperçu"
                    className="w-full h-48 object-cover blur-sm"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-white/90 rounded-lg px-4 py-2">
                      <p className="text-sm font-medium">
                        Aperçu flouté pour confidentialité
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <span>Changer de document</span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full" disabled={!file || submitting}>
            Envoyer pour validation
          </Button>
        </div>
      </Card>
    </div>
  );
}
