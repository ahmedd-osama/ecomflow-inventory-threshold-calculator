"use server";

import * as XLSX from "xlsx";
import { CalculatedThresholdResult } from "./calculator";
import { z } from "zod";

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

  // Group data by product_id
  const groupedData: Record<string, CalculatedThresholdResult> =
    validatedData.reduce((acc, curr) => {
      if (!acc[curr.product_id]) {
        acc[curr.product_id] = {
          product_id: curr.product_id,
          product_name: curr.product_name,
          sales_data: [],
          avg_daily_sales: 0,
          avg_lead_time_days: 0,
          days_count: 0,
        };
      }

      acc[curr.product_id].sales_data.push({
        date: curr.date,
        inventory_level: curr.inventory_level,
        orders: curr.orders,
        lead_time_days: curr.lead_time_days,
      });

      acc[curr.product_id].avg_daily_sales += curr.orders;
      acc[curr.product_id].avg_lead_time_days += curr.lead_time_days;
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

    return {
      product_id: group.product_id,
      product_name: group.product_name,
      avg_lead_time_days: Math.round(
        group.avg_lead_time_days / group.days_count
      ),
      avg_daily_sales: Math.round(group.avg_daily_sales / group.days_count),
      sales_data: group.sales_data,
      days_count: group.days_count,
    };
  });

  // Handling Inventory Threshold Calculations

  console.log({
    sales_data: mergedData[0].sales_data,
    productData: mergedData[0],
  });

  return {
    data: mergedData,
    error: null,
  };
};
