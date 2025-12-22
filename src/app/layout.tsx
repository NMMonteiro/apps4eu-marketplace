import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, LayoutDashboard, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./login/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "apps4EUprojects | Digital Marketplace",
  description: "Secure digital product marketplace for European projects.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen`} suppressHydrationWarning>
        <nav className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 h-36 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-32 h-32">
                <Image
                  src="/logo.png"
                  alt="apps4EUprojects Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-brand-navy hidden sm:block">apps4EU<span className="text-brand-slate font-medium">projects</span></span>
            </Link>

            <div className="flex items-center gap-6">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium text-brand-slate hover:text-brand-navy flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <form action={logout}>
                    <button type="submit" className="text-sm font-medium text-brand-slate hover:text-red-600 flex items-center gap-2 cursor-pointer transition-colors">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </form>
                  <div className="h-6 w-[1px] bg-slate-200 mx-2" />
                  <div className="text-sm font-semibold text-brand-navy flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-[150px] truncate">{user.email}</span>
                  </div>
                </>
              ) : (
                <Link href="/login" className="text-sm font-medium text-brand-slate hover:text-brand-navy flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
              <div className="h-6 w-[1px] bg-slate-200 mx-2" />
              <button className="p-2 text-brand-slate hover:text-brand-navy relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-brand-navy text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
              </button>
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
        <footer className="border-t bg-white py-12 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-brand-slate text-sm">© 2025 apps4EUprojects. Secure & Compliant Digital Distribution.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
