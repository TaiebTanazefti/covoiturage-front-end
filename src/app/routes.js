import { createElement } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { RequireAuth } from "./components/RequireAuth";
import { RequireAdmin } from "./components/RequireAdmin";

// Auth pages
import { SplashPage } from "./pages/auth/SplashPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { CompleteProfilePage } from "./pages/auth/CompleteProfilePage";
import { UploadIdPage } from "./pages/auth/UploadIdPage";
import { PendingCertificationPage } from "./pages/auth/PendingCertificationPage";
import { CertifiedPage } from "./pages/auth/CertifiedPage";
import { RejectedPage } from "./pages/auth/RejectedPage";

// Main app pages
import { HomePage } from "./pages/HomePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { BookingsPage } from "./pages/BookingsPage";
import { BookingDetailPage } from "./pages/BookingDetailPage";

// Driver pages
import { MyTripsPage } from "./pages/driver/MyTripsPage";
import { CreateTripPage } from "./pages/driver/CreateTripPage";
import { TripManagementPage } from "./pages/driver/TripManagementPage";

// User pages
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

// Admin pages
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ValidationsPage } from "./pages/admin/ValidationsPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { TripsAdminPage } from "./pages/admin/TripsAdminPage";
import { BookingsAdminPage } from "./pages/admin/BookingsAdminPage";
import { ModerationPage } from "./pages/admin/ModerationPage";
import { StatsPage } from "./pages/admin/StatsPage";
import { SettingsAdminPage } from "./pages/admin/SettingsAdminPage";

// 404
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashPage,
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "connexion", Component: LoginPage },
      { path: "inscription", Component: SignupPage },
      { path: "profil", Component: CompleteProfilePage },
      { path: "upload-id", Component: UploadIdPage },
      { path: "en-attente", Component: PendingCertificationPage },
      { path: "certifie", Component: CertifiedPage },
      { path: "rejete", Component: RejectedPage },
    ],
  },
  {
    path: "/app",
    Component: RequireAuth,
    children: [
      { index: true, Component: HomePage },
      { path: "recherche", Component: SearchResultsPage },
      { path: "trajet/:id", Component: TripDetailPage },
      { path: "reservations", Component: BookingsPage },
      { path: "reservation/:id", Component: BookingDetailPage },
      { path: "conducteur/mes-trajets", Component: MyTripsPage },
      { path: "conducteur/creer", Component: CreateTripPage },
      { path: "conducteur/trajet/:id", Component: TripManagementPage },
      { path: "conducteur/modifier/:id", Component: CreateTripPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "profil", Component: ProfilePage },
      { path: "parametres", Component: SettingsPage },
    ],
  },
  {
    path: "/admin",
    Component: RequireAdmin,
    children: [
      { index: true, element: createElement(Navigate, { to: "/admin/dashboard", replace: true }) },
      { path: "dashboard", Component: DashboardPage },
      { path: "validations", Component: ValidationsPage },
      { path: "utilisateurs", Component: UsersPage },
      { path: "trajets", Component: TripsAdminPage },
      { path: "reservations", Component: BookingsAdminPage },
      { path: "moderation", Component: ModerationPage },
      { path: "statistiques", Component: StatsPage },
      { path: "parametres", Component: SettingsAdminPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
