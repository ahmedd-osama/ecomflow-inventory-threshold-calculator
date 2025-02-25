"use client";
import { cn } from "@/lib/utils";
import { Loader2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface FileUploaderProps {
  value?: string;
  onChange: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
  isUploading?: boolean;
  className?: string;
  containerClassName?: string;
}

export const FileUploader = ({
  value,
  onChange,
  onRemove,
  disabled,
  isUploading,
  className,
  containerClassName,
}: FileUploaderProps) => {
  const [fileName, setFileName] = useState<string | undefined>(value);

  useEffect(() => {
    setFileName(value);
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setFileName(file.name);
        onChange(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
      // "application/pdf": [".pdf"],
    },
    disabled: disabled || isUploading,
    maxFiles: 1,
    // max size 1mb
    maxSize: 1 * 1024 * 1024,
    onDropRejected: (err) => {
      toast.error(err[0].errors[0].message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className={cn("mb-4 w-full", containerClassName)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100",
          isDragActive && "border-primary bg-primary/10",
          disabled && "cursor-not-allowed opacity-50",
          isUploading && "cursor-wait",
          className
        )}
      >
        <input {...getInputProps()} />
        {fileName ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{fileName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
                setFileName(undefined);
              }}
              className="rounded-full bg-rose-500 p-1 text-white shadow-sm transition hover:scale-110"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            {isUploading ? (
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            ) : (
              <Upload className="h-10 w-10 text-gray-400" />
            )}
            <p className="text-sm text-gray-500">
              {isDragActive
                ? "Drop the file here"
                : "Drag & drop an Excel file here, or click to select"}
            </p>
          </div>
        )}
      </div>
      {/* File upload info */}
      <p className="text-xs text-gray-500">
        Max Size: 1MB <br /> Accepted Files: .xlsx, .xls, .csv
      </p>
    </div>
  );
};
