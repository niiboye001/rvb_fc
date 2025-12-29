import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { createContext, ReactNode, useContext } from "react";

interface YearType {
  year: string;
  yearId: string; // or Id<"years"> if you want to keep Convex type
}

interface YearContextType {
  years: YearType[];
}

interface YearProviderProps {
  children: ReactNode;
}

const YearContext = createContext<YearContextType>({ years: [] });

export const YearContextProvider = ({ children }: YearProviderProps) => {
  // const [yid, setYid] = useState();
  // const [sid, setSid] = useState();

  const allYears = useQuery(api.seasons.getAllYears); // use the correct query

  // Transform Convex data into YearType[]
  const years: YearType[] =
    allYears ? allYears.map((y) => ({ year: y.year, yearId: y._id.toString() })) : [];

  return <YearContext.Provider value={{ years }}>{children}</YearContext.Provider>;
};

// Custom hook
export const useYear = () => useContext(YearContext);
