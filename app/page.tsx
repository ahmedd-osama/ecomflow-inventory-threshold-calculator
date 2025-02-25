import Image from "next/image";
import { Hero } from "./hero";
import { InventoryThresholdCalculator } from "./inventory-threshold-calculator";
import { LinesSeparator } from "@/components/lines-separator";
import { CalculatorContextProvider } from "./calculator-context";
export default function Home() {
  return (
    <div className="container p-0 border-x border-gray-400 min-h-screen  mx-auto bg-background">
      <Hero />
      <LinesSeparator />
      <CalculatorContextProvider>
        <InventoryThresholdCalculator />
      </CalculatorContextProvider>
    </div>
  );
}
