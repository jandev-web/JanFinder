import { Auth } from 'aws-amplify';
import { useEffect } from 'react';

const AutoSignOut = () => {
  const inactivityTime = 15 * 60 * 1000; // 15 minutes in milliseconds
  let logoutTimer;

  // Reset the timer whenever there's user activity
  const resetTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => handleSignOut(), inactivityTime);
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut(); // Sign out the user
      window.location.reload(); // Optionally reload the page or redirect
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Set event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    // Start the initial timer
    resetTimer();

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  return null;
};

export default AutoSignOut;
