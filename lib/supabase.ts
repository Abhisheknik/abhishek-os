import { createClient } from "@supabase/supabase-js";

const url  = process.env.SUPABASE_URL ?? "";
const anon = process.env.SUPABASE_ANON_KEY ?? "";

export const supabase = url && anon ? createClient(url, anon) : null;
