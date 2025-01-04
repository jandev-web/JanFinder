'use client';

import { useEffect } from "react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function LoggingOut() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(); // Sign out the user
        router.push("/members"); // Redirect to the login page
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

    logout();
  }, [router]); // Empty dependency array ensures it runs once on mount

  return (
    <div>Logging out...</div>
  ); // Render nothing during the logout process
}
