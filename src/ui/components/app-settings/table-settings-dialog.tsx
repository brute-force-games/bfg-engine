import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '../../bfg-ui/index';
import { useUserGameTableSettings, useUserGameTableSettingsActions } from '../../../hooks/stores/use-user-game-table-settings-store';
import { useUserGameSettings } from '../../../hooks/stores/use-user-game-settings-store';
import { useAppSettings } from '../../../hooks/stores/use-my-app-settings-store';
import { GameSpineLocation, GameLogPanelLocation, PlayerAgentMode } from '../../../models/app-settings';
import { BfgGameTableId } from '../../../models/types/bfg-branded-uuids';
import { BfgSupportedGameTitle } from '../../../models/game-box-definition';
import { UserGameTableSettings } from '../../../models/user-game-table-settings';
import { SharedSettingsFields } from './shared-settings-fields';

interface TableSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  gameTableId: BfgGameTableId;
  gameTitle: BfgSupportedGameTitle;
  tableName: string | null;
}

export const TableSettingsDialog = ({ open, onClose, gameTableId, gameTitle, tableName }: TableSettingsDialogProps) => {
  const currentSettings = useUserGameTableSettings(gameTableId);
  const gameSettings = useUserGameSettings(gameTitle);
  const appSettings = useAppSettings();
  const { updateSettings } = useUserGameTableSettingsActions(gameTableId);

  // Get effective inherited values (game settings override app settings)
  const getInheritedValue = <T,>(tableValue: T | undefined, gameValue: T | undefined, appValue: T): T => {
    if (tableValue !== undefined) return tableValue;
    if (gameValue !== undefined) return gameValue;
    return appValue;
  };

  // Local state for form values (don't save until user clicks Save)
  const [formValues, setFormValues] = useState<{
    gameSpineLocation: GameSpineLocation;
    gameLogPanelLocation: GameLogPanelLocation;
    playerAgentMode: PlayerAgentMode;
  }>(() => ({
    gameSpineLocation: getInheritedValue(
      currentSettings.gameSpineLocation,
      gameSettings.gameSpineLocation,
      appSettings.gameSpineLocation
    ),
    gameLogPanelLocation: getInheritedValue(
      currentSettings.gameLogPanelLocation,
      gameSettings.gameLogPanelLocation,
      appSettings.gameLogPanelLocation
    ),
    playerAgentMode: currentSettings.playerAgentMode,
  }));

  // Update form values when dialog opens
  useEffect(() => {
    if (open) {
      setFormValues({
        gameSpineLocation: getInheritedValue(
          currentSettings.gameSpineLocation,
          gameSettings.gameSpineLocation,
          appSettings.gameSpineLocation
        ),
        gameLogPanelLocation: getInheritedValue(
          currentSettings.gameLogPanelLocation,
          gameSettings.gameLogPanelLocation,
          appSettings.gameLogPanelLocation
        ),
        playerAgentMode: currentSettings.playerAgentMode,
      });
    }
  }, [
    open,
    currentSettings.gameSpineLocation,
    currentSettings.gameLogPanelLocation,
    currentSettings.playerAgentMode,
    gameSettings.gameSpineLocation,
    gameSettings.gameLogPanelLocation,
    appSettings.gameSpineLocation,
    appSettings.gameLogPanelLocation,
  ]);

  const handleSave = () => {
    // Only save values that differ from inherited values
    // If a value matches what would be inherited, save it as undefined to allow inheritance
    const settingsToSave: Partial<UserGameTableSettings> = {
      playerAgentMode: formValues.playerAgentMode,
    };

    // Only set gameSpineLocation if it differs from inherited value
    const inheritedGameSpineLocation = gameSettings.gameSpineLocation ?? appSettings.gameSpineLocation;
    if (formValues.gameSpineLocation !== inheritedGameSpineLocation) {
      settingsToSave.gameSpineLocation = formValues.gameSpineLocation;
    } else {
      settingsToSave.gameSpineLocation = undefined;
    }

    // Only set gameLogPanelLocation if it differs from inherited value
    const inheritedGameLogPanelLocation = gameSettings.gameLogPanelLocation ?? appSettings.gameLogPanelLocation;
    if (formValues.gameLogPanelLocation !== inheritedGameLogPanelLocation) {
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

  // Calculate what the inherited values would be if table-specific settings weren't applied
  const inheritedValues = {
    gameSpineLocation: gameSettings.gameSpineLocation ?? appSettings.gameSpineLocation,
    gameLogPanelLocation: gameSettings.gameLogPanelLocation ?? appSettings.gameLogPanelLocation,
    playerAgentMode: gameSettings.playerAgentMode ?? appSettings.playerAgentMode,
  };

  const dialogTitle = tableName 
    ? `Table Settings - ${gameTitle}: ${tableName}`
    : `Table Settings - ${gameTitle}`;

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <SharedSettingsFields
          gameSpineLocation={formValues.gameSpineLocation}
          gameLogPanelLocation={formValues.gameLogPanelLocation}
          playerAgentMode={formValues.playerAgentMode}
          onGameSpineLocationChange={handleGameSpineLocationChange}
          onGameLogPanelLocationChange={handleGameLogPanelLocationChange}
          onPlayerAgentModeChange={handlePlayerAgentModeChange}
          showInheritedValue={true}
          inheritedValues={inheritedValues}
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

