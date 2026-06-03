
-- App role enum + user_roles table (recommended pattern)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Discovered tools
CREATE TABLE public.discovered_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  full_name TEXT NOT NULL UNIQUE, -- e.g. "owner/repo"
  github_url TEXT NOT NULL,
  description TEXT,
  homepage TEXT,
  language TEXT,
  license TEXT,
  stars INT NOT NULL DEFAULT 0,
  forks INT NOT NULL DEFAULT 0,
  topics TEXT[] NOT NULL DEFAULT '{}',
  readme_excerpt TEXT,
  last_commit TIMESTAMPTZ,
  score INT NOT NULL DEFAULT 0,
  suggested_category TEXT,
  level TEXT, -- Débutant | Intermédiaire | Avancé
  source TEXT NOT NULL DEFAULT 'github', -- github | hn | rss ...
  source_query TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  reject_reason TEXT,
  install_cmd TEXT,
  example_cmd TEXT,
  ethical BOOLEAN NOT NULL DEFAULT false,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_discovered_status ON public.discovered_tools(status, score DESC);
CREATE INDEX idx_discovered_detected ON public.discovered_tools(detected_at DESC);

GRANT SELECT ON public.discovered_tools TO anon, authenticated;
GRANT ALL ON public.discovered_tools TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.discovered_tools TO authenticated;

ALTER TABLE public.discovered_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved tools"
  ON public.discovered_tools FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tools"
  ON public.discovered_tools FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tools"
  ON public.discovered_tools FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tools"
  ON public.discovered_tools FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Daily tool
CREATE TABLE public.daily_tool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES public.discovered_tools(id) ON DELETE CASCADE NOT NULL,
  featured_date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_daily_date ON public.daily_tool(featured_date DESC);

GRANT SELECT ON public.daily_tool TO anon, authenticated;
GRANT ALL ON public.daily_tool TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.daily_tool TO authenticated;

ALTER TABLE public.daily_tool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read daily tool"
  ON public.daily_tool FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage daily tool"
  ON public.daily_tool FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Discovery runs (logs)
CREATE TABLE public.discovery_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  query TEXT,
  fetched_count INT NOT NULL DEFAULT 0,
  kept_count INT NOT NULL DEFAULT 0,
  error TEXT,
  duration_ms INT,
  run_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_runs_run_at ON public.discovery_runs(run_at DESC);

GRANT SELECT ON public.discovery_runs TO authenticated;
GRANT ALL ON public.discovery_runs TO service_role;

ALTER TABLE public.discovery_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read runs"
  ON public.discovery_runs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
