import { useState } from 'react';

export type TabLink = {
  to: string;
}

export interface AppBarTabItem<TId extends string = string> {
  id: TId;
  label: string;
  icon?: React.ReactElement;
  link?: TabLink;
}

export interface UseTabItemsOptions<TId extends string> {
  initialActiveTabId: TId;
}

export interface UseTabItemsReturn<TId extends string> {
  // tabItems: readonly AppBarTabItem<TId>[];
  activeTabId: TId;
  // activeTabItem: AppBarTabItem<TId>;
  setActiveTabId: (tabId: TId) => void;
  // isTabActive: (tabId: TId) => boolean;
}


export const useTabItems = <TId extends string>(
  // tabItems: readonly AppBarTabItem<TId>[],
  initialActiveTabId: TId,
  // options: UseTabItemsOptions<TId> = {}
): UseTabItemsReturn<TId> => {
  
  const [activeTabId, setActiveTabId] = useState<TId>(initialActiveTabId);

  // // Get the currently active tab item
  // const activeTabItem = useMemo(() => {
  //   if (!activeTabId) return null;
  //   return tabItems.find(item => item.id === activeTabId) ?? null;
  // }, [tabItems, activeTabId]);

  // Check if a tab is active
  // const isTabActive = useCallback(
  //   (tabId: TId) => activeTabId === tabId,
  //   [activeTabId]
  // );

  return {
    // tabItems,
    activeTabId,
    // activeTabItem,
    setActiveTabId,
    // isTabActive,
  };
};

