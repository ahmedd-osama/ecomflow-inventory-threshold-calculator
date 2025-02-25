"use client";
import { CalculatedThresholdResult } from "./calculator";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

export const InventoryThresholdView = ({
  data,
}: {
  data: CalculatedThresholdResult;
}) => {
  const chartConfig = {
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-1))",
    },
    inventory: {
      label: "Inventory",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const chartData = data.sales_data.map((sale) => ({
    date: new Date(sale.date).toLocaleDateString(),
    orders: sale.orders,
    inventory: sale.inventory_level,
  }));

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">{data.product_name}</h2>
        <p className="text-gray-600">Product ID: {data.product_id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales & Inventory Trends</CardTitle>
          <CardDescription>
            Historical view of orders and inventory levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 2,
                right: 45,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="orders"
                type="natural"
                fill="none"
                stroke="black"
                stackId="a"
              />
              <Area
                dataKey="inventory"
                type="natural"
                fill="none"
                stroke="green"
                stackId="a"
              />
              <ReferenceArea
                y1={data.thresholds?.high}
                y2={Infinity}
                fill="rgba(0, 128, 0, 0.1)"
                strokeOpacity={0}
              />
              <ReferenceArea
                y1={data.thresholds?.medium}
                y2={data.thresholds?.high}
                fill="rgba(255, 255, 0, 0.1)"
                strokeOpacity={0}
              />
              <ReferenceArea
                y1={data.thresholds?.low}
                y2={data.thresholds?.medium}
                fill="rgba(255, 165, 0, 0.2)"
                strokeOpacity={0}
              />
              <ReferenceArea
                y1={0}
                y2={data.thresholds?.low}
                fill="rgba(255, 0, 0, 0.3)"
                strokeOpacity={0}
              />
              <ReferenceLine
                y={data.thresholds?.high}
                stroke="green"
                strokeDasharray="3 3"
                label={{ value: "High ", position: "right" }}
              />
              <ReferenceLine
                y={data.thresholds?.medium}
                stroke="yellow"
                strokeDasharray="3 3"
                label={{ value: "Medium ", position: "right" }}
              />
              <ReferenceLine
                y={data.thresholds?.low}
                stroke="red"
                strokeDasharray="3 3"
                label={{ value: "Low ", position: "right" }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Average Daily Sales: {data.avg_daily_sales} units{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Total Days Analyzed: {data.days_count}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-3 rounded">
          <h3 className="font-semibold">Sales Statistics</h3>
          <ul className="space-y-1">
            <li>
              Average Daily Sales: <Badge>{data.avg_daily_sales} Units</Badge>
            </li>
            <li>
              Minimum Daily Sales:{" "}
              <Badge>{data.minimum_daily_sales} Units</Badge>
            </li>
            <li>
              Maximum Daily Sales:{" "}
              <Badge>{data.maximum_daily_sales} Units</Badge>
            </li>
            <li>
              Total Days: <Badge>{data.days_count} Units</Badge>
            </li>
          </ul>
        </div>

        <div className="border p-3 rounded">
          <h3 className="font-semibold">Lead Time & Safety Stock</h3>
          <ul className="space-y-1">
            <li>
              Average Lead Time: <Badge>{data.avg_lead_time_days} days</Badge>
            </li>
            <li>
              Safety Stock: <Badge>{data.safety_stock} Units</Badge>
            </li>
          </ul>
        </div>
      </div>

      {data.thresholds && (
        <div className="border p-3 rounded">
          <h3 className="font-semibold">Inventory Thresholds</h3>
          <ul className="space-y-1">
            <li>
              Low Threshold:{" "}
              <Badge variant="destructive">{data.thresholds.low} Units</Badge>
            </li>
            <li>
              Medium Threshold:{" "}
              <Badge variant="warning">{data.thresholds.medium} Units</Badge>
            </li>
            <li>
              High Threshold:{" "}
              <Badge variant="success">{data.thresholds.high} Units</Badge>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
