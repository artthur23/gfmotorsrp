import type { Metadata } from "next";
import { Big_Shoulders, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "GF Motors | Seminovos e Importados em Ribeirão Preto",
    template: "%s | GF Motors",
  },
  description:
    "Revenda de veículos seminovos e usados, nacionais e importados, em Ribeirão Preto - SP. Procedência verificada, financiamento facilitado e atendimento direto no WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bigShoulders.variable} ${workSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
