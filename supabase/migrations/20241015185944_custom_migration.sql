DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.recruiters;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;

REVOKE DELETE ON TABLE public.users FROM anon;
REVOKE INSERT ON TABLE public.users FROM anon;
-- ... (all other revoke statements)

DROP TABLE IF EXISTS public.users;

ALTER TABLE public.applicants ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.recruiters ALTER COLUMN id DROP DEFAULT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.raw_user_meta_data->>'role' IS NULL THEN
        RAISE EXCEPTION 'No role found in raw_user_meta_data for user: %', NEW.id;
    END IF;

    IF NEW.raw_user_meta_data->>'role' = 'recruiter' THEN
        RAISE NOTICE 'Creating recruiter for user: %', NEW.id;
        INSERT INTO public.recruiters (id) VALUES (NEW.id);
    ELSIF NEW.raw_user_meta_data->>'role' = 'applicant' THEN
        RAISE NOTICE 'Creating applicant for user: %', NEW.id;
        INSERT INTO public.applicants (id) VALUES (NEW.id);
    ELSE
        RAISE EXCEPTION 'Invalid role: %, for user: %', NEW.raw_user_meta_data->>'role', NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

-- Add necessary GRANT and CREATE POLICY statements:
GRANT INSERT ON TABLE public.applicants TO supabase_auth_admin;
GRANT INSERT ON TABLE public.recruiters TO supabase_auth_admin;

CREATE POLICY allow_supabase_service_role
ON public.applicants
AS PERMISSIVE
FOR ALL
TO anon, authenticated, supabase_auth_admin
USING (true);

CREATE POLICY allow_supabase_service_role
ON public.recruiters
AS PERMISSIVE
FOR ALL
TO anon, authenticated, supabase_auth_admin
USING (true);
