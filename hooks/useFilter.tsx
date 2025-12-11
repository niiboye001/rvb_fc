import { Id } from "@/convex/_generated/dataModel";
import React, { createContext, ReactNode, useContext, useState } from "react";

// Define your filter type
interface FilterValues {
  seasonId?: Id<"seasons">;
  yearId?: Id<"years">;
  //   teamId?: string;
  //   goalType?: "normal" | "own_goal" | "penalty";
}

interface FilterContextType {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
  // isHidden: boolean;
  // setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider component
export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterValues>({});
  // const [isHidden, setIsHidden] = useState(true);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>
  );
};

// Hook to use filter context
export const useFilters = () => {
  const context = useContext(FilterContext);

  if (!context) throw new Error("useFilters must be used within FilterProvider");

  return context;
};
