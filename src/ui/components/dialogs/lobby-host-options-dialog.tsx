import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
  Box
} from '@mui/material';
import { LobbyOptions } from '~/models/p2p-lobby';
import { BfgSupportedGameTitle } from '~/models/game-box-definition';
import { useGameRegistry } from '~/hooks/games-registry/games-registry';


interface LobbyHostOptionsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (lobbyOptions: LobbyOptions) => void;
  initialLobbyOptions: LobbyOptions;
}

export const LobbyHostOptionsDialog = ({ 
  open, 
  onClose, 
  onSave, 
  initialLobbyOptions 
}: LobbyHostOptionsDialogProps) => {
  const [tempGameChoices, setTempGameChoices] = useState<BfgSupportedGameTitle[]>(
    initialLobbyOptions.gameChoices
  );

  const gameRegistry = useGameRegistry();
  const allGameChoices = gameRegistry.getAvailableGameTitles();

  const handleGameChoiceChange = (gameChoice: BfgSupportedGameTitle, checked: boolean) => {
    if (checked) {
      setTempGameChoices(prev => [...prev, gameChoice]);
    } else {
      setTempGameChoices(prev => prev.filter(choice => choice !== gameChoice));
    }
  };

  const handleSave = () => {
    const updatedLobbyOptions: LobbyOptions = {
      ...initialLobbyOptions,
      gameChoices: tempGameChoices,
    };
    onSave(updatedLobbyOptions);
    onClose();
  };

  const handleCancel = () => {
    // Reset to initial state
    setTempGameChoices(initialLobbyOptions.gameChoices);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Configure Game Choices
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Select which games will be available for players to choose from in this lobby.
          </Typography>
          
          <FormControl component="fieldset">
            <FormGroup>
              {allGameChoices.map((choice: BfgSupportedGameTitle) => {
                const isSelected = tempGameChoices.includes(choice);
                return (
                  <FormControlLabel
                    key={choice}
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleGameChoiceChange(choice, e.target.checked)}
                        color="primary"
                      />
                    }
                    label={choice}
                  />
                );
              })}
            </FormGroup>
          </FormControl>

          {tempGameChoices.length === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="warning.main" fontStyle="italic">
                ⚠️ No games selected. Players won't be able to choose a game.
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          color="primary"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
