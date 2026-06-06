import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <nav className="bg-slate-800 p-4 flex justify-between items-center shadow-lg">
            <h1 className="text-2xl font-bold text-blue-400">AI-Genius</h1>
          </nav>
          <main className="container mx-auto p-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}