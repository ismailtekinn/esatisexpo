import React, { createContext, useContext, useState, ReactNode } from "react";

// Context oluştur
type FileTypeContext = {
  selectedFileType: string;
  setSelectedFileType: (value: string) => void;
};

const FileTypeContext = createContext<FileTypeContext | undefined>(undefined);

// Provider
export const FileTypeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFileType, setSelectedFileType] = useState("Fiş");

  return (
    <FileTypeContext.Provider value={{ selectedFileType, setSelectedFileType }}>
      {children}
    </FileTypeContext.Provider>
  );
};

// Context hook
export const useFileType = () => {
  const context = useContext(FileTypeContext);
  if (!context) throw new Error("useFileType must be used within FileTypeProvider");
  return context;
};
