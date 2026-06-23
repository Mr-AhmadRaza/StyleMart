import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/sidebarContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/admin/sidebar";

import "./globals.css";

export const metadata: Metadata = {
  title: "StyleMart",
   icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SidebarProvider>
            <Navbar />
            <Sidebar />
            <main>{children}</main>
            <Footer />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}