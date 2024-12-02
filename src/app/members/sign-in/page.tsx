'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import { View, Heading, Text, useTheme } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth'
import { Authenticator, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import awsExports from '@/aws-exports';
import '@aws-amplify/ui-react/styles.css';
import LoginPage from '@/components/pages/loginPage'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { sessionStorage } from 'aws-amplify/utils';
import { useSearchParams } from 'next/navigation';
import checkUserRole from '@/utils/checkOwnerStatus';
import MemberLoadingScreen from '@/components/pages/MemberPageLoading';

Amplify.configure(awsExports);


cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

const customTheme: Theme = {
  name: 'custom-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          '10': '#e3fcec', // Light green for backgrounds
          '80': '#4caf50', // Primary green
          '100': '#388e3c', // Darker green for emphasis
        },
        secondary: {
          '10': '#fff9e6', // Light yellow for backgrounds
          '80': '#ffeb3b', // Bright yellow for actions like buttons
          '100': '#fbc02d', // Darker yellow for emphasis
        },
      },
    },
    components: {
      // Customize the SignIn components, buttons, inputs, etc.
      button: {
        primary: {
          backgroundColor: '{colors.brand.primary.80}',
          _hover: {
            backgroundColor: '{colors.brand.secondary.80}',
          },
        },
      },
      input: {
        borderColor: '{colors.brand.primary.100}',
        _focus: {
          borderColor: '{colors.brand.secondary.100}',
        },
      },
    },
  },
};

const components = {
  Header() {
    //const { tokens } = useTheme();

    return (
      <div className="relative">
        {/* Add any custom header content if needed */}
      </div>
    );
  },

  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text color={tokens.colors.neutral[80]}>
          &copy; JanFind All Rights Reserved
        </Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Sign in to your Member account
        </Heading>
      );
    },
  },
};


const SignInPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const logOutParam = searchParams.get('logOut') === 'true';
      const redirectParam = searchParams.get('redirect') === 'true';
      setIsSigningOut(logOutParam);
      setIsRedirect(redirectParam);

      try {
        const user = await getCurrentUser();
        if (!user) {
          console.log('Redirecting to sign in due to no user');
          router.push('/members/signIn');
          return;
        }

        if (user && !logOutParam) {
          console.log('No Log out params')
          console.log(user)
          console.log('Begining status check')
          console.log('Checking status of email:', user?.signInDetails?.loginId)
          const isOwner = await checkUserRole(user?.username);
          if (isOwner === true) {
            console.log('Redirecting to owner page');
            router.push('/members/owner');
            return
          }
          if (isOwner === false) {
            console.log('Redirecting to CBO page');
            router.push('/members/cbo');
            return
          }
          else {
            return (
              <MemberLoadingScreen />
            )
          }
        }
      } catch (error) {
        console.log('Error during user check:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [router, searchParams]);

  if (isLoading) {
    return <MemberLoadingScreen />;
  }

  return (
    <div className="flex flex-col justify-center items-center pt-20">
      <button
        onClick={() => router.push('/members')}
        className="absolute top-4 left-4 flex items-center text-green-700 font-semibold hover:text-green-500 transition"
      >
        <span className="mr-1">&lt;</span> Back to Members Area
      </button>
      <ThemeProvider theme={customTheme}>
        <Authenticator hideSignUp components={components}>
          {({ signOut, user }) => (
            <LoginPage user={user} signOut={signOut ?? (() => { })} isSigningOut={isSigningOut} isRedirect={isRedirect} />
          )}
        </Authenticator>
      </ThemeProvider>
    </div>
  );
};

export default SignInPage;
