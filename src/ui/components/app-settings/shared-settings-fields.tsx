import { Select, Option, Stack } from '../../bfg-ui/index';
import { GameSpineLocation, GameLogPanelLocation, PlayerAgentMode } from '~/models/app-settings';

interface SharedSettingsFieldsProps {
  gameSpineLocation: GameSpineLocation;
  gameLogPanelLocation: GameLogPanelLocation;
  playerAgentMode: PlayerAgentMode;
  onGameSpineLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onGameLogPanelLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onPlayerAgentModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  showInheritedValue?: boolean;
  inheritedValues?: {
    gameSpineLocation?: GameSpineLocation;
    gameLogPanelLocation?: GameLogPanelLocation;
    playerAgentMode?: PlayerAgentMode;
  };
}

export const SharedSettingsFields = ({
  gameSpineLocation,
  gameLogPanelLocation,
  playerAgentMode,
  onGameSpineLocationChange,
  onGameLogPanelLocationChange,
  onPlayerAgentModeChange,
  showInheritedValue = false,
  inheritedValues = {},
}: SharedSettingsFieldsProps) => {
  const gameSpineLocationOptions: { value: GameSpineLocation; label: string }[] = [
    { value: 'nav-bar', label: 'Navigation Bar' },
    { value: 'top', label: 'Top of Screen' },
    { value: 'left', label: 'Left Side' },
    { value: 'right', label: 'Right Side' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'hidden', label: 'Hidden' },
  ];

  const gameLogPanelLocationOptions: { value: GameLogPanelLocation; label: string }[] = [
    { value: 'none', label: 'None (Hidden)' },
    { value: 'left', label: 'Left Side' },
    { value: 'right', label: 'Right Side' },
  ];

  const playerAgentModeOptions: { value: PlayerAgentMode; label: string }[] = [
    { value: 'none', label: 'None (Manual Play)' },
    { value: 'chaotic-random', label: 'Chaotic Random' },
    { value: 'try-to-win', label: 'Try to Win' },
    { value: 'try-to-lose', label: 'Try to Lose' },
  ];

  const getFieldLabel = (baseLabel: string, currentValue: any, inheritedValue: any) => {
    if (showInheritedValue && inheritedValue !== undefined && currentValue !== inheritedValue) {
      return `${baseLabel} (inherited: ${inheritedValue})`;
    }
    return baseLabel;
  };

  return (
    <Stack spacing={3} style={{ paddingTop: '8px' }}>
      <Select
        label={getFieldLabel('Game Spine Location', gameSpineLocation, inheritedValues.gameSpineLocation)}
        value={gameSpineLocation}
        onChange={onGameSpineLocationChange}
        fullWidth
      >
        {gameSpineLocationOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      
      <Select
        label={getFieldLabel('Game Log Panel Location', gameLogPanelLocation, inheritedValues.gameLogPanelLocation)}
        value={gameLogPanelLocation}
        onChange={onGameLogPanelLocationChange}
        fullWidth
      >
        {gameLogPanelLocationOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      
      <Select
        label={getFieldLabel('Player Agent Mode', playerAgentMode, inheritedValues.playerAgentMode)}
        value={playerAgentMode}
        onChange={onPlayerAgentModeChange}
        fullWidth
      >
        {playerAgentModeOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Stack>
  );
};

