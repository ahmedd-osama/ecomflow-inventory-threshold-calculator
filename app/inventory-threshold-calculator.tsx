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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateThresholds();
  };

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
              <li>
                Upload an Excel file containing your historical sales data (
                <a href="/sample.csv" className="underline">
                  download sample
                </a>{" "}
                or{" "}
                <a href="/sample-with-error.csv" className="underline">
                  sample with error
                </a>
                )
              </li>
              <li>The file should include daily orders and inventory levels</li>
              <li>
                Click &quot;Calculate Thresholds&quot; to analyze your data
              </li>
              <li>
                The calculator will process your data and generate optimal
                inventory thresholds
              </li>
              <li>
                View the results showing low, medium and high threshold levels
              </li>
              <li>Use the interactive chart to visualize inventory patterns</li>
              <li>
                Review key metrics like average daily sales and safety stock
              </li>
            </ol>
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="w-3xl max-w-full mx-auto">
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
          <Button type="submit" className="w-full" size={"lg"}>
            {isUploading ? <Loading /> : "Calculate Thresholds"}
          </Button>
        </form>
      </div>
      {results && (
        <div className=" max-w-full mx-auto">
          <h2 className="text-3xl font-bold text-center">Results</h2>
          <div className="grid md:grid-cols-2 gap-y-8 gap-x-4">
            {results.map((result) => {
              return (
                <InventoryThresholdView key={result.product_id} data={result} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
