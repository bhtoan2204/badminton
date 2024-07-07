export interface Category {
  name: string;
  amount: number;
  id_expense_type: number;
}

export interface MonthlyData {
  month: number;
  total: number;
  categories: Category[];
}

export interface DailyCategory {
  name: string;
  amount: number;
  id_expense_type: number;
}

export interface DailyData {
  day: number;
  total: number;
  categories: DailyCategory[];
}
