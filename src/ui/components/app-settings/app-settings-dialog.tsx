import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  Option,
  Stack,
} from '../../bfg-ui/index';
import { useAppSettings, useAppSettingsActions } from '../../../hooks/stores/use-my-app-settings-store';
import { GameSpineLocation } from '../../../tb-store/app-settings-store';

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
  }>(() => ({
    gameSpineLocation: currentSettings.gameSpineLocation,
  }));

  // Update form values when dialog opens
  useEffect(() => {
    if (open) {
      setFormValues({
        gameSpineLocation: currentSettings.gameSpineLocation,
      });
    }
  }, [open, currentSettings.gameSpineLocation]);

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

  const gameSpineLocationOptions: { value: GameSpineLocation; label: string }[] = [
    { value: 'nav-bar', label: 'Navigation Bar' },
    { value: 'top', label: 'Top of Screen' },
    { value: 'left', label: 'Left Side' },
    { value: 'right', label: 'Right Side' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'hidden', label: 'Hidden' },
  ];


  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>App Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={3} style={{ paddingTop: '8px' }}>
          <Select
            label="Game Spine Location"
            value={formValues.gameSpineLocation}
            onChange={handleGameSpineLocationChange}
            fullWidth
          >
            {gameSpineLocationOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Stack>
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

