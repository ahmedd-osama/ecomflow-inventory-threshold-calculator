"use server";

import * as XLSX from "xlsx";
import { CalculatedThresholdResult, ThresholdConfig } from "./calculator";
import { z } from "zod";

/**
 * Schema for validating inventory data from uploaded files
 * Requires product ID, name, date, inventory level, orders and lead time
 */
const ValidationSchema = z.array(
  z.object({
    product_id: z.string(),
    product_name: z.string(),
    date: z.date(),
    inventory_level: z.number(),
    orders: z.number(),
    lead_time_days: z.number(),
  })
);

/**
 * Calculates inventory thresholds from uploaded file data
 *
 * @param file - The uploaded Excel/CSV file containing inventory data
 * @returns Object containing either calculated threshold results or error message
 *
 * The function:
 * 1. Validates file extension (.xlsx, .xls, .csv) and size (<1MB)
 * 2. Parses and validates file contents against schema
 * 3. Groups data by product ID
 * 4. Calculates key metrics for each product:
 *    - Average daily sales
 *    - Average lead time
 *    - Min/max daily sales
 *    - Safety stock
 *    - Low/medium/high thresholds
 *
 * Threshold calculations:
 * - Safety stock = (max daily sales - avg daily sales) * avg lead time
 * - Low threshold = (min daily sales * avg lead time) + safety stock
 * - Medium threshold = (avg daily sales * avg lead time) + safety stock
 * - High threshold = (max daily sales * avg lead time) + safety stock
 */
export const calculateThresholdsAction = async ({
  file,
}: {
  file: File;
}): Promise<{
  data: CalculatedThresholdResult[] | null;
  error: string | null;
}> => {
  // Validate File Extension
  const allowedExtensions = [".xlsx", ".xls", ".csv"];
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      data: null,
      error: "Please upload an Excel or CSV file (.xlsx, .xls, or .csv)",
    };
  }

  // Validate File Size (1MB = 1,048,576 bytes)
  const maxSize = 1048576;
  if (file.size > maxSize) {
    return {
      data: null,
      error: "File size must be less than 1MB",
    };
  }

  // Parsing and Validating File Content
  let validatedData: z.infer<typeof ValidationSchema> = [];
  const fileContent = await file.arrayBuffer();
  const workbook = XLSX.read(fileContent, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet);

  try {
    validatedData = ValidationSchema.parse(json);
  } catch (error) {
    console.error({ error });
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error:
          "Invalid data format in file. Please check the sample file for the correct format.",
      };
    }
    return {
      data: null,
      error: "An error occurred while processing the file Data",
    };
  }

  // Handling Inventory Threshold Logic And Calculaions

  // Group data by product_id: shape is {product_id: CalculatedThresholdResult}
  const groupedData: Record<string, CalculatedThresholdResult> =
    validatedData.reduce((acc, curr) => {
      if (!acc[curr.product_id]) {
        // first encounter of product_id
        acc[curr.product_id] = {
          product_id: curr.product_id,
          product_name: curr.product_name,
          sales_data: [],
          total_daily_sales: 0,
          total_lead_time_days: 0,
          avg_daily_sales: 0,
          minimum_daily_sales: 0,
          maximum_daily_sales: 0,
          avg_lead_time_days: 0,
          safety_stock: 0,
          days_count: 0,
        };
      }

      // add sales data to the product
      acc[curr.product_id].sales_data.push({
        date: curr.date,
        inventory_level: curr.inventory_level,
        orders: curr.orders,
        lead_time_days: curr.lead_time_days,
      });

      // update total sales, lead time
      acc[curr.product_id].total_daily_sales += curr.orders;
      acc[curr.product_id].total_lead_time_days += curr.lead_time_days;
      acc[curr.product_id].days_count++;

      return acc;
    }, {} as Record<string, CalculatedThresholdResult>);

  // Transform grouped data into final format with calculations
  const mergedData: CalculatedThresholdResult[] = Object.values(
    groupedData
  ).map((group) => {
    // Sort sales_data by date
    group.sales_data.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const avgDailySales = Math.round(
      group.total_daily_sales / group.days_count
    );
    const avgLeadTime = Math.round(
      group.total_lead_time_days / group.days_count
    );
    const minimumDailySales = Math.min(
      ...group.sales_data.map((sale) => sale.orders)
    );
    const maximumDailySales = Math.max(
      ...group.sales_data.map((sale) => sale.orders)
    );

    // Calculate thresholds
    // safety stock = (maximumDailySales - avgDailySales) * avgLeadTime
    // lowThreshold = (maximumDailySales * avgLeadTime) + safetyStock
    // mediumThreshold = (avgDailySales * avgLeadTime) + safetyStock
    // highThreshold = (minimumDailySales * avgLeadTime) + safetyStock

    const safetyStock = Math.round(
      (maximumDailySales - avgDailySales) * avgLeadTime
    );

    // reorder threshold = medium threshold
    const mediumThreshold =
      Math.round(avgDailySales * avgLeadTime) + safetyStock;

    const highThreshold =
      Math.round(maximumDailySales * avgLeadTime) + safetyStock;
    const lowThreshold =
      Math.round(minimumDailySales * avgLeadTime) + safetyStock;

    return {
      product_id: group.product_id,
      product_name: group.product_name,
      total_lead_time_days: group.total_lead_time_days,
      total_daily_sales: group.total_daily_sales,
      avg_lead_time_days: avgLeadTime,
      avg_daily_sales: avgDailySales,
      minimum_daily_sales: minimumDailySales,
      maximum_daily_sales: maximumDailySales,
      sales_data: group.sales_data,
      days_count: group.days_count,
      safety_stock: safetyStock,
      thresholds: {
        low: lowThreshold,
        medium: mediumThreshold,
        high: highThreshold,
      },
    };
  });

  return {
    data: mergedData,
    error: null,
  };
};
