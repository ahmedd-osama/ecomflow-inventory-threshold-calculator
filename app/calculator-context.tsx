"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { toast } from "sonner";
import { calculateThresholdsAction } from "./calculator-actions";
import { CalculatedThresholdResult } from "./calculator";

interface CalculatorContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  results: CalculatedThresholdResult[] | null;
  setResults: (results: CalculatedThresholdResult[] | null) => void;
  // TODO: update return type
  calculateThresholds: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export function CalculatorContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<CalculatedThresholdResult[] | null>(
    null
  );
  const calculateThresholds = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }
    setIsUploading(true);
    try {
      const response = await calculateThresholdsAction({ file });
      setIsUploading(false);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Thresholds calculated successfully");
        setResults(response.data);
      }
    } catch (error) {
      console.error({ error });
      toast.error("An error occurred while calculating thresholds");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <CalculatorContext.Provider
      value={{
        file,
        setFile,
        isUploading,
        setIsUploading,
        results,
        setResults,
        calculateThresholds,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculatorContext() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error(
      "useCalculatorContext must be used within a CalculatorProvider"
    );
  }
  return context;
}
