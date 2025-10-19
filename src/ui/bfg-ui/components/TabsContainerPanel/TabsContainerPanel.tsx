import { ReactNode } from "react";
import { Card } from "../Card";


// interface TabPanelProps<TTabId extends string = string> {
//   children?: ReactNode;
//   index: number;
//   value: number;
// }

// export const TabPanel = <TTabId extends string = string>(props: TabPanelProps<TTabId>) => {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box style={{ padding: '24px' }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// };

export interface TabInfo<TTabId extends string = string> {
  id: TTabId;
  // title: string;
  icon?: React.ReactElement;
  content: ReactNode;
}

export interface TabsContainerPanelProps<TTabId extends string = string> {
  tabs: TabInfo<TTabId>[];
  // tabPanels: Map<TTabId, ReactNode>;
  activeTabId: TTabId;
  tabColor?: string;
  // ariaLabel?: string;
}

export const TabsContainerPanel = <TTabId extends string = string>({
  tabs,
  activeTabId,
}: TabsContainerPanelProps<TTabId>) => {

  const tabIndex   = tabs.findIndex(tab => tab.id === activeTabId) ?? -1;

  if (tabIndex === -1) {
    throw new Error(`Tab with id ${activeTabId} not found`);
  }

  const tabPanel = tabs[tabIndex].content;

  return (
    <Card elevation={2}>
      {tabPanel}
    </Card>
  )

  // return (
  //   <Card elevation={2}>
  //     {tabs.map((tab, index) => (
  //       <TabPanel key={index} value={ tabValue} index={index}>
  //         {tab.content}
  //       </TabPanel>
  //     ))}
  //   </Card>
  // )
}
