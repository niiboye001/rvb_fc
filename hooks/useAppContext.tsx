import { createContext, ReactNode, useContext, useState } from "react";

interface ContextType {
  isShowing: boolean;
  toggleVisibility: () => void;
  // teams: { label: string; value: string }[] | undefined;
}

const AppContext = createContext<undefined | ContextType>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [isShowing, setIshowing] = useState(false);

  const toggleVisibility = () => {
    setIshowing(!isShowing);
  };

  return (
    <AppContext.Provider value={{ toggleVisibility, isShowing }}>{children}</AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within AppContextProvider");
  }

  return context;
};

export default useApp;
