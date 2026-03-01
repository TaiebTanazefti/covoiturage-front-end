import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { AdminLayout } from "../layouts/AdminLayout";

export function RequireAdmin() {
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
  if (user.role !== "ADMIN") {
    return <Navigate to="/app" replace />;
  }
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
