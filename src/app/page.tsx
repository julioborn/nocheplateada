import RegistroLanding from "@/components/RegistroLanding";
import InfoLanding from "@/components/InfoLanding";
import { getShowRegistro } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const showRegistro = await getShowRegistro();
  return showRegistro ? <RegistroLanding /> : <InfoLanding />;
}
