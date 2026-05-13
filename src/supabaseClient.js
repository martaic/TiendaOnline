import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pryrdzmgangddwvxvzuc.supabase.co';
const supabaseAnonKey = 'sb_publishable_yFh6k9e6-qgTLVJxZcEfug_j4MYA6RM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);