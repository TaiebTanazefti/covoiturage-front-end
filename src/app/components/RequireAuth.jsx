import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { RootLayout } from "./layouts/RootLayout";

export function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth/connexion" replace />;
  }
  if (user.valide !== 1) {
    return <Navigate to="/auth/en-attente" replace />;
  }
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
