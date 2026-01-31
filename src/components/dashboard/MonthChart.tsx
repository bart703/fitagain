"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyLog } from "@/types/database";

interface MonthChartProps {
  data: DailyLog[];
  metric: "steps" | "weight" | "sleep_hours" | "water_glasses";
  title: string;
  color: string;
}

const metricLabels: Record<string, string> = {
  steps: "Stappen",
  weight: "Gewicht (kg)",
  sleep_hours: "Slaap (uren)",
  water_glasses: "Water (glazen)",
};

export default function MonthChart({ data, metric, title, color }: MonthChartProps) {
  const chartData = data.map((log) => ({
    date: new Date(log.date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }),
    [metric]: log[metric],
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              axisLine={{ stroke: "#4B5563" }}
              interval="preserveStartEnd"
            />
            <YAxis
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
            <Area
              type="monotone"
              dataKey={metric}
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              name={metricLabels[metric]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
