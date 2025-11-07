import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '../../bfg-ui/index';
import { useAppSettings, useAppSettingsActions } from '../../../hooks/stores/use-my-app-settings-store';
import { GameSpineLocation, GameLogPanelLocation, PlayerAgentMode } from '~/models/app-settings';
import { SharedSettingsFields } from './shared-settings-fields';


interface AppSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AppSettingsDialog = ({ open, onClose }: AppSettingsDialogProps) => {
  const currentSettings = useAppSettings();
  const { updateSettings } = useAppSettingsActions();

  // Local state for form values (don't save until user clicks Save)
  // Initialize with current settings
  const [formValues, setFormValues] = useState<{
    gameSpineLocation: GameSpineLocation;
    gameLogPanelLocation: GameLogPanelLocation;
    playerAgentMode: PlayerAgentMode;
  }>(() => ({
    gameSpineLocation: currentSettings.gameSpineLocation,
    gameLogPanelLocation: currentSettings.gameLogPanelLocation,
    playerAgentMode: currentSettings.playerAgentMode,
  }));

  // Update form values when dialog opens
  useEffect(() => {
    if (open) {
      setFormValues({
        gameSpineLocation: currentSettings.gameSpineLocation,
        gameLogPanelLocation: currentSettings.gameLogPanelLocation,
        playerAgentMode: currentSettings.playerAgentMode,
      });
    }
  }, [open, currentSettings.gameSpineLocation, currentSettings.gameLogPanelLocation, currentSettings.playerAgentMode]);

  const handleSave = () => {
    updateSettings(formValues);
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
      <DialogTitle>App Settings</DialogTitle>
      <DialogContent>
        <SharedSettingsFields
          gameSpineLocation={formValues.gameSpineLocation}
          gameLogPanelLocation={formValues.gameLogPanelLocation}
          playerAgentMode={formValues.playerAgentMode}
          onGameSpineLocationChange={handleGameSpineLocationChange}
          onGameLogPanelLocationChange={handleGameLogPanelLocationChange}
          onPlayerAgentModeChange={handlePlayerAgentModeChange}
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

