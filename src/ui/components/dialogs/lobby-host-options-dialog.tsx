import { useState } from 'react';
import { LobbyOptions } from "@bfg-engine/models/p2p-lobby";
import { BfgSupportedGameTitle } from "@bfg-engine/models/game-box-definition";
import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Stack, 
  Typography, 
  FormControl, 
  Box, 
  DialogActions, 
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '../../bfg-ui'; 


interface LobbyHostOptionsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (lobbyOptions: LobbyOptions) => void;
  selectedGameChoice: BfgSupportedGameTitle | null;
  initialLobbyOptions: LobbyOptions;
}

export const LobbyHostOptionsDialog = ({ 
  open, 
  onClose, 
  onSave,
  selectedGameChoice,
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
        <Stack spacing={2} style={{ marginTop: '8px' }}>
          <Typography variant="body2" style={{ color: '#666' }}>
            Select which games will be available for players to choose from in this lobby.
          </Typography>
          
          <FormControl component="fieldset">
            <FormGroup>
              {allGameChoices.map((choice: BfgSupportedGameTitle) => {
                const isSelected = tempGameChoices.includes(choice);
                const isCurrentGame = choice === selectedGameChoice;
                return (
                  <FormControlLabel
                    key={choice}
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleGameChoiceChange(choice, e.target.checked)}
                        color="primary"
                        disabled={isCurrentGame}
                      />
                    }
                    label={choice}
                  />
                );
              })}
            </FormGroup>
          </FormControl>

          {tempGameChoices.length === 0 && (
            <Box style={{ marginTop: '16px' }}>
              <Typography variant="body2" style={{ color: '#f57c00', fontStyle: 'italic' }}>
                ⚠️ No games selected. Players won't be able to choose a game.
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
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
