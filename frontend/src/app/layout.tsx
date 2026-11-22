import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import AdminSecretDoor from "@/components/admin/AdminSecretDoor";

export const metadata: Metadata = {
  title: "Sanjitha E | GenAI Application Developer",
  description: "Portfolio of Sanjitha E - GenAI Application Developer specializing in Generative AI, Machine Learning and modern web systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("portfolio_theme")||"dark";if(t==="light"){document.documentElement.classList.add("light");document.documentElement.classList.remove("dark");}else{document.documentElement.classList.add("dark");document.documentElement.classList.remove("light");}}catch(e){document.documentElement.classList.add("dark");}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-btn-bg/20 selection:text-text-tan" suppressHydrationWarning>
        <ThemeProvider>
          <AdminSecretDoor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
