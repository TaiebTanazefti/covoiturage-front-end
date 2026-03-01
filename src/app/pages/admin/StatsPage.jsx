import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, Car, Calendar, TrendingUp } from "lucide-react";
import * as api from "../../lib/api";

export function StatsPage() {
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUtilisateurs().then((d) => (Array.isArray(d) ? d : [])),
      api.getTrajets().then((d) => (Array.isArray(d) ? d : [])),
      api.getReservations().then((d) => (Array.isArray(d) ? d : [])),
    ]).then(([u, t, r]) => {
      setUsers(u);
      setTrips(t);
      setReservations(r);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalUsers = users.length;
  const totalTrips = trips.length;
  const totalReservations = reservations.length;
  const acceptedReservations = reservations.filter((r) => r.statut === "ACCEPTEE").length;
  const reservationRate = totalReservations > 0 ? Math.round((acceptedReservations / totalReservations) * 100) : 0;
  const validatedUsers = users.filter((u) => u.valide === 1).length;

  const summaryData = [
    { name: "Utilisateurs", value: totalUsers },
    { name: "Trajets", value: totalTrips },
    { name: "Réservations", value: totalReservations },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Statistiques & Rapports
          </h1>
          <p className="text-muted-foreground">
            Analyses et tendances de la plateforme
          </p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 derniers jours</SelectItem>
            <SelectItem value="30days">30 derniers jours</SelectItem>
            <SelectItem value="90days">90 derniers jours</SelectItem>
            <SelectItem value="12months">12 derniers mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs</p>
                  <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trajets</p>
                  <p className="text-2xl font-bold text-foreground">{totalTrips}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Réservations acceptées</p>
                  <p className="text-2xl font-bold text-foreground">{acceptedReservations}/{totalReservations}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 text-success rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs certifiés</p>
                  <p className="text-2xl font-bold text-foreground">{validatedUsers}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Résumé</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10A85C" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Taux d&apos;acceptation</h2>
              <p className="text-3xl font-bold text-foreground">{reservationRate}%</p>
              <p className="text-sm text-muted-foreground">Réservations acceptées / total</p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
