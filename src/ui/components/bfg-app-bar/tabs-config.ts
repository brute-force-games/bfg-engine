import { AppBarTabItem } from "./tab-item-hook";


export interface AppBarTabsConfig<TTabId extends string = string> {
  tabItems: readonly AppBarTabItem<TTabId>[];
  activeTabId: TTabId;
  onTabClicked: (tabId: TTabId) => void;
}
