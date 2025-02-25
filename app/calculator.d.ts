export type CalculatedThresholdResult = {
  product_id: string;
  product_name: string;
  avg_lead_time_days: number;
  avg_daily_sales: number;
  days_count: number;
  sales_data: {
    date: Date;
    inventory_level: number;
    orders: number;
    lead_time_days: number;
  }[];
};
