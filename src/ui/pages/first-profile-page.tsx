import { useState } from 'react';
import { usePlayerProfileActions } from '~/hooks/stores/use-my-player-profiles-store';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to BFG!
          </h1>
          <p className="text-gray-600">
            Create your first player profile to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
              Player Handle *
            </label>
            <input
              type="text"
              id="handle"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCreating}
              minLength={4}
              required
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 4 characters long
            </p>
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Avatar Image URL (optional)
            </label>
            <input
              type="url"
              id="avatarUrl"
              value={avatarImageUrl}
              onChange={(e) => setAvatarImageUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCreating}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isCreating || !handle.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your profile will include cryptographic keys for secure gameplay
          </p>
        </div>
      </div>
    </div>
  );
};
