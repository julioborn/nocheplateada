import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getShowRegistro(): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("show_registro")
    .eq("id", true)
    .maybeSingle();

  return data?.show_registro ?? false;
}
