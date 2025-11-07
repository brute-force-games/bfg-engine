import { Link, useLocation } from "@tanstack/react-router";
import { BruteForceGamesAppBar } from "../bfg-app-bar/app-bar";
import { Typography, Button, Box } from "../../bfg-ui";

interface DevToolItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const devTools: DevToolItem[] = [
  {
    id: "dev-home",
    label: "Dev Tools",
    path: "/dev",
    icon: "🛠️"
  },
  {
    id: "game-settings",
    label: "Game Settings",
    path: "/dev/game-settings",
    icon: "⚙️"
  },
  {
    id: "hosted-games",
    label: "Hosted Games",
    path: "/dev/hosted-games-manager",
    icon: "🎮"
  }
];

export const DevToolsAppBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <BruteForceGamesAppBar>
      <Box style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        width: '100%'
      }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '16px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Brute Force Games
          </Link>
        </Typography>
        
        <Box style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '4px 8px',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(255, 193, 7, 0.3)'
        }}>
          {devTools.map((tool) => {
            const isActive = currentPath === tool.path || 
                           (tool.path !== '/dev' && currentPath.startsWith(tool.path));
            
            return (
              <Link 
                key={tool.id} 
                to={tool.path} 
                style={{ textDecoration: 'none' }}
              >
                <Button 
                  variant={isActive ? "contained" : "text"}
                  size="small"
                  style={{ 
                    color: isActive ? 'white' : 'inherit',
                    backgroundColor: isActive ? '#ffc107' : 'transparent',
                    fontWeight: isActive ? 'bold' : 'normal',
                    minWidth: 'auto',
                    padding: '6px 12px',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ marginRight: '6px' }}>{tool.icon}</span>
                  {tool.label}
                </Button>
              </Link>
            );
          })}
        </Box>

        <Box style={{ 
          marginLeft: 'auto',
          padding: '4px 12px',
          backgroundColor: 'rgba(255, 243, 205, 0.8)',
          borderRadius: '4px',
          border: '1px solid #ffc107'
        }}>
          <Typography variant="caption" style={{ 
            color: '#856404',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            ⚠️ DEVELOPMENT MODE
          </Typography>
        </Box>
      </Box>
    </BruteForceGamesAppBar>
  );
};

