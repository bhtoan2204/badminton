export interface IncomeCategory {
  name: string;
  amount: number;
  id_income_source: number;
}

export interface MonthlyIncomeData {
  month: number;
  total: number;
  categories: IncomeCategory[];
}

export interface DailyIncomeCategory {
  name: string;
  amount: number;
  id_income_source: number;
}

export interface DailyIncomeData {
  day: number;
  total: number;
  categories: DailyIncomeCategory[];
}
