import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nocheplateada.com.ar"),
  title: "Noche Plateada",
  description: "Registrate para la Noche Plateada",
  openGraph: {
    title: "Noche Plateada",
    description: "Registrate para la Noche Plateada",
    siteName: "Noche Plateada",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noche Plateada",
    description: "Registrate para la Noche Plateada",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-zinc-100">
        {children}
      </body>
    </html>
  );
}
