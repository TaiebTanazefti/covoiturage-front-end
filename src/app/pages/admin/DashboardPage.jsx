import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Users,
  ShieldCheck,
  Car,
  Calendar,
  AlertTriangle,
  Star,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router";
import * as api from "../../lib/api";

const iconByKey = { Car };

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getAdminStats()
      .then(setStats)
      .catch((e) => setError(e?.body?.message || e?.message || "Erreur"))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = stats
    ? [
        {
          id: "total_users",
          label: "Utilisateurs totaux",
          value: String(stats.totalUsers ?? 0),
          icon: Users,
          iconColor: "bg-blue-100 text-blue-600",
        },
        {
          id: "certified_users",
          label: "Utilisateurs certifiés",
          value: String(stats.certifiedUsers ?? 0),
          icon: ShieldCheck,
          iconColor: "bg-success/20 text-success",
        },
        {
          id: "trips",
          label: "Trajets (30j)",
          value: String(stats.tripsLast30Days ?? 0),
          icon: Car,
          iconColor: "bg-primary/20 text-primary",
        },
        {
          id: "bookings",
          label: "Réservations",
          value: String(stats.reservationsTotal ?? 0),
          icon: Calendar,
          iconColor: "bg-purple-100 text-purple-600",
        },
        {
          id: "pending_reports",
          label: "Signalements en attente",
          value: String(stats.pendingReports ?? 0),
          icon: AlertTriangle,
          iconColor: "bg-warning/20 text-warning",
        },
        {
          id: "avg_rating",
          label: "Note moyenne",
          value:
            stats.avgRating != null ? String(stats.avgRating) : "—",
          icon: Star,
          iconColor: "bg-amber-100 text-amber-600",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Chargement du tableau de bord…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const tripsWeeklyData = stats?.tripsPerWeek ?? [];
  const bookingsStatusData = stats?.reservationsByStatus ?? [];
  const recentActivities = stats?.recentActivities ?? [];
  const pendingValidations = stats?.pendingValidations ?? 0;
  const pendingReports = stats?.pendingReports ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de la plateforme Covoiturage La Cité
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${kpi.iconColor} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">
                {kpi.value}
              </h3>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trips Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Trajets par semaine
            </h2>
            <p className="text-sm text-muted-foreground">
              Trajets des 6 dernières semaines
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={tripsWeeklyData.length ? tripsWeeklyData : [{ week: "—", trajets: 0 }]}>
              <defs>
                <linearGradient id="colorTrajets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10A85C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10A85C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="week"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="trajets"
                stroke="#10A85C"
                strokeWidth={2}
                fill="url(#colorTrajets)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Bookings Status Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Réservations par statut
            </h2>
            <p className="text-sm text-muted-foreground">
              Répartition actuelle des réservations
            </p>
          </div>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={bookingsStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {bookingsStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {bookingsStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-foreground flex-1">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Actions rapides + Activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Actions rapides
          </h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/admin/validations")}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Validations en attente
              </span>
              {pendingValidations > 0 && (
                <Badge variant="destructive">{pendingValidations}</Badge>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/admin/moderation")}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Signalements
              </span>
              {pendingReports > 0 && (
                <Badge variant="destructive">{pendingReports}</Badge>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/utilisateurs")}
            >
              <Users className="w-4 h-4 mr-2" />
              Rechercher un utilisateur
            </Button>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Dernières activités
            </h2>
            <Button variant="ghost" size="sm">
              Tout voir
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
            ) : (
              recentActivities.map((activity) => {
                const Icon = iconByKey[activity.iconKey] || Car;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
