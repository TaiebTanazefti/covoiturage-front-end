import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import * as api from "../../lib/api";

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    api.getUtilisateurs().then((data) => setUsers(Array.isArray(data) ? data : [])).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  const handleDesactiver = async (id) => {
    setSubmitting(id);
    try {
      await api.desactiverUser(id);
      toast.success("Compte désactivé");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, actif: 0 } : u)));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(null);
    }
  };

  const handleReactiver = async (id) => {
    setSubmitting(id);
    try {
      await api.reactiverUser(id);
      toast.success("Compte réactivé");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, actif: 1 } : u)));
    } catch (err) {
      toast.error(err.body?.message || "Erreur");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground">Gérer les comptes</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : users.length === 0 ? (
        <Card className="p-12 text-center">
          <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun utilisateur</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{u.prenom} {u.nom}</p>
                <p className="text-sm text-muted-foreground">{u.courriel}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">{u.role}</Badge>
                  {u.valide === 1 ? <Badge className="bg-success">Validé</Badge> : <Badge variant="outline">Non validé</Badge>}
                  {u.actif === 1 ? <Badge variant="outline">Actif</Badge> : <Badge variant="destructive">Désactivé</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                {u.actif === 1 ? (
                  <Button variant="destructive" size="sm" onClick={() => handleDesactiver(u.id)} disabled={submitting === u.id}>Désactiver</Button>
                ) : (
                  <Button size="sm" onClick={() => handleReactiver(u.id)} disabled={submitting === u.id}>Réactiver</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
