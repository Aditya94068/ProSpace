<<<<<<< HEAD
# ProSpace — Multi-Tenant SaaS Project Management Platform

ProSpace is a production-ready, multi-tenant SaaS project operating system built for college project squads, freelance engineers, agile development teams, and digital agencies.

It unifies project planning, drag-and-drop Kanban task boards, milestone deadline pacing, team workload management, developer integrations (GitHub & Vercel), and an external **Public Project Showcase** allowing teams to showcase approved projects without risking private repository code or internal discussions.

---

## 🚀 Key Features & Core Modules

1. **Module 1: Authentication & User Profiles**
   - User registration, login, logout, password reset, and user profile management.
   - Profile avatar with image URL support and styled initials fallback.
   - Protected route guards and session persistence.

2. **Module 2: Multi-Tenant Workspace Management**
   - Complete tenant isolation powered by PostgreSQL Row Level Security (RLS).
   - Granular RBAC permissions: **Owner**, **Admin**, **Member**.
   - Tokenized member invitations with expiration.
   - 1-Click switching across multiple workspaces.

3. **Module 3: Project Lifecycle & Dashboards**
   - Project lifecycle states: *Planning*, *In Progress*, *On Hold*, *Completed*, *Archived*.
   - Dynamic completion percentages recalculated automatically as tasks are finished.
   - Dedicated project overview with linked repositories and live deployment status.

4. **Module 4: Kanban Board & Task Management**
   - Full drag-and-drop Kanban board across 4 status lanes: *To Do*, *In Progress*, *In Review*, *Completed*.
   - Priority tagging (*Low*, *Medium*, *High*, *Urgent*).
   - Due dates, assignees, and real-time task discussion threads.

5. **Module 5: Milestone Pacing**
   - Phase-based milestone scheduling with target delivery deadlines.
   - Automatic calculation of linked task completion percentages.

6. **Module 6: Team Collaboration & Workload**
   - Active member roster, role badges, and individual active/completed task counts.
   - Invitation dispatch and direct tokenized link generation.

7. **Module 7 & 8: Developer Integrations (GitHub & Vercel)**
   - Link GitHub repositories, inspect default branch, and view latest commit logs.
   - Real-time Vercel deployment status (*READY*, *BUILDING*, *ERROR*).
   - 1-Click launch of live preview URLs.
   - **Security guarantee**: Server-side token handling ensures zero access tokens are exposed to frontend code.

8. **Module 9 & 10: Activity Timeline & Notifications**
   - Chronological audit log of events (workspace creation, tasks completed, deployments).
   - In-app notification center with unread counter and read-state management.

9. **Module 11: Public Project Showcase (Airgap Architecture)**
   - Curated public portfolio discovery gallery accessible without user authentication.
   - Displays project title, description, live demo URL, screenshot previews, approved team credits, and technology stack.
   - **Strict Airgap Guarantee**: Source code, private GitHub repositories, database credentials, API keys, and internal discussions are never exposed.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router v6, Lucide Icons.
- **Backend & Database**: Supabase, PostgreSQL 15, Row Level Security (RLS), Supabase Storage.
- **Tooling & Build**: Vite, PostCSS, Autoprefixer.

---

## 📦 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd prospace
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=ProSpace
VITE_APP_URL=http://localhost:3000
```
> **Note**: ProSpace includes an intelligent local fallback provider. If Supabase credentials are not provided yet, the application operates in local development mode with instant 1-click demo login (`demo@prospace.dev`), allowing full UI, Kanban, and workspace testing.

### 3. Apply Database Migrations
Run the migration scripts located in `supabase/migrations/` in order inside your Supabase SQL Editor:
1. `20260101000000_core_schema.sql` (Creates 16 normalized relational tables, types, and performance indexes)
2. `20260101000001_rls_policies.sql` (Enforces multi-tenant Row Level Security policies across all tables)
3. `20260101000002_triggers_and_audit.sql` (Configures triggers for user profiles, project progress calculations, and audit logging)

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🛡️ Multi-Tenant Security & Isolation Model

ProSpace ensures complete data isolation using PostgreSQL Row Level Security (RLS) policies:
```sql
CREATE POLICY "Workspace members can access projects"
ON public.projects FOR ALL
USING (public.is_workspace_member(workspace_id));
```
- Workspace A cannot view or access Workspace B's data under any condition.
- Zero reliance on client-side security: every database query is executed with the user's Supabase JWT identity (`auth.uid()`).
- Public showcase queries filter on `is_published = true` and expose only approved presentation fields.

---

## 📄 License
MIT License. Built with clean, reusable, modular code for modern engineering teams.
=======
# ProSpace
>>>>>>> 4908e8122efe565836d47bc08f3e41a202588a1f
