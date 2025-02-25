export type CalculatedThresholdResult = {
  product_id: string;
  product_name: string;
  avg_lead_time_days: number;
  total_lead_time_days: number;
  total_daily_sales: number;
  avg_daily_sales: number;
  minimum_daily_sales: number;
  maximum_daily_sales: number;
  days_count: number;
  safety_stock: number;
  sales_data: {
    date: Date;
    inventory_level: number;
    orders: number;
    lead_time_days: number;
  }[];
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };
};
export type ThresholdConfig = {
  safetyStockPercentage: number;
};
