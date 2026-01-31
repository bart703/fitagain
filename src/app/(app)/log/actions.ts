"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DailyLogInsert, MealInsert } from "@/types/database";

export async function saveDailyLog(data: DailyLogInsert) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Niet ingelogd" };
  }

  const { error } = await supabase
    .from("daily_logs")
    .upsert(
      { ...data, user_id: user.id },
      { onConflict: "user_id,date" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/log");
  return { success: true };
}

export async function saveMeal(data: MealInsert) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Niet ingelogd" };
  }

  const { error } = await supabase
    .from("meals")
    .upsert(
      { ...data, user_id: user.id },
      { onConflict: "user_id,date,meal_type" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/log");
  return { success: true };
}

export async function getDailyLog(date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  return data;
}

export async function getMeals(date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date);

  return data || [];
}
