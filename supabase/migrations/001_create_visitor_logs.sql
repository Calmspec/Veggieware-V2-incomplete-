-- Create visitor_logs table
CREATE TABLE IF NOT EXISTS visitor_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ip_address TEXT NOT NULL,
  username TEXT NOT NULL,
  user_agent TEXT,
  location TEXT,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitor_logs_timestamp ON visitor_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip ON visitor_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_username ON visitor_logs(username);

-- Enable RLS (Row Level Security)
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations on visitor_logs" ON visitor_logs
  FOR ALL
  USING (true);