import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import SilverSparkles from "@/components/SilverSparkles";
import SorteoView from "./SorteoView";
import { getNombresParaSorteo } from "./actions";

export const dynamic = "force-dynamic";

export default async function SorteoPage() {
  const authed = await isAdminAuthed();
  if (!authed) {
    redirect("/admin");
  }

  const nombres = await getNombresParaSorteo();

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-black">
      <SilverSparkles />
      <SorteoView nombres={nombres} />
    </main>
  );
}
