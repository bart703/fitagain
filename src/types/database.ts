export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface DailyLog {
  id: string
  user_id: string
  date: string
  steps: number | null
  weight: number | null
  waist: number | null
  sleep_hours: number | null
  water_glasses: number | null
  exercised: boolean
  exercise_type: string | null
  created_at: string
}

export interface Meal {
  id: string
  user_id: string
  date: string
  meal_type: MealType
  description: string
  health_rating: number
  created_at: string
}

export interface DailyLogInsert {
  date: string
  steps?: number | null
  weight?: number | null
  waist?: number | null
  sleep_hours?: number | null
  water_glasses?: number | null
  exercised?: boolean
  exercise_type?: string | null
}

export interface MealInsert {
  date: string
  meal_type: MealType
  description: string
  health_rating: number
}
