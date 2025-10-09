
// supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ovqwsturtwluwvvaucmk.supabase.co";      
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cXdzdHVydHdsdXd2dmF1Y21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDU2MjYsImV4cCI6MjA3NTQ4MTYyNn0.vtteeCxjL6inYWiIXwYU7tTjID237mGU4l9EOnqvydY"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
