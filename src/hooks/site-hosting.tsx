import { createContext, useContext } from "react";
import { GameFriendId, type BfgGameInstanceId } from "../models/types/bfg-branded-uuids";
import { TrysteroConfig } from "../models/trystero-config";

export type Environment = 'local' | 'dev' | 'staging' | 'production' | 'unknown';

export interface EnvSettings {
  envType: Environment;
  backgroundColor: string;
  pageTitlePrefix: string;
}

export interface SiteHostingContextType {
  // Site configuration
  getSiteTitle(): string;
  getTrysteroConfig(): TrysteroConfig;
  getBaseUrl(): string;
  
  // URL generation
  createFriendUrl: (friendId: GameFriendId) => string;
  createJoinGameUrl: (gameInstanceId: BfgGameInstanceId) => string;
  createHostedGameUrl: (gameInstanceId: BfgGameInstanceId) => string;
  createPlayerGameUrl: (gameInstanceId: BfgGameInstanceId) => string;
  createObserverGameUrl: (gameInstanceId: BfgGameInstanceId) => string;
  
  // Environment settings
  getEnvSettings(): EnvSettings;
  getAppVersion(): string;
}

export const SiteHostingContext = createContext<SiteHostingContextType>({
  getSiteTitle: () => {
    throw new Error('getSiteTitle not implemented');
  },
  getTrysteroConfig: () => {
    throw new Error('getTrysteroConfig not implemented');
  },
  getBaseUrl: () => {
    throw new Error('getBaseUrl not implemented');
  },
  createJoinGameUrl: () => {
    throw new Error('createJoinGameUrl not implemented');
  },
  createFriendUrl: () => {
    throw new Error('createFriendUrl not implemented');
  },
  createHostedGameUrl: () => {
    throw new Error('createHostedGameUrl not implemented');
  },
  createPlayerGameUrl: () => {  
    throw new Error('createPlayerGameUrl not implemented');
  },
  createObserverGameUrl: () => {
    throw new Error('createObserverGameUrl not implemented');
  },
  getEnvSettings: () => {
    throw new Error('getEnvSettings not implemented');
  },
  getAppVersion: () => {
    throw new Error('getAppVersion not implemented');
  },
});


interface SiteHostingProviderProps {
  children: React.ReactNode;
  siteHosting: SiteHostingContextType;
}


export const SiteHostingProvider = ({ children, siteHosting }: SiteHostingProviderProps) => {


  return (
    <SiteHostingContext.Provider
      value={siteHosting}
    >
      {children}
    </SiteHostingContext.Provider>
  );
}


export const useSiteHosting = () => {
  const siteHosting = useContext(SiteHostingContext);
  return siteHosting;
}
