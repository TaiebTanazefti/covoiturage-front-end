import { Outlet, Link, useLocation } from "react-router";
import { Home, Calendar, Bell, User, Car, ShieldCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function RootLayout() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const isDriverModeActive = user?.role === "CONDUCTEUR";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Covoiturage</h1>
              <p className="text-xs text-muted-foreground">Collège La Cité</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {user?.role === "ADMIN" && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20"
              >
                <ShieldCheck className="w-5 h-5" />
                Admin
              </Link>
            )}
            <Link to="/app/notifications" className="relative">
              <Bell className="w-6 h-6 text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/app"
              className={`flex flex-col items-center gap-1 ${
                isActive("/app") && location.pathname === "/app"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Accueil</span>
            </Link>

            <Link
              to="/app/reservations"
              className={`flex flex-col items-center gap-1 ${
                isActive("/app/reservations")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs">Réservations</span>
            </Link>

            {isDriverModeActive && (
              <Link
                to="/app/conducteur/mes-trajets"
                className={`flex flex-col items-center gap-1 ${
                  isActive("/app/conducteur")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Car className="w-6 h-6" />
                <span className="text-xs">Conducteur</span>
              </Link>
            )}

            <Link
              to="/app/profil"
              className={`flex flex-col items-center gap-1 ${
                isActive("/app/profil") || isActive("/app/parametres")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profil</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
