// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gfxbuxxqrraficlluybr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeGJ1eHhxcnJhZmljbGx1eWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MjkzODUsImV4cCI6MjA1MzEwNTM4NX0.gckpR_kto5-Ajdj9A2qqm-_zsK0kVMo4gVAM4iqfGQg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);