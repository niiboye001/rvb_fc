import { createContext, ReactNode, useContext, useState } from "react";

interface ContextType {
  isShowing: boolean;
  toggleVisibility: () => void;
  handleVisibility: (s: string) => void;
  showPlayers: boolean;
  showTeamSquad: boolean;
  showNewPlayerForm: boolean;
  showUpdateForm: boolean;
  // teams: { label: string; value: string }[] | undefined;
}

const AppContext = createContext<undefined | ContextType>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [isShowing, setIshowing] = useState(false);
  const [showNewPlayerForm, setShowNewPlayerForm] = useState(false);
  const [showPlayers, setShowPlayers] = useState(true);
  const [showTeamSquad, setShowTeamSquad] = useState(false);
  const [showUpdateForm, setUpdateForm] = useState(false);

  const handleVisibility = (s: string) => {
    if (s === "np") {
      setShowNewPlayerForm(true);
      setShowPlayers(false);
      setShowTeamSquad(false);
      setUpdateForm(false);
    } else if (s === "p") {
      setShowPlayers(true);
      setShowNewPlayerForm(false);
      setShowTeamSquad(false);
      setUpdateForm(false);
    } else if (s === "ts") {
      setShowTeamSquad(true);
      setShowPlayers(false);
      setShowNewPlayerForm(false);
      setUpdateForm(false);
    } else if (s === "up") {
      setUpdateForm(true);
      setShowTeamSquad(false);
      setShowPlayers(false);
      setShowNewPlayerForm(false);
    }
  };

  const toggleVisibility = () => {
    setIshowing(!isShowing);
  };

  return (
    <AppContext.Provider
      value={{
        toggleVisibility,
        isShowing,
        handleVisibility,
        showNewPlayerForm,
        showPlayers,
        showTeamSquad,
        showUpdateForm,
      }}>
      {children}
    </AppContext.Provider>
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
