import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '../../bfg-ui/index';
import { useUserGameSettings, useUserGameSettingsActions } from '../../../hooks/stores/use-user-game-settings-store';
import { useAppSettings } from '../../../hooks/stores/use-my-app-settings-store';
import { GameSpineLocation, GameLogPanelLocation, PlayerAgentMode } from '~/models/app-settings';
import { BfgSupportedGameTitle } from '~/models/game-box-definition';
import { UserGameSettings } from '~/models/user-game-settings';
import { SharedSettingsFields } from './shared-settings-fields';

interface GameSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  gameTitle: BfgSupportedGameTitle;
}

export const GameSettingsDialog = ({ open, onClose, gameTitle }: GameSettingsDialogProps) => {
  const currentSettings = useUserGameSettings(gameTitle);
  const appSettings = useAppSettings();
  const { updateSettings } = useUserGameSettingsActions(gameTitle);

  // Local state for form values (don't save until user clicks Save)
  const [formValues, setFormValues] = useState<{
    gameSpineLocation: GameSpineLocation;
    gameLogPanelLocation: GameLogPanelLocation;
    playerAgentMode: PlayerAgentMode;
  }>(() => ({
    gameSpineLocation: currentSettings.gameSpineLocation ?? appSettings.gameSpineLocation,
    gameLogPanelLocation: currentSettings.gameLogPanelLocation ?? appSettings.gameLogPanelLocation,
    playerAgentMode: currentSettings.playerAgentMode,
  }));

  // Update form values when dialog opens
  useEffect(() => {
    if (open) {
      setFormValues({
        gameSpineLocation: currentSettings.gameSpineLocation ?? appSettings.gameSpineLocation,
        gameLogPanelLocation: currentSettings.gameLogPanelLocation ?? appSettings.gameLogPanelLocation,
        playerAgentMode: currentSettings.playerAgentMode,
      });
    }
  }, [
    open,
    currentSettings.gameSpineLocation,
    currentSettings.gameLogPanelLocation,
    currentSettings.playerAgentMode,
    appSettings.gameSpineLocation,
    appSettings.gameLogPanelLocation,
  ]);

  const handleSave = () => {
    // Only save values that differ from inherited values (app settings)
    // If a value matches what would be inherited, save it as undefined to allow inheritance
    const settingsToSave: Partial<UserGameSettings> = {
      playerAgentMode: formValues.playerAgentMode,
    };

    // Only set gameSpineLocation if it differs from app settings
    if (formValues.gameSpineLocation !== appSettings.gameSpineLocation) {
      settingsToSave.gameSpineLocation = formValues.gameSpineLocation;
    } else {
      settingsToSave.gameSpineLocation = undefined;
    }

    // Only set gameLogPanelLocation if it differs from app settings
    if (formValues.gameLogPanelLocation !== appSettings.gameLogPanelLocation) {
      settingsToSave.gameLogPanelLocation = formValues.gameLogPanelLocation;
    } else {
      settingsToSave.gameLogPanelLocation = undefined;
    }

    updateSettings(settingsToSave);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleGameSpineLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues({
      ...formValues,
      gameSpineLocation: event.target.value as GameSpineLocation,
    });
  };

  const handleGameLogPanelLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues({
      ...formValues,
      gameLogPanelLocation: event.target.value as GameLogPanelLocation,
    });
  };

  const handlePlayerAgentModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues({
      ...formValues,
      playerAgentMode: event.target.value as PlayerAgentMode,
    });
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Game Settings: {gameTitle}</DialogTitle>
      <DialogContent>
        <SharedSettingsFields
          gameSpineLocation={formValues.gameSpineLocation}
          gameLogPanelLocation={formValues.gameLogPanelLocation}
          playerAgentMode={formValues.playerAgentMode}
          onGameSpineLocationChange={handleGameSpineLocationChange}
          onGameLogPanelLocationChange={handleGameLogPanelLocationChange}
          onPlayerAgentModeChange={handlePlayerAgentModeChange}
          showInheritedValue={true}
          inheritedValues={{
            gameSpineLocation: appSettings.gameSpineLocation,
            gameLogPanelLocation: appSettings.gameLogPanelLocation,
            playerAgentMode: appSettings.playerAgentMode,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

