export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          FitAgain
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          Track je maaltijden, beweging en gezondheid. Bereik je doelen met dagelijkse inzichten.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Aan de slag
          </Link>
        </div>
      </main>
    </div>
  );
}
