import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://acfuienyjlqobckgllht.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZnVpZW55amxxb2Jja2dsbGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTA2NzUsImV4cCI6MjA5MTcyNjY3NX0.N9Pr0XRj38A4CDFVxtkvYiDExArlSBH-y3Bf38csafE";

export const supabase = createClient(supabaseUrl, supabaseKey);

