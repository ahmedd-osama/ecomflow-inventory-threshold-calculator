"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { toast } from "sonner";
import { calculateThresholdsAction } from "./calculator-actions";
import { CalculatedThresholdResult } from "./calculator";

/**
 * Interface defining the shape of the calculator context
 * @interface CalculatorContextType
 * @property {File | null} file - The currently uploaded file
 * @property {function} setFile - Function to update the file state
 * @property {boolean} isUploading - Loading state during file processing
 * @property {function} setIsUploading - Function to update loading state
 * @property {CalculatedThresholdResult[] | null} results - Calculated threshold results
 * @property {function} setResults - Function to update results state
 * @property {function} calculateThresholds - Function to process file and calculate thresholds
 */
interface CalculatorContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  results: CalculatedThresholdResult[] | null;
  setResults: (results: CalculatedThresholdResult[] | null) => void;
  calculateThresholds: () => Promise<void>;
}

// Create context with undefined default value
const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

/**
 * Provider component that wraps app to provide calculator context
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider component
 */
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

  /**
   * Processes uploaded file and calculates inventory thresholds
   * Shows toast messages for success/error states
   * Updates results in context when successful
   */
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

/**
 * Custom hook to access calculator context
 * @throws {Error} If used outside of CalculatorContextProvider
 * @returns {CalculatorContextType} Calculator context value
 */
export function useCalculatorContext() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error(
      "useCalculatorContext must be used within a CalculatorProvider"
    );
  }
  return context;
}
