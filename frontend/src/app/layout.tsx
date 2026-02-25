import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desafio técnico Totvs",
  description: "Frontend do desafio de senha segura",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: "#F5F5F5", 
        fontFamily: "sans-serif",
        minHeight: "100vh"
      }}>    
        {children}
      </body>
    </html>
  );
}