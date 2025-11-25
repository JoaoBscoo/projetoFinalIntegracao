import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://enhpvcinoezdansmasps.supabase.co"; // troque aqui
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaHB2Y2lub2V6ZGFuc21hc3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTI1NzUsImV4cCI6MjA3OTY2ODU3NX0.9YwUP0ionbBg312Jc2mf3aCGxvpdMx4WfDN8g1nwsgQ"; // troque aqui

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
