"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Meal } from "@/types/database";

interface MealRatingChartProps {
  data: Meal[];
}

export default function MealRatingChart({ data }: MealRatingChartProps) {
  // Group by date and calculate average rating per day
  const groupedData = data.reduce((acc, meal) => {
    const date = meal.date;
    if (!acc[date]) {
      acc[date] = { ratings: [], count: 0 };
    }
    acc[date].ratings.push(meal.health_rating);
    acc[date].count++;
    return acc;
  }, {} as Record<string, { ratings: number[]; count: number }>);

  const chartData = Object.entries(groupedData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { ratings }]) => ({
      date: new Date(date).toLocaleDateString("nl-NL", { weekday: "short" }),
      rating: Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10,
    }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Gemiddelde gezondheidscore maaltijden (week)
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={{ stroke: "#4B5563" }}
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={{ stroke: "#4B5563" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#F9FAFB",
              }}
            />
            <Bar
              dataKey="rating"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              name="Gezondheidscore"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
