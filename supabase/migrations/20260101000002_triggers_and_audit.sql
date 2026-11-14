-- =====================================================================
-- PROSPACE DATABASE SCHEMA: TRIGGERS AND STORED PROCEDURES
-- Migration: 20260101000002_triggers_and_audit.sql
-- Description: Automation, profile synchronization, and project completion triggers
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TIMESTAMP UPDATER FUNCTION
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger across entities
CREATE OR REPLACE TRIGGER tr_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE OR REPLACE TRIGGER tr_workspaces_updated_at
BEFORE UPDATE ON public.workspaces
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE OR REPLACE TRIGGER tr_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE OR REPLACE TRIGGER tr_milestones_updated_at
BEFORE UPDATE ON public.milestones
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE OR REPLACE TRIGGER tr_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE OR REPLACE TRIGGER tr_task_comments_updated_at
BEFORE UPDATE ON public.task_comments
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE OR REPLACE TRIGGER tr_public_showcases_updated_at
BEFORE UPDATE ON public.public_showcases
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ---------------------------------------------------------------------
-- 2. AUTOMATIC USER PROFILE CREATION TRIGGER
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
BEGIN
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (Executed automatically by Supabase)
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------
-- 3. PROJECT COMPLETION PERCENTAGE CALCULATOR TRIGGER
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recalculate_project_completion()
RETURNS TRIGGER AS $$
DECLARE
    target_project_id UUID;
    total_tasks INT;
    completed_tasks INT;
    new_pct INT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_project_id := OLD.project_id;
    ELSE
        target_project_id := NEW.project_id;
    END IF;

    SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
    INTO total_tasks, completed_tasks
    FROM public.tasks
    WHERE project_id = target_project_id;

    IF total_tasks = 0 THEN
        new_pct := 0;
    ELSE
        new_pct := ROUND((completed_tasks::numeric / total_tasks::numeric) * 100);
    END IF;

    UPDATE public.projects
    SET completion_percentage = new_pct
    WHERE id = target_project_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_tasks_recalculate_project_completion
AFTER INSERT OR UPDATE OF status OR DELETE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.recalculate_project_completion();

-- ---------------------------------------------------------------------
-- 4. ACTIVITY LOGGER FUNCTION
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_workspace_activity(
    ws_id UUID,
    proj_id UUID,
    usr_id UUID,
    act_type TEXT,
    ent_type TEXT,
    ent_id UUID,
    meta JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.activities (
        workspace_id,
        project_id,
        user_id,
        action_type,
        entity_type,
        entity_id,
        metadata
    ) VALUES (
        ws_id,
        proj_id,
        usr_id,
        act_type,
        ent_type,
        ent_id,
        meta
    ) RETURNING id INTO activity_id;

    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
