import { Link } from "@tanstack/react-router";
import { Typography, Box, Button } from "~/ui/bfg-ui";
import { NavSpineProps } from "./types";


export const DesktopBarView = <TTabId extends string = string>(props: NavSpineProps<TTabId>) => {
  const { title, tabItems, activeTabId, onTabChange } = props;
  
  return (
    <>
      <Typography
        variant="h6"
        component="div"
        style={{ fontWeight: 'bold', flexShrink: 0 }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          {title}
        </Link>
      </Typography>
      
      <Box style={{ 
        display: 'flex', 
        gap: '16px',
        flexShrink: 1,
        minWidth: 0,
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
      }}>

      {tabItems.map((tabItem) => {
        const isActive = activeTabId === tabItem.id;
        return tabItem.link ? (
          <Link key={tabItem.id} to={tabItem.link.to} style={{ textDecoration: 'none' }}>
            <Button 
              variant="text" 
              style={{ 
                color: 'inherit',
                fontWeight: isActive ? 'bold' : 'normal',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                outline: 'none'
              }}
            >
              {tabItem.icon}
              {tabItem.label}
            </Button>
          </Link>
        ) : (
          <Button
            key={tabItem.id}
            variant="text"
            style={{ 
              color: 'inherit',
              fontWeight: isActive ? 'bold' : 'normal',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              outline: 'none'
            }}
            onClick={() => onTabChange(tabItem.id)}
          >
            {tabItem.icon}
            {tabItem.label}
          </Button>
        );
      })}

      </Box>
    </>  
  )
}
