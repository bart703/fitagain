"use client";

import { useState, useEffect } from "react";
import { saveDailyLog, saveMeal, getDailyLog, getMeals } from "./actions";
import type { DailyLog, Meal, MealType } from "@/types/database";

export default function LogPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check if selected date is a Monday (for weekly weight)
  const isMonday = new Date(date).getDay() === 1;

  // Navigation helpers
  const goToYesterday = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d.toISOString().split("T")[0]);
  };

  const goToTomorrow = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split("T")[0]);
  };

  const goToToday = () => {
    setDate(new Date().toISOString().split("T")[0]);
  };

  const isToday = date === new Date().toISOString().split("T")[0];

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
  };

  // Daily log state
  const [steps, setSteps] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [waterGlasses, setWaterGlasses] = useState("");
  const [exercised, setExercised] = useState(false);
  const [exerciseType, setExerciseType] = useState("");

  // Meals state
  const [meals, setMeals] = useState<Record<MealType, { description: string; rating: number }>>({
    breakfast: { description: "", rating: 3 },
    lunch: { description: "", rating: 3 },
    dinner: { description: "", rating: 3 },
  });

  // Load existing data when date changes
  useEffect(() => {
    async function loadData() {
      const [dailyLog, existingMeals] = await Promise.all([
        getDailyLog(date),
        getMeals(date),
      ]);

      if (dailyLog) {
        setSteps(dailyLog.steps?.toString() || "");
        setWeight(dailyLog.weight?.toString() || "");
        setWaist(dailyLog.waist?.toString() || "");
        setSleepHours(dailyLog.sleep_hours?.toString() || "");
        setWaterGlasses(dailyLog.water_glasses?.toString() || "");
        setExercised(dailyLog.exercised || false);
        setExerciseType(dailyLog.exercise_type || "");
      } else {
        setSteps("");
        setWeight("");
        setWaist("");
        setSleepHours("");
        setWaterGlasses("");
        setExercised(false);
        setExerciseType("");
      }

      const newMeals: Record<MealType, { description: string; rating: number }> = {
        breakfast: { description: "", rating: 3 },
        lunch: { description: "", rating: 3 },
        dinner: { description: "", rating: 3 },
      };

      existingMeals.forEach((meal: Meal) => {
        newMeals[meal.meal_type] = {
          description: meal.description,
          rating: meal.health_rating,
        };
      });

      setMeals(newMeals);
    }

    loadData();
  }, [date]);

  const handleSaveDailyLog = async () => {
    setSaving(true);
    setMessage(null);

    const result = await saveDailyLog({
      date,
      steps: steps ? parseInt(steps) : null,
      weight: isMonday && weight ? parseFloat(weight) : null,
      waist: isMonday && waist ? parseFloat(waist) : null,
      sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
      water_glasses: waterGlasses ? parseInt(waterGlasses) : null,
      exercised,
      exercise_type: exerciseType || null,
    });

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Opgeslagen!" });
    }

    setSaving(false);
  };

  const handleSaveMeal = async (mealType: MealType) => {
    const meal = meals[mealType];
    if (!meal.description.trim()) return;

    setSaving(true);
    setMessage(null);

    const result = await saveMeal({
      date,
      meal_type: mealType,
      description: meal.description,
      health_rating: meal.rating,
    });

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Opgeslagen!" });
    }

    setSaving(false);
  };

  const mealLabels: Record<MealType, string> = {
    breakfast: "Ontbijt",
    lunch: "Lunch",
    dinner: "Diner",
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
      {/* Date Navigation - Mobile Optimized */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={goToYesterday}
            className="p-3 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-700 rounded-lg active:bg-gray-200 dark:active:bg-gray-600 touch-manipulation"
            aria-label="Gisteren"
          >
            <svg className="w-5 h-5 sm:hidden text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">Gisteren</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatDate(date)}
            </span>
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-xs text-blue-600 mt-1"
              >
                Naar vandaag
              </button>
            )}
          </div>

          <button
            onClick={goToTomorrow}
            className="p-3 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-700 rounded-lg active:bg-gray-200 dark:active:bg-gray-600 touch-manipulation"
            aria-label="Morgen"
          >
            <svg className="w-5 h-5 sm:hidden text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">Morgen</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* Daily Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">Dagelijkse metrics</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stappen
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 sm:py-2 text-base border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {isMonday && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gewicht
                  <span className="text-xs text-gray-500 ml-1">(kg)</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-3 sm:py-2 text-base border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buikomtrek
                  <span className="text-xs text-gray-500 ml-1">(cm)</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-3 sm:py-2 text-base border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slaap
              <span className="text-xs text-gray-500 ml-1">(uren)</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 sm:py-2 text-base border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Water
              <span className="text-xs text-gray-500 ml-1">(glazen)</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={waterGlasses}
              onChange={(e) => setWaterGlasses(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 sm:py-2 text-base border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gesport?
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exercised}
                  onChange={(e) => setExercised(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">Ja</span>
              </label>
              {exercised && (
                <input
                  type="text"
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                  placeholder="Type sport"
                  className="flex-1 px-3 py-3 sm:py-2 text-base border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleSaveDailyLog}
          disabled={saving}
          className="mt-4 w-full sm:w-auto px-6 py-3 sm:py-2 bg-blue-600 text-white rounded-lg font-medium active:bg-blue-700 disabled:opacity-50 touch-manipulation"
        >
          {saving ? "Opslaan..." : "Metrics opslaan"}
        </button>
      </div>

      {/* Meals */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">Maaltijden</h2>
        <div className="space-y-5">
          {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealType) => (
            <div key={mealType} className="border-b border-gray-200 dark:border-gray-700 pb-5 last:border-0 last:pb-0">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{mealLabels[mealType]}</h3>
              <div className="space-y-3">
                <textarea
                  value={meals[mealType].description}
                  onChange={(e) =>
                    setMeals((prev) => ({
                      ...prev,
                      [mealType]: { ...prev[mealType], description: e.target.value },
                    }))
                  }
                  placeholder="Wat heb je gegeten?"
                  rows={2}
                  className="w-full px-3 py-3 sm:py-2 text-base border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Gezond:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            setMeals((prev) => ({
                              ...prev,
                              [mealType]: { ...prev[mealType], rating },
                            }))
                          }
                          className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full text-sm font-medium transition-colors touch-manipulation ${
                            meals[mealType].rating >= rating
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveMeal(mealType)}
                    disabled={saving || !meals[mealType].description.trim()}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg active:bg-blue-700 disabled:opacity-50 touch-manipulation"
                  >
                    Opslaan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
