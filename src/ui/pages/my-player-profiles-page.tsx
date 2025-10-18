import { useState, useEffect } from 'react';
import { 
  useMyPlayerProfiles, 
  useRiskyMyDefaultPlayerProfile, 
  usePlayerProfileActions 
} from '../../hooks/stores/use-my-player-profiles-store';
import { PrivatePlayerProfile } from '../../models/player-profile/private-player-profile';
import { PlayerProfileId } from '../../models/types/bfg-branded-ids';
import { CryptoTestDialog } from '../../ui/components/dialogs/crypto-test-dialog';
import { NoActivityAppBar } from '../components/app-bars/no-activity-app-bar';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '../bfg-ui';

interface PlayerProfileCardProps {
  profile: PrivatePlayerProfile;
  isDefault: boolean;
  onSetDefault: (profileId: PlayerProfileId) => void;
  onDelete: (profileId: PlayerProfileId) => void;
  onTestCrypto: (profile: PrivatePlayerProfile) => void;
}

const PlayerProfileCard = ({ 
  profile, 
  isDefault, 
  onSetDefault, 
  onDelete,
  onTestCrypto
}: PlayerProfileCardProps) => {
  const [showSeedWords, setShowSeedWords] = useState(false);
  
  const toggleSeedWords = () => {
    setShowSeedWords(!showSeedWords);
  };
  
  return (
    <Card style={{ minWidth: '300px', maxWidth: '400px', margin: '8px' }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          {profile.avatarImageUrl ? (
            <Avatar src={profile.avatarImageUrl} alt={profile.handle} size="large" />
          ) : (
            <Avatar size="large">👤</Avatar>
          )}
          <Stack spacing={0}>
            <Typography variant="h6">
              {profile.handle}
            </Typography>
            {isDefault && (
              <Chip label="⭐ Default" color="primary" size="small" />
            )}
          </Stack>
        </Stack>
        
        <Stack spacing={0}>
          <Typography variant="body2" color="secondary">
            Created: {new Date(profile.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="secondary">
            Updated: {new Date(profile.updatedAt).toLocaleDateString()}
          </Typography>
        </Stack>
        
        {/* Seed Words Section */}
        <Stack spacing={1}>
          <Button
            onClick={toggleSeedWords}
            variant="contained"
            color={showSeedWords ? 'error' : 'secondary'}
            size="small"
          >
            {showSeedWords ? '🔒 Hide Seed Words' : '🔑 Show Seed Words'}
          </Button>
          
          {showSeedWords && (
            <Alert severity="warning">
              <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                ⚠️ SECURITY WARNING
              </Typography>
              <Typography variant="caption">
                Never share these seed words with anyone. Anyone with these words can access your profile and funds.
              </Typography>
            </Alert>
          )}
        </Stack>
        
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            onClick={() => onSetDefault(profile.id as PlayerProfileId)}
            disabled={isDefault}
            variant="contained"
            color="primary"
            size="small"
          >
            {isDefault ? '⭐ Default' : 'Set as Default'}
          </Button>
          
          <Button
            onClick={() => onTestCrypto(profile)}
            variant="contained"
            color="success"
            size="small"
          >
            🔐 Test Crypto
          </Button>
          
          <Button
            onClick={() => onDelete(profile.id as PlayerProfileId)}
            variant="contained"
            color="error"
            size="small"
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

interface AddProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { handle: string; avatarImageUrl?: string; isDefault: boolean }) => Promise<void>;
  existingProfiles: PrivatePlayerProfile[];
}

const AddProfileDialog = ({ open, onClose, onSubmit, existingProfiles }: AddProfileDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasNoProfiles = existingProfiles.length === 0;
  const [formData, setFormData] = useState({
    handle: '',
    avatarImageUrl: '',
    isDefault: hasNoProfiles,
  });

  // Update isDefault when dialog opens or profile count changes
  useEffect(() => {
    if (open) {
      setFormData(prev => ({ ...prev, isDefault: hasNoProfiles }));
    }
  }, [open, hasNoProfiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.handle.trim()) {
      setError('Handle is required');
      return;
    }

    if (existingProfiles.some(p => p.handle === formData.handle)) {
      setError('This handle is already taken');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit({
        handle: formData.handle.trim(),
        avatarImageUrl: formData.avatarImageUrl.trim() || undefined,
        isDefault: formData.isDefault
      });
      setFormData({ handle: '', avatarImageUrl: '', isDefault: hasNoProfiles });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ handle: '', avatarImageUrl: '', isDefault: hasNoProfiles });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Player Profile</DialogTitle>
      
      <DialogContent>
        <form onSubmit={handleSubmit} id="add-profile-form">
          <Stack spacing={3}>
            {error && (
              <Alert severity="error">{error}</Alert>
            )}
            
            <TextField
              label="Profile Handle"
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              disabled={isSubmitting}
              placeholder="Enter your player handle"
              required
              fullWidth
            />
            
            <TextField
              label="Avatar Image URL (optional)"
              type="url"
              value={formData.avatarImageUrl}
              onChange={(e) => setFormData({ ...formData, avatarImageUrl: e.target.value })}
              disabled={isSubmitting}
              placeholder="https://example.com/avatar.jpg"
              fullWidth
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  disabled={isSubmitting || hasNoProfiles}
                />
              }
              label={hasNoProfiles ? "Set as default profile (required for first profile)" : "Set as default profile"}
              disabled={hasNoProfiles}
            />
            
            <Alert severity="info">
              This profile will be created with cryptographic keys for secure move signing. 
              All data is stored locally on your device.
            </Alert>
          </Stack>
        </form>
      </DialogContent>
      
      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-profile-form"
          disabled={isSubmitting || !formData.handle.trim()}
          variant="contained"
          color="primary"
        >
          {isSubmitting ? 'Creating...' : 'Create Profile'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const MyPlayerProfilesPage = () => {
  const profiles = useMyPlayerProfiles();
  const defaultProfile = useRiskyMyDefaultPlayerProfile();
  const { addProfile, removeProfile, setDefault, clearAll } = usePlayerProfileActions();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCryptoTestDialog, setShowCryptoTestDialog] = useState(false);
  const [selectedProfileForCryptoTest, setSelectedProfileForCryptoTest] = useState<PrivatePlayerProfile | null>(null);

  const handleAddProfile = async (data: { handle: string; avatarImageUrl?: string; isDefault: boolean }) => {
    const newProfileId = await addProfile(data.handle, data.avatarImageUrl);
    
    if (data.isDefault) {
      await setDefault(newProfileId);
    }
  };

  const handleDeleteProfile = async (profileId: PlayerProfileId) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      await removeProfile(profileId);
    }
  };

  const handleSetDefault = async (profileId: PlayerProfileId) => {
    await setDefault(profileId);
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL player profiles? This action cannot be undone.')) {
      clearAll();
    }
  };

  const handleTestCrypto = (profile: PrivatePlayerProfile) => {
    setSelectedProfileForCryptoTest(profile);
    setShowCryptoTestDialog(true);
  };

  const handleCloseCryptoTestDialog = () => {
    setShowCryptoTestDialog(false);
    setSelectedProfileForCryptoTest(null);
  };

  const hasProfiles = profiles.length > 0;
  const hasDefaultProfile = !!defaultProfile;

  return (
    <>
      <NoActivityAppBar />
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography variant="h1" gutterBottom>
            My Player Profiles
          </Typography>
        
        <Alert severity="info">
          Player profiles are stored locally on your device with cryptographic keys for secure move signing.
          No server storage is used - all data remains private to you.
        </Alert>

        {!hasProfiles && (
          <Alert severity="warning">
            No player profiles found. Create your first profile to get started.
          </Alert>
        )}

        {hasProfiles && !hasDefaultProfile && (
          <Alert severity="warning">
            No default player profile set. Please set one as your default profile.
          </Alert>
        )}

        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => setShowAddDialog(true)}
            variant="contained"
            color="primary"
            size="large"
          >
            ➕ Add Profile
          </Button>
          
          {hasProfiles && (
            <Button
              onClick={handleClearAll}
              variant="contained"
              color="error"
              size="large"
            >
              🗑️ Clear All Profiles
            </Button>
          )}
        </Stack>

        {hasProfiles && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '16px',
            justifyContent: 'flex-start'
          }}>
            {profiles.map((profile) => (
              <PlayerProfileCard
                key={profile.id}
                profile={profile}
                isDefault={defaultProfile?.id === profile.id}
                onSetDefault={handleSetDefault}
                onDelete={handleDeleteProfile}
                onTestCrypto={handleTestCrypto}
              />
            ))}
          </div>
        )}

        <AddProfileDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSubmit={handleAddProfile}
          existingProfiles={profiles}
        />

        {selectedProfileForCryptoTest && (
          <CryptoTestDialog
            open={showCryptoTestDialog}
            onClose={handleCloseCryptoTestDialog}
            profile={selectedProfileForCryptoTest}
          />
        )}
      </Stack>
    </Container>
    </>
  );
};