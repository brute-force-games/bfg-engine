import { useState } from 'react';
import { 
  useMyPlayerProfiles, 
  useMyDefaultPlayerProfile, 
  usePlayerProfileActions 
} from '../../hooks/stores/use-my-player-profiles-store';
import { PrivatePlayerProfile } from '../../models/player-profile/private-player-profile';
import { PlayerProfileId } from '../../models/types/bfg-branded-ids';
import { CryptoTestDialog } from '../../ui/components/dialogs/crypto-test-dialog';

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
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      minWidth: '300px',
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          marginRight: '12px',
          fontSize: '18px'
        }}>
          👤
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {profile.handle}
          </h3>
          {isDefault && (
            <span style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              ⭐ Default
            </span>
          )}
        </div>
      </div>
      
      {profile.avatarImageUrl && (
        <div style={{ marginBottom: '12px' }}>
          <img 
            src={profile.avatarImageUrl} 
            alt={`${profile.handle} avatar`}
            style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              objectFit: 'cover' 
            }}
          />
        </div>
      )}
      
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
        <div>Created: {new Date(profile.createdAt).toLocaleDateString()}</div>
        <div>Updated: {new Date(profile.updatedAt).toLocaleDateString()}</div>
      </div>
      
      {/* Seed Words Section */}
      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={toggleSeedWords}
          style={{
            padding: '6px 12px',
            backgroundColor: showSeedWords ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginBottom: '8px'
          }}
        >
          {showSeedWords ? '🔒 Hide Seed Words' : '🔑 Show Seed Words'}
        </button>
        
        {showSeedWords && (
          <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #ffeaa7',
            marginBottom: '8px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>
              ⚠️ SECURITY WARNING
            </div>
            <div style={{ fontSize: '11px', marginBottom: '8px' }}>
              Never share these seed words with anyone. Anyone with these words can access your profile and funds.
            </div>
            {/* <div style={{
              backgroundColor: '#f8f9fa',
              padding: '8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              wordBreak: 'break-all',
              border: '1px solid #dee2e6'
            }}>
              {profile.walletMnemonic}
            </div> */}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onSetDefault(profile.id as PlayerProfileId)}
          disabled={isDefault}
          style={{
            padding: '8px 16px',
            backgroundColor: isDefault ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isDefault ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {isDefault ? '⭐ Default' : 'Set as Default'}
        </button>
        
        <button
          onClick={() => onTestCrypto(profile)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔐 Test Crypto
        </button>
        
        <button
          onClick={() => onDelete(profile.id as PlayerProfileId)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Delete
        </button>
      </div>
    </div>
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
  const [formData, setFormData] = useState({
    handle: '',
    avatarImageUrl: '',
    isDefault: false,
  });

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
      setFormData({ handle: '', avatarImageUrl: '', isDefault: false });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ handle: '', avatarImageUrl: '', isDefault: false });
      setError(null);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>Add New Player Profile</h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Profile Handle *
            </label>
            <input
              type="text"
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your player handle"
              required
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Avatar Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.avatarImageUrl}
              onChange={(e) => setFormData({ ...formData, avatarImageUrl: e.target.value })}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                disabled={isSubmitting}
                style={{ marginRight: '8px' }}
              />
              Set as default profile
            </label>
          </div>
          
          <div style={{
            backgroundColor: '#d1ecf1',
            color: '#0c5460',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #bee5eb'
          }}>
            This profile will be created with cryptographic keys for secure move signing. 
            All data is stored locally on your device.
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.handle.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: isSubmitting || !formData.handle.trim() ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting || !formData.handle.trim() ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MyPlayerProfilesPage = () => {
  const profiles = useMyPlayerProfiles();
  const defaultProfile = useMyDefaultPlayerProfile();
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#333' }}>
        My Player Profiles
      </h1>
      
      <div style={{
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        padding: '16px',
        borderRadius: '4px',
        marginBottom: '24px',
        border: '1px solid #bee5eb'
      }}>
        Player profiles are stored locally on your device with cryptographic keys for secure move signing.
        No server storage is used - all data remains private to you.
      </div>

      {!hasProfiles && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '24px',
          border: '1px solid #ffeaa7'
        }}>
          No player profiles found. Create your first profile to get started.
        </div>
      )}

      {hasProfiles && !hasDefaultProfile && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '24px',
          border: '1px solid #ffeaa7'
        }}>
          No default player profile set. Please set one as your default profile.
        </div>
      )}

      {/* {hasDefaultProfile && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '24px',
          border: '1px solid #c3e6cb'
        }}>
          Default profile: <strong>{defaultProfile.handle}</strong>
        </div>
      )} */}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setShowAddDialog(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ➕ Add Profile
        </button>
        
        {hasProfiles && (
          <button
            onClick={handleClearAll}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🗑️ Clear All Profiles
          </button>
        )}
      </div>

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
    </div>
  );
};