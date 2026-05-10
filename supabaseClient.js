import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://sjbaxzgkmrzyirhxbgxi.supabase.co';
const supabaseKey = 'Sb_publishable_fjwitosjQ02wGWXrpoJ19g_KzppuTlb';

export const supabase = createClient(supabaseUrl, supabaseKey);
