-- =====================================================================
-- PROSPACE DATABASE SEED DATA
-- Path: supabase/seed.sql
-- Description: Multi-tenant demonstration seed with isolated workspaces
-- =====================================================================

-- 1. Profiles (Simulating authenticated users)
-- In production, profiles are generated automatically via handle_new_user() trigger on auth.users.
INSERT INTO public.profiles (id, email, full_name, role_title, bio, website, github_handle, avatar_url)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'alex@prospace.dev',
    'Alex Rivera',
    'Full-Stack Software Architect',
    'Lead architect specializing in multi-tenant SaaS, distributed systems, and modern cloud infrastructure.',
    'https://prospace.dev',
    'alexrivera',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'sarah@prospace.dev',
    'Sarah Chen',
    'Lead Frontend Engineer & UI/UX',
    'Passionate about design systems, accessibility, and high-performance React applications.',
    'https://sarahchen.design',
    'sarahchen',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'marcus@prospace.dev',
    'Marcus Vance',
    'Backend & DevOps Engineer',
    'Kubernetes, CI/CD automation, PostgreSQL tuning, and cloud deployment pipelines.',
    'https://marcus.dev',
    'marcusv',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'bob@external-agency.com',
    'Bob Miller',
    'Independent Freelancer & Consultant',
    'Client engineering lead working in an isolated external workspace.',
    'https://bobmiller.tech',
    'bobmiller',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
  )
ON CONFLICT (id) DO NOTHING;

-- 2. Workspaces (Tenant 1: Acme Engineering, Tenant 2: Freelance Client Portal)
INSERT INTO public.workspaces (id, name, slug, description, plan, created_by)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Acme Engineering',
    'acme-engineering',
    'Primary multi-tenant workspace for core SaaS platform engineering, client apps, and DevOps.',
    'pro',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'CS Capstone Squad',
    'cs-capstone-squad',
    'University final-year autonomous AI robotics capstone project.',
    'free',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Miller Digital Agency',
    'miller-digital',
    'Isolated client tenant owned exclusively by Bob Miller (Demonstrating multi-tenant airgap).',
    'pro',
    '00000000-0000-0000-0000-000000000004'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Workspace Members (RBAC Junction)
INSERT INTO public.workspace_members (workspace_id, user_id, role)
VALUES
  -- Acme Engineering
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'owner'),
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'admin'),
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', 'member'),
  -- CS Capstone
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'owner'),
  -- Miller Agency (Only Bob belongs here, Alex & Sarah have ZERO access)
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000004', 'owner')
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- 4. Projects
INSERT INTO public.projects (id, workspace_id, name, slug, description, status, priority, start_date, deadline, completion_percentage, cover_image, created_by)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'ProSpace Core SaaS Platform',
    'prospace-core',
    'Multi-tenant project management, PostgreSQL RLS, GitHub & Vercel API webhooks.',
    'in_progress',
    'urgent',
    '2026-10-01',
    '2026-12-15',
    75,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'Mobile Client & React Native App',
    'mobile-client',
    'Cross-platform mobile workspace experience for iOS and Android.',
    'in_progress',
    'high',
    '2026-11-01',
    '2027-01-20',
    40,
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    'Private Client CRM Application',
    'private-client-crm',
    'Confidential enterprise banking CRM. Protected by RLS so Acme Engineering cannot see this.',
    'in_progress',
    'urgent',
    '2026-11-10',
    '2027-02-15',
    30,
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    '00000000-0000-0000-0000-000000000004'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Milestones
INSERT INTO public.milestones (id, project_id, title, description, deadline, status, order_index)
VALUES
  (
    'm1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Phase 1: Architecture & Foundation MVP',
    'Database migrations, schema normalization, RLS policies, and Auth module.',
    '2026-11-20',
    'completed',
    1
  ),
  (
    'm2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Phase 2: Core Workspace & Multi-Tenancy',
    'Role-based authorization, member invitations, and tenant isolation.',
    '2026-11-25',
    'in_progress',
    2
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Tasks
INSERT INTO public.tasks (id, project_id, milestone_id, title, description, status, priority, assignee_id, due_date, order_index, created_by)
VALUES
  (
    't1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'm1111111-1111-1111-1111-111111111111',
    'Design database schema with 16 core PostgreSQL tables',
    'Profiles, workspaces, members, projects, tasks, comments, integrations, and showcase.',
    'completed',
    'high',
    '00000000-0000-0000-0000-000000000001',
    '2026-11-15',
    0,
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    't2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'm1111111-1111-1111-1111-111111111111',
    'Implement Row-Level Security (RLS) policies for multi-tenancy',
    'Enforce database-level data isolation across all workspace entities.',
    'completed',
    'urgent',
    '00000000-0000-0000-0000-000000000001',
    '2026-11-16',
    1,
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    't3333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'm2222222-2222-2222-2222-222222222222',
    'Build interactive Kanban board with drag-and-drop status lanes',
    'HTML5 drag events with To Do, In Progress, In Review, and Completed columns.',
    'in_progress',
    'high',
    '00000000-0000-0000-0000-000000000002',
    '2026-11-20',
    0,
    '00000000-0000-0000-0000-000000000001'
  )
ON CONFLICT (id) DO NOTHING;

-- 7. Task Comments
INSERT INTO public.task_comments (id, task_id, user_id, content)
VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    't3333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000001',
    'Ensure drag-and-drop animations remain fluid with 100+ tasks.'
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    't3333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000002',
    'Tested with virtualized lanes, performance is snappy.'
  )
ON CONFLICT (id) DO NOTHING;

-- 8. GitHub Repositories
INSERT INTO public.github_repositories (workspace_id, project_id, repo_id, repo_name, full_name, html_url, default_branch, is_private, last_synced_at)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    987654321,
    'core-saas',
    'prospace/core-saas',
    'https://github.com/prospace/core-saas',
    'main',
    true,
    timezone('utc'::text, now())
  )
ON CONFLICT (project_id) DO NOTHING;

-- 9. Deployments
INSERT INTO public.deployments (project_id, vercel_deployment_id, url, status, commit_hash, commit_message, branch, creator_name)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'dpl_7a2b9f_prod',
    'https://prospace-saas.vercel.app',
    'READY',
    '7a2b9f',
    'Add PostgreSQL RLS isolation policies',
    'main',
    'Vercel CI/CD'
  )
ON CONFLICT (id) DO NOTHING;

-- 10. Public Showcase (Zero-Auth public discovery)
INSERT INTO public.public_showcases (project_id, is_published, slug, title, custom_description, live_demo_url, tech_stack, tags, show_team, view_count, published_at)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    true,
    'prospace-saas',
    'ProSpace — Multi-Tenant Project Management SaaS',
    'The all-in-one project operations system for modern builders. Features drag-and-drop Kanban, PostgreSQL RLS tenant isolation, GitHub integration, and Vercel pipeline monitoring.',
    'https://prospace-saas.vercel.app',
    ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    ARRAY['SaaS', 'Productivity', 'DevTools', 'Open Source'],
    true,
    1420,
    timezone('utc'::text, now())
  )
ON CONFLICT (project_id) DO NOTHING;
