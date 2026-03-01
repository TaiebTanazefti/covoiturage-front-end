import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Car,
  Calendar,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

const menuItems = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "validations",
    label: "Validations identités",
    icon: ShieldCheck,
    path: "/admin/validations",
    badgeKey: "validations",
  },
  {
    id: "users",
    label: "Utilisateurs",
    icon: Users,
    path: "/admin/utilisateurs",
  },
  {
    id: "trips",
    label: "Trajets",
    icon: Car,
    path: "/admin/trajets",
  },
  {
    id: "bookings",
    label: "Réservations",
    icon: Calendar,
    path: "/admin/reservations",
  },
  {
    id: "moderation",
    label: "Modération",
    icon: AlertTriangle,
    path: "/admin/moderation",
    badge: 3,
  },
  {
    id: "stats",
    label: "Statistiques",
    icon: BarChart3,
    path: "/admin/statistiques",
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    path: "/admin/parametres",
  },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    api.getUtilisateurs().then((data) => {
      const list = Array.isArray(data) ? data : [];
      setPendingCount(list.filter((u) => u.valide === 0 && u.role !== "ADMIN").length);
    }).catch(() => {});
  }, [location.pathname]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getBadge = (item) => {
    if (item.badgeKey === "validations" && pendingCount > 0) return pendingCount;
    return item.badge || 0;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-border flex flex-col transition-all duration-300 fixed left-0 top-0 h-screen z-40`}
      >
        {/* Logo + App Name */}
        <div className="h-16 border-b border-border flex items-center px-4 justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-foreground text-sm">
                  Covoiturage La Cité
                </h1>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm font-medium">{item.label}</span>
                    {getBadge(item) > 0 && (
                      <Badge
                        variant={isActive ? "secondary" : "default"}
                        className="ml-auto"
                      >
                        {getBadge(item)}
                      </Badge>
                    )}
                  </>
                )}
                {sidebarCollapsed && getBadge(item) > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                    {getBadge(item)}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Déconnexion</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border flex items-center px-6 sticky top-0 z-30">
          <div className="flex-1 flex items-center gap-4">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un utilisateur, trajet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-lg hover:bg-accent flex items-center justify-center">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></div>
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.courriel}
                </p>
              </div>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-white">
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
