
ALTER TABLE public.daily_tool DROP CONSTRAINT daily_tool_featured_date_key;
ALTER TABLE public.daily_tool ADD CONSTRAINT daily_tool_tool_date_key UNIQUE (tool_id, featured_date);
CREATE INDEX IF NOT EXISTS idx_daily_tool_featured_date ON public.daily_tool (featured_date DESC);
