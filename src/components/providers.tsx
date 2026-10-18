import SocketContextProvider from "@/contexts/socketio";
import Preloader from "./preloader";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/toaster";

import { TooltipProvider } from "./ui/tooltip";

import { GameContextProvider } from "@/contexts/game-context";
import MotionPreferences from "./motion-preferences";
import { PortfolioContentProvider } from "@/contexts/portfolio-content";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    disableTransitionOnChange
  >
    <PortfolioContentProvider>
      <MotionPreferences>
        <Preloader>
        <SocketContextProvider>
          <GameContextProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </GameContextProvider>
          <Toaster />
        </SocketContextProvider>
        </Preloader>
      </MotionPreferences>
    </PortfolioContentProvider>
  </ThemeProvider>;
};
