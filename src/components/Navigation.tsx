"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/log", label: "Invoeren", icon: "M12 4v16m8-8H4" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden sm:block bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                FitAgain
              </Link>
              <div className="flex gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="sm:hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/dashboard" className="text-lg font-bold text-blue-600">
            FitAgain
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 dark:text-gray-300 px-3 py-1"
          >
            Uitloggen
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex justify-around items-center h-16">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={link.icon}
                />
              </svg>
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
