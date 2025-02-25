"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";
import { FileUploader } from "./file-uploader";
import { toast } from "sonner";
import { useCalculatorContext } from "./calculator-context";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { InventoryThresholdView } from "./inventory-threshold-view";
export const InventoryThresholdCalculator = () => {
  const { setFile, isUploading, results, calculateThresholds } =
    useCalculatorContext();
  return (
    <div className="px-4 md:px-8 pb-24">
      <div className="flex flex-col items-center justify-center gap-4 py-8  ">
        <h2 className="text-3xl font-bold">Start Here</h2>
        <Alert variant="success" className="[&>svg]:size-6">
          <CircleAlert />
          <AlertTitle className="text-lg text-foreground">
            How to use this calculator:
          </AlertTitle>
          <AlertDescription>
            <ol className="list-decimal pl-4 space-y-2 text-foreground text-base">
              <li>Enter your historical sales data for the product</li>
              <li>Input your current inventory levels and reorder costs</li>
              <li>Specify your desired service level and lead time</li>
              <li>
                The calculator will analyze your data and determine optimal
                reorder points
              </li>
              <li>
                Review the suggested minimum and maximum inventory thresholds
              </li>
              <li>
                Use the generated insights to optimize your inventory management
              </li>
            </ol>
          </AlertDescription>
        </Alert>
        <div className="w-3xl max-w-full mx-auto">
          <FileUploader
            onChange={(file) => {
              setFile(file);
            }}
            onRemove={() => {
              toast.error("File removed");
              setFile(null);
            }}
            disabled={isUploading}
            isUploading={isUploading}
          />
          <Button className="w-full" size={"lg"} onClick={calculateThresholds}>
            {isUploading ? <Loading /> : "Calculate Thresholds"}
          </Button>
        </div>
      </div>
      {results && (
        <div className=" max-w-full mx-auto">
          <h2 className="text-3xl font-bold text-center">Results</h2>
          {results.map((result) => {
            return (
              <InventoryThresholdView key={result.product_id} data={result} />
            );
          })}
        </div>
      )}
    </div>
  );
};
