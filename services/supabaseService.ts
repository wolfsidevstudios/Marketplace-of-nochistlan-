
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://taxnvatmwzfhfwhuachd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheG52YXRtd3pmaGZ3aHVhY2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MDkwMzEsImV4cCI6MjA3MTk4NTAzMX0.xpDSp0pxsIlhNUev4-FT3OibCUwHurQxbUe_9RNbptw';

// In a real app, you'd want to use generated types for 'Database'
// For this example, we'll use 'any' for simplicity
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);