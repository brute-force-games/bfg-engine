import { ReactNode, useState } from "react";
import { Box } from "../Box";
import { Tabs, Tab } from "../Tabs";
import { Card } from "../Card";
import { Paper } from "../Paper";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ padding: '24px' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export interface TabInfo {
  title: string;
  icon?: React.ReactElement;
  content: ReactNode;
}

export interface TabsContainerPanelProps {
  tabs: TabInfo[];
  tabColor?: string;
  ariaLabel?: string;
}

export const TabsContainerPanel = ({
  tabs,
  tabColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  ariaLabel = "tabs"
}: TabsContainerPanelProps) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Card elevation={2}>
      <Paper 
        elevation={1} 
        style={{ 
          background: tabColor,
          color: 'white',
          borderRadius: '4px 4px 0 0'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.title}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Paper>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Card>
  );
};

