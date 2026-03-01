# Guide d'accès au Dashboard Administrateur

## 🎯 Accès rapide

Pour accéder au Dashboard Administrateur de Covoiturage La Cité, naviguez vers :

```
/admin/dashboard
```

## 📍 Navigation complète

### URLs disponibles

| Page | URL | Description |
|------|-----|-------------|
| **Tableau de bord** | `/admin/dashboard` | Vue d'ensemble avec KPIs et graphiques |
| **Validations identités** | `/admin/validations` | Gérer les demandes de certification |
| **Utilisateurs** | `/admin/utilisateurs` | Liste et gestion des utilisateurs |
| **Trajets** | `/admin/trajets` | Tous les trajets de la plateforme |
| **Réservations** | `/admin/reservations` | Toutes les réservations |
| **Modération** | `/admin/moderation` | Évaluations et signalements |
| **Statistiques** | `/admin/statistiques` | Rapports et analyses |
| **Paramètres** | `/admin/parametres` | Configuration système |

## 🚀 Parcours utilisateur implémentés

### 1️⃣ Dashboard → Validations identités → Détail → Approuver/Rejeter

1. Accédez à `/admin/dashboard`
2. Cliquez sur "Voir validations en attente" dans les Actions rapides
3. Ou cliquez sur "Validations identités" dans la sidebar
4. Dans le tableau, cliquez sur "Voir dossier" pour un utilisateur
5. Affichez le document d'identité (masqué par défaut pour sécurité)
6. Approuvez ou rejetez la validation
7. Si rejet, indiquez la raison obligatoire

### 2️⃣ Dashboard → Modération → Masquer une évaluation

1. Accédez à `/admin/dashboard`
2. Cliquez sur "Signalements" dans les Actions rapides
3. Ou cliquez sur "Modération" dans la sidebar
4. Allez dans l'onglet "Évaluations"
5. Cliquez sur "Gérer" pour une évaluation
6. Choisissez "Masquer" ou "Supprimer"
7. Indiquez la raison de l'action

### 3️⃣ Dashboard → Utilisateurs → Désactiver un compte

1. Accédez à `/admin/dashboard`
2. Cliquez sur "Rechercher un utilisateur" dans les Actions rapides
3. Ou cliquez sur "Utilisateurs" dans la sidebar
4. Utilisez les filtres pour trouver un utilisateur
5. Cliquez sur "Désactiver" (ou "Activer" si déjà inactif)
6. Confirmez l'action dans le modal
7. L'utilisateur est notifié automatiquement

## 🎨 Fonctionnalités clés

### Tableau de bord
- ✅ 6 cartes KPI (utilisateurs, certifiés, trajets, réservations, signalements, note)
- ✅ Graphique : Trajets par semaine (area chart)
- ✅ Graphique : Réservations par statut (pie chart)
- ✅ Widget Actions rapides avec badges de notification
- ✅ Journal des dernières activités

### Validations identités
- ✅ Tableau avec filtres (statut, recherche)
- ✅ Modal de détail avec informations utilisateur
- ✅ Aperçu sécurisé de la pièce d'identité (masqué par défaut)
- ✅ Approuver/Rejeter avec confirmation
- ✅ Raison obligatoire en cas de rejet
- ✅ Notifications automatiques

### Utilisateurs
- ✅ Table complète avec multiples filtres
- ✅ Badges de rôle, certification et statut
- ✅ Détail utilisateur avec statistiques
- ✅ Activer/Désactiver avec confirmation
- ✅ Historique des trajets (conducteur/passager)

### Modération
- ✅ 2 onglets : Évaluations / Signalements
- ✅ Actions : Masquer / Afficher / Supprimer
- ✅ Raison obligatoire pour masquer/supprimer
- ✅ Gestion des signalements (Traiter / Rejeter)
- ✅ Badges de statut colorés

### Trajets & Réservations
- ✅ Tables avec filtres et recherche
- ✅ Visualisation des trajets avec départ/arrivée
- ✅ Statuts : Actif / Complété / Annulé / En attente / Accepté / Rejeté
- ✅ Détails accessibles via "Voir détails"

### Statistiques
- ✅ Graphiques Recharts professionnels
- ✅ Croissance utilisateurs (area chart)
- ✅ Trajets et réservations (bar chart)
- ✅ Certifications par semaine (line chart)
- ✅ Insights clés avec cartes colorées

### Paramètres
- ✅ Configuration générale
- ✅ Paramètres de sécurité (2FA, sessions)
- ✅ Gestion des notifications
- ✅ État du système (BDD, API, Email)
- ✅ Actions système (export, logs, backup)

## 🎨 Design

- **Thème** : Vert La Cité (#0B7742, #10A85C)
- **Layout** : Sidebar collapsible + Topbar avec recherche
- **Composants** : Cards, Tables, Badges, Dialogs, Toasts
- **Responsive** : Desktop-first (version web)
- **Accessibilité** : Contrastes respectés, focus visible

## 🔒 Sécurité

- ✅ Documents d'identité masqués par défaut
- ✅ Confirmation obligatoire pour actions critiques
- ✅ Raisons obligatoires pour rejets/suppressions
- ✅ Notifications automatiques aux utilisateurs
- ✅ Logs des actions admin (conceptuel)

## ⚠️ Important

- **Aucun paiement** : L'application est 100% gratuite, aucun montant/prix nulle part
- **Français** : Toutes les interfaces sont en français
- **Mock data** : Les données affichées sont des exemples pour démonstration
