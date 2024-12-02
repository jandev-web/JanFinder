'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { signOut } from 'aws-amplify/auth';

interface LoggingOutProps {
    user: any;
}

const LoggingOut: React.FC<LoggingOutProps> = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // useEffect to handle the logout process
    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Perform logout
                await signOut();
                sessionStorage.removeItem('attributes');
            } catch (error) {
                console.error('Error during logout:', error);
            } finally {
                setLoading(false);
                // Redirect to the members page after logging out
                router.push('/members');
            }
        };

        handleLogout();
    }, [user, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="logging-out">
            <p>Logging Out {user?.sub}...</p>
        </div>
    );
};

export default LoggingOut;
