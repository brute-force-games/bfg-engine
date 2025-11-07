import { AppBarTabItem } from "../tab-item-hook";


export interface NavSpineProps<TTabId extends string = string> {
  title: string;
  tabItems: readonly AppBarTabItem<TTabId>[];
  activeTabId: TTabId;
  onTabClicked: (tabId: TTabId) => void;
}