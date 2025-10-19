-- Create visitor_logs table for tracking login attempts
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  username TEXT NOT NULL,
  user_agent TEXT,
  action TEXT DEFAULT 'visit',
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table for lock status
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default lock status
INSERT INTO public.system_settings (key, value)
VALUES ('site_locked', 'false')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for this OSINT tool)
CREATE POLICY "Allow public read access to visitor_logs"
  ON public.visitor_logs
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to visitor_logs"
  ON public.visitor_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete from visitor_logs"
  ON public.visitor_logs
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to system_settings"
  ON public.system_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public update to system_settings"
  ON public.system_settings
  FOR UPDATE
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON public.visitor_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_action ON public.visitor_logs(action);