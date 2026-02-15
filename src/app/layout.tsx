import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { SocketProvider } from "@/contexts/socket-context";
import { ToastContainer } from "@/components/toast-notification";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "BoostMarket — Game Boosting, Done Right",
  description: "A marketplace where gamers find trusted boosters to rank up — fast, safe, and transparent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.className} bg-[#111114] text-gray-100 antialiased`}>
        <AuthProvider>
          <SocketProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ToastContainer />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
