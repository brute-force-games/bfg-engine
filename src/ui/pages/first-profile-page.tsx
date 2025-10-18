import { useState } from 'react';
import { usePlayerProfileActions } from '../../hooks/stores/use-my-player-profiles-store';
import { Container, Paper, Typography, TextField, Button, Alert, Stack, Box } from '../bfg-ui';

/**
 * Page for creating the first player profile
 * This is shown when no profiles exist in the system
 */
export const FirstProfilePage = () => {
  console.log('FirstProfilePage rendering...');
  
  const [handle, setHandle] = useState('');
  const [avatarImageUrl, setAvatarImageUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addProfile, setDefault } = usePlayerProfileActions();
  
  console.log('FirstProfilePage state:', { handle, isCreating, error });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!handle.trim()) {
      setError('Please enter a handle');
      return;
    }

    if (handle.length < 4) {
      setError('Handle must be at least 4 characters long');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const profileId = await addProfile(handle.trim(), avatarImageUrl.trim() || undefined);
      
      // Set this as the default profile since it's the first one
      await setDefault(profileId);
      
      // The ProfileGuard will automatically redirect to the main app
      // once it detects that profiles exist
    } catch (err) {
      setError('Failed to create profile. Please try again.');
      console.error('Error creating first profile:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={2} style={{ padding: '24px' }}>
          <Stack spacing={3}>
            <Box style={{ textAlign: 'center' }}>
              <Typography variant="h4" style={{ marginBottom: '8px' }}>
                Welcome to BFG!
              </Typography>
              <Typography variant="body1" color="secondary">
                Create your first player profile to get started
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Box>
                  <TextField
                    fullWidth
                    label="Player Handle *"
                    value={handle}
                    onChange={(e) => {
                      console.log('Input changed, value:', e.target.value);
                      try {
                        setHandle(e.target.value);
                        console.log('setHandle called successfully');
                      } catch (error) {
                        console.error('Error in setHandle:', error);
                      }
                    }}
                    onFocus={() => console.log('Input focused')}
                    onBlur={() => console.log('Input blurred')}
                    placeholder="Enter your player handle"
                    disabled={isCreating}
                    required
                    autoFocus
                    minLength={4}
                  />
                  <Typography variant="caption" color="secondary" style={{ display: 'block', marginTop: '4px' }}>
                    Must be at least 4 characters long
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Avatar Image URL (optional)"
                  type="url"
                  value={avatarImageUrl}
                  onChange={(e) => setAvatarImageUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isCreating}
                />

                {error && (
                  <Alert severity="error">{error}</Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isCreating || !handle.trim()}
                  size="large"
                >
                  {isCreating ? 'Creating Profile...' : 'Create Profile'}
                </Button>
              </Stack>
            </form>

            <Box style={{ textAlign: 'center' }}>
              <Typography variant="caption" color="secondary">
                Your profile will include cryptographic keys for secure gameplay
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
