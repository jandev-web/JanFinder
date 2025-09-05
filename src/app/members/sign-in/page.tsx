// app/sign-in/page.tsx - Custom <Authenticator>

"use client";
import { fetchAuthSession } from "aws-amplify/auth";
import { redirect } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { Authenticator, useAuthenticator, Button, View, Heading, Text, useTheme, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import MemberLandingHeader from '@/components/MemberLandingHeader';
import MemberLandingFooter from '@/components/MemberLandingFooter';
import LoadingSpinner from "@/components/loadingScreen";
import RoleRouter from "@/components/RouteSignInUser";
//cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);
import "@aws-amplify/ui-react/styles.css";

function HydrationGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    // Must be identical on server and client's first render
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  return <>{children}</>;
}

const customTheme: Theme = {
  name: 'custom-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          '10': '#E3E7FC',  // Light blue for backgrounds
          '80': '#001F54',  // Deep blue for primary elements
          '100': '#003A85'  // Darker blue for emphasis
      },
      secondary: {
          '10': '#FFFBEA',  // Soft yellow for backgrounds
          '80': '#FFEB3B',  // Bright yellow for call-to-actions
          '100': '#FBC02D'  // Darker yellow for emphasis
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
          &copy; Bid2Clean All Rights Reserved
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
    Footer() {
      const router = useRouter();
      const { toForgotPassword } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={() => router.push('/members/sign-up')}  // Fixed here
            size="small"
            variation="link"
          >
            Create Account
          </Button>
          <Button
            fontWeight="normal"
            onClick={toForgotPassword}
            size="small"
            variation="link"
          >
            Forgot Password?
          </Button>
        </View>
      );
    },
  },
};

function VerifiedGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState<null | boolean>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { tokens } = await fetchAuthSession({ forceRefresh: true });
        const ev = tokens?.idToken?.payload?.email_verified;
        const isVerified = ev === true || ev === "true";
        if (!alive) return;

        if (isVerified) {
          setReady(true);
        } else {
          setReady(false);
          router.replace("/members/sign-in/verify-email");
        }
      } catch {
        // If we can't read tokens for some reason, fall back to verify page
        setReady(false);
        router.replace("/members/sign-in/verify-email");
      }
    })();
    return () => { alive = false; };
  }, [router]);

  if (ready === null) return <LoadingSpinner />;
  return ready ? <>{children}</> : null;
}



function CustomAuthenticator() {
  const { user } = useAuthenticator((context) => [context.user]);
  if (user) {
    console.log('User signed in')
    console.log(user)
    // Once signed in, hand off to RoleRouter 
    return (
      <div className="flex flex-col w-full min-h-screen">
        <VerifiedGate>
          <RoleRouter user={user} />
        </VerifiedGate>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <MemberLandingHeader />

      <div className="relative min-h-screen flex items-center pt-10 pb-10 justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/janitorSignUpPic.jpeg')",
        }}>
        <div className="pt-24">
          <ThemeProvider theme={customTheme}>
            <Authenticator components={components} hideSignUp />
          </ThemeProvider>
        </div>
      </div>
      <MemberLandingFooter />
    </div>



  )
}

export default function Login() {
  return (
    <HydrationGate>
      <Authenticator.Provider>
        <CustomAuthenticator />
      </Authenticator.Provider>
    </HydrationGate>
  );
}
