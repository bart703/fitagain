"use server";

import { createClient } from "@/lib/supabase/server";

export async function getWeekData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  return data || [];
}

export async function getMonthData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 29);

  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  return data || [];
}

export async function getWeekMeals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  const { data } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  return data || [];
}

export async function getStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("steps, weight, sleep_hours, water_glasses, exercised")
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0]);

  if (!logs || logs.length === 0) return null;

  const stepsArr = logs.filter(l => l.steps).map(l => l.steps!);
  const weightArr = logs.filter(l => l.weight).map(l => l.weight!);
  const sleepArr = logs.filter(l => l.sleep_hours).map(l => l.sleep_hours!);
  const waterArr = logs.filter(l => l.water_glasses).map(l => l.water_glasses!);
  const exerciseDays = logs.filter(l => l.exercised).length;

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10 : null;

  return {
    avgSteps: avg(stepsArr),
    avgWeight: avg(weightArr),
    avgSleep: avg(sleepArr),
    avgWater: avg(waterArr),
    exerciseDays,
    totalDays: logs.length,
  };
}
