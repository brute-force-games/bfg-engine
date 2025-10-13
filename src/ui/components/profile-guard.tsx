import { useEffect, useState } from 'react';
import { FirstProfilePage } from '../pages/first-profile-page';
import { useMyPlayerProfiles } from '~/hooks/stores/use-my-player-profiles-store';


interface ProfileGuardProps {
  children: React.ReactNode;
}

/**
 * Guard component that ensures at least one player profile exists
 * Routes to first profile creation page if no profiles exist
 */
export const ProfileGuard = ({ children }: ProfileGuardProps) => {

  // console.log("ProfileGuard");

  const profiles = useMyPlayerProfiles();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give TinyBase a moment to load from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking for profiles
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If no profiles exist, show the first profile creation page
  if (profiles.length === 0) {
    return <FirstProfilePage />;
  }

  // If profiles exist, render the protected content
  return <>{children}</>;
};
