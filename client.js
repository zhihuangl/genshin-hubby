import { createClient } from '@supabase/supabase-js'

const URL = 'https://epufomdjjdxwobxaiqlf.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwdWZvbWRqamR4d29ieGFpcWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkxMjEwMDMsImV4cCI6MjAxNDY5NzAwM30.pgfLGNLBM3x-1j5gQah60sgYJt393_72K_ItYF987nE';
export const supabase = createClient(URL, API_KEY);