export const dynamic = "force-dynamic";

import { getWeekData, getMonthData, getWeekMeals, getStats } from "./actions";
import StatsCard from "@/components/dashboard/StatsCard";
import WeekChart from "@/components/dashboard/WeekChart";
import MonthChart from "@/components/dashboard/MonthChart";
import MealRatingChart from "@/components/dashboard/MealRatingChart";
import Link from "next/link";

export default async function DashboardPage() {
  const [weekData, monthData, weekMeals, stats] = await Promise.all([
    getWeekData(),
    getMonthData(),
    getWeekMeals(),
    getStats(),
  ]);

  const hasData = weekData.length > 0 || weekMeals.length > 0;

  return (
    <div className="space-y-4 sm:space-y-8 pb-20 sm:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link
          href="/log"
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg active:bg-blue-700 transition-colors"
        >
          + Invoeren
        </Link>
      </div>

      {!hasData ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welkom bij FitAgain!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Begin met het invoeren van je dagelijkse gegevens om je voortgang te zien.
          </p>
          <Link
            href="/log"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start met invoeren
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <StatsCard
                title="Gem. stappen"
                value={stats.avgSteps}
                subtitle="afgelopen 7 dagen"
              />
              <StatsCard
                title="Gem. gewicht"
                value={stats.avgWeight}
                unit="kg"
                subtitle="afgelopen 7 dagen"
              />
              <StatsCard
                title="Gem. slaap"
                value={stats.avgSleep}
                unit="uur"
                subtitle="afgelopen 7 dagen"
              />
              <StatsCard
                title="Sportdagen"
                value={`${stats.exerciseDays}/${stats.totalDays}`}
                subtitle="afgelopen 7 dagen"
              />
            </div>
          )}

          {/* Week Charts */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Week overzicht</h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <WeekChart data={weekData} metric="steps" title="Stappen" color="#3B82F6" />
              <WeekChart data={weekData} metric="weight" title="Gewicht" color="#8B5CF6" />
              <WeekChart data={weekData} metric="sleep_hours" title="Slaap" color="#EC4899" />
              <WeekChart data={weekData} metric="water_glasses" title="Water" color="#06B6D4" />
            </div>
          </div>

          {/* Meal Ratings */}
          {weekMeals.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Maaltijden</h2>
              <MealRatingChart data={weekMeals} />
            </div>
          )}

          {/* Month Charts */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Maand overzicht</h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <MonthChart data={monthData} metric="steps" title="Stappen (30 dagen)" color="#3B82F6" />
              <MonthChart data={monthData} metric="weight" title="Gewicht (30 dagen)" color="#8B5CF6" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
