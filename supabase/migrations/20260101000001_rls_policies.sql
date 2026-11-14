-- =====================================================================
-- PROSPACE DATABASE SCHEMA: ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 20260101000001_rls_policies.sql
-- Description: Multi-tenant database-level data isolation policies
-- =====================================================================

-- ---------------------------------------------------------------------
-- HELPER FUNCTIONS FOR RLS CHECKS
-- ---------------------------------------------------------------------

-- Check if current authenticated user is a member of the workspace
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.workspace_members
        WHERE workspace_id = ws_id
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current user is admin or owner of workspace
CREATE OR REPLACE FUNCTION public.is_workspace_admin_or_owner(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.workspace_members
        WHERE workspace_id = ws_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check workspace role of current user
CREATE OR REPLACE FUNCTION public.get_user_workspace_role(ws_id UUID)
RETURNS workspace_role AS $$
DECLARE
    user_role workspace_role;
BEGIN
    SELECT role INTO user_role
    FROM public.workspace_members
    WHERE workspace_id = ws_id
    AND user_id = auth.uid();
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ---------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- ---------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vercel_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_showcases ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ---------------------------------------------------------------------
-- Users can view profiles if they share at least one workspace or if viewing public showcase team
CREATE POLICY "Users can view profile of colleagues or self"
ON public.profiles FOR SELECT
USING (
    id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.workspace_members wm1
        JOIN public.workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
        WHERE wm1.user_id = auth.uid() AND wm2.user_id = public.profiles.id
    )
);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ---------------------------------------------------------------------
-- 2. WORKSPACES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Users can view workspaces they belong to"
ON public.workspaces FOR SELECT
USING (public.is_workspace_member(id));

CREATE POLICY "Authenticated users can create workspaces"
ON public.workspaces FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Workspace owners and admins can update workspace"
ON public.workspaces FOR UPDATE
USING (public.is_workspace_admin_or_owner(id))
WITH CHECK (public.is_workspace_admin_or_owner(id));

CREATE POLICY "Only workspace owners can delete workspace"
ON public.workspaces FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = public.workspaces.id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
);

-- ---------------------------------------------------------------------
-- 3. WORKSPACE MEMBERS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Members can view other members in their workspace"
ON public.workspace_members FOR SELECT
USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins and owners can add members"
ON public.workspace_members FOR INSERT
WITH CHECK (
    public.is_workspace_admin_or_owner(workspace_id)
    OR user_id = auth.uid() -- For initial creator self-insertion
);

CREATE POLICY "Admins and owners can update roles"
ON public.workspace_members FOR UPDATE
USING (public.is_workspace_admin_or_owner(workspace_id))
WITH CHECK (public.is_workspace_admin_or_owner(workspace_id));

CREATE POLICY "Admins and owners can remove members"
ON public.workspace_members FOR DELETE
USING (
    public.is_workspace_admin_or_owner(workspace_id)
    OR user_id = auth.uid() -- Users can leave workspace voluntarily
);

-- ---------------------------------------------------------------------
-- 4. WORKSPACE INVITATIONS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Admins can view invitations"
ON public.workspace_invitations FOR SELECT
USING (public.is_workspace_admin_or_owner(workspace_id));

CREATE POLICY "Admins can create invitations"
ON public.workspace_invitations FOR INSERT
WITH CHECK (public.is_workspace_admin_or_owner(workspace_id));

CREATE POLICY "Admins can update or revoke invitations"
ON public.workspace_invitations FOR UPDATE
USING (public.is_workspace_admin_or_owner(workspace_id));

CREATE POLICY "Admins can delete invitations"
ON public.workspace_invitations FOR DELETE
USING (public.is_workspace_admin_or_owner(workspace_id));

-- ---------------------------------------------------------------------
-- 5. PROJECTS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Workspace members can view projects"
ON public.projects FOR SELECT
USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can create projects"
ON public.projects FOR INSERT
WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can update projects"
ON public.projects FOR UPDATE
USING (public.is_workspace_member(workspace_id))
WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins or owners can delete projects"
ON public.projects FOR DELETE
USING (public.is_workspace_admin_or_owner(workspace_id));

-- ---------------------------------------------------------------------
-- 6. PROJECT MEMBERS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Workspace members can view project members"
ON public.project_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = public.project_members.project_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

CREATE POLICY "Workspace members can manage project members"
ON public.project_members FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = public.project_members.project_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

-- ---------------------------------------------------------------------
-- 7. MILESTONES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Workspace members can view milestones"
ON public.milestones FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = public.milestones.project_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

CREATE POLICY "Workspace members can manage milestones"
ON public.milestones FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = public.milestones.project_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

-- ---------------------------------------------------------------------
-- 8. TASKS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Workspace members can view tasks"
ON public.tasks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = public.tasks.project_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

CREATE POLICY "Workspace members can create and manage tasks"
ON public.tasks FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = public.tasks.project_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

-- ---------------------------------------------------------------------
-- 9. TASK COMMENTS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Workspace members can view task comments"
ON public.task_comments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.projects p ON p.id = t.project_id
        WHERE t.id = public.task_comments.task_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

CREATE POLICY "Workspace members can add comments"
ON public.task_comments FOR INSERT
WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.projects p ON p.id = t.project_id
        WHERE t.id = public.task_comments.task_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

CREATE POLICY "Comment author or admin can delete comments"
ON public.task_comments FOR DELETE
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.projects p ON p.id = t.project_id
        WHERE t.id = public.task_comments.task_id
        AND public.is_workspace_admin_or_owner(p.workspace_id)
    )
);

-- ---------------------------------------------------------------------
-- 10. ACTIVITIES POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Workspace members can view workspace activities"
ON public.activities FOR SELECT
USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can record activity"
ON public.activities FOR INSERT
WITH CHECK (public.is_workspace_member(workspace_id) AND user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 11. NOTIFICATIONS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Users can only view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 12. GITHUB & VERCEL INTEGRATIONS POLICIES
-- ---------------------------------------------------------------------
CREATE POLICY "Workspace members can view integrations"
ON public.github_integrations FOR SELECT
USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins can manage GitHub integration"
ON public.github_integrations FOR ALL
USING (public.is_workspace_admin_or_owner(workspace_id));

CREATE POLICY "Workspace members can view linked repos"
ON public.github_repositories FOR SELECT
USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can link repos"
ON public.github_repositories FOR ALL
USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can view Vercel integrations"
ON public.vercel_integrations FOR SELECT
USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins can manage Vercel integration"
ON public.vercel_integrations FOR ALL
USING (public.is_workspace_admin_or_owner(workspace_id));

CREATE POLICY "Workspace members can view deployments"
ON public.deployments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = public.deployments.project_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

-- ---------------------------------------------------------------------
-- 13. PUBLIC SHOWCASE POLICIES (AIRGAP SECURITY)
-- ---------------------------------------------------------------------
-- Zero-Auth public read for published showcases only
CREATE POLICY "Public can view published showcases"
ON public.public_showcases FOR SELECT
USING (
    is_published = true
    OR (
        auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = public.public_showcases.project_id
            AND public.is_workspace_member(p.workspace_id)
        )
    )
);

CREATE POLICY "Workspace members can manage project showcase"
ON public.public_showcases FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = public.public_showcases.project_id
        AND public.is_workspace_member(p.workspace_id)
    )
);
