import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ShieldCheck, IdCard } from "lucide-react";
import { toast } from "sonner";
import * as api from "../../lib/api";

export function ValidationsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [piecesByUser, setPiecesByUser] = useState({});

  useEffect(() => {
    api.getUtilisateurs().then((data) => setUsers(Array.isArray(data) ? data : [])).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  const pending = users.filter((u) => u.valide === 0 && u.role !== "ADMIN");

  const pendingIds = pending.map((u) => u.id).sort((a, b) => a - b).join(",");
  useEffect(() => {
    if (!pendingIds) return;
    const ids = pendingIds.split(",").map(Number).filter(Boolean);
    ids.forEach((id) => {
      api
        .getPieceIdentiteByUser(id)
        .then((piece) => setPiecesByUser((prev) => ({ ...prev, [id]: piece })))
        .catch(() => setPiecesByUser((prev) => ({ ...prev, [id]: null })));
    });
  }, [pendingIds]);

  const handleValidate = async (id) => {
    setSubmitting(id);
    try {
      await api.validateUser(id);
      toast.success("Compte validé");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, valide: 1 } : u)));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Validations des comptes</h1>
        <p className="text-sm text-muted-foreground">
          Consultez la pièce d&apos;identité de chaque utilisateur en attente, puis validez son compte pour lui permettre d&apos;accéder aux trajets.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : pending.length === 0 ? (
        <Card className="p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun utilisateur en attente de validation</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {pending.map((u) => {
            const piece = piecesByUser[u.id];
            const hasImage = piece?.image_data;
            return (
              <Card key={u.id} className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{u.prenom} {u.nom}</p>
                    <p className="text-sm text-muted-foreground">{u.courriel}</p>
                    <Badge variant="secondary" className="mt-1">{u.role}</Badge>
                  </div>
                  <div className="w-full sm:w-48 flex-shrink-0">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Pièce d&apos;identité</p>
                    {piece === undefined ? (
                      <div className="aspect-[3/2] bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Chargement…</span>
                      </div>
                    ) : hasImage ? (
                      <img
                        src={`data:image/jpeg;base64,${piece.image_data}`}
                        alt="Pièce d'identité"
                        className="w-full aspect-[3/2] object-contain bg-muted rounded-lg border border-border"
                      />
                    ) : (
                      <div className="aspect-[3/2] bg-muted rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
                        <IdCard className="w-8 h-8" />
                        <span className="text-xs">Aucune pièce envoyée</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <Button onClick={() => handleValidate(u.id)} disabled={submitting === u.id}>
                      Valider le compte
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
